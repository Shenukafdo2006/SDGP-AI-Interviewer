const { randomUUID } = require("crypto");
const aiService = require("../services/ai.service");
const { db, admin } = require("../config/firebase-interview");

const sessions = new Map();
const MAX_QUESTIONS = 5;
const MAX_QUESTION_GENERATION_ATTEMPTS = 3;
const interviewSessionsCollection = db.collection("interview_sessions");

const clampEngagement = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;
  return Math.min(Math.max(numeric, 1), 10);
};

const normalizeFacialSample = (sample) => {
  if (!sample || typeof sample !== "object") return null;
  return {
    expression: sample.expression || "unknown",
    eye_contact: sample.eye_contact || "unknown",
    engagement_level: clampEngagement(sample.engagement_level),
    concerns: Array.isArray(sample.concerns) ? sample.concerns : [],
    posture: sample.posture || "unknown",
    timestamp: sample.timestamp || sample.capturedAt || new Date().toISOString(),
  };
};

const toFacialSamples = (facialData) => {
  if (!facialData) return [];
  if (Array.isArray(facialData)) {
    return facialData.map(normalizeFacialSample).filter(Boolean);
  }
  if (Array.isArray(facialData.samples)) {
    return facialData.samples.map(normalizeFacialSample).filter(Boolean);
  }
  const one = normalizeFacialSample(facialData);
  return one ? [one] : [];
};

const normalizeQuestion = (question = "") =>
  String(question)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();

const isDuplicateQuestion = (question, previousQuestions = []) => {
  const normalizedCandidate = normalizeQuestion(question);
  if (!normalizedCandidate) return true;
  return previousQuestions.some(
    (previous) => normalizeQuestion(previous) === normalizedCandidate
  );
};

const buildFallbackQuestion = (session, attempt = 0) => {
  const fallbacks = [
    `Walk me through a challenging project you delivered as a ${session.role}, including your specific technical decisions and trade-offs.`,
    `Describe a situation where you had to debug a difficult issue under pressure. What was your process and final outcome?`,
    `How would you plan and execute your first 90 days in a ${session.role} role at the ${session.level} level?`,
    `Tell me about a time you disagreed with a teammate on implementation details. How did you resolve it and what did you learn?`,
    `If asked to improve performance of a production feature, how would you identify bottlenecks and prioritize improvements?`,
  ];
  return fallbacks[attempt % fallbacks.length];
};

const serializeSession = (session) => ({
  id: session.id,
  role: session.role ?? null,
  level: session.level ?? null,
  interviewType: session.interviewType ?? "Mixed",
  questions: Array.isArray(session.questions) ? session.questions : [],
  answers: Array.isArray(session.answers) ? session.answers : [],
  currentIndex: Number.isFinite(session.currentIndex) ? session.currentIndex : 0,
  status: session.status || "in_progress",
  createdAt: session.createdAt || new Date().toISOString(),
  completedAt: session.completedAt || null,
  facialAnalysis: Array.isArray(session.facialAnalysis)
    ? session.facialAnalysis
    : [],
  feedback: session.feedback || null,
});

const cacheSession = (session) => {
  sessions.set(session.id, session);
  return session;
};

const persistSession = async (session) => {
  const payload = serializeSession(session);
  await interviewSessionsCollection.doc(session.id).set(
    {
      ...payload,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

const persistSessionSafely = async (session) => {
  try {
    await persistSession(session);
  } catch (error) {
    console.warn(`Failed to persist interview session ${session.id}:`, error.message);
  }
};

const getSessionById = async (sessionId) => {
  if (!sessionId) return null;

  if (sessions.has(sessionId)) {
    return sessions.get(sessionId);
  }

  try {
    const snapshot = await interviewSessionsCollection.doc(sessionId).get();
    if (!snapshot.exists) {
      return null;
    }

    return cacheSession(snapshot.data());
  } catch (error) {
    console.warn(`Failed to load interview session ${sessionId}:`, error.message);
    return null;
  }
};

const startInterview = async (req, res) => {
  try {
    const { role, level, interviewType } = req.body || {};

    if (!role || !level || !interviewType) {
      return res.status(400).json({
        error: "Missing required fields: role, level, interviewType",
      });
    }

    const sessionId = randomUUID();

    // Generate first AI question
    let firstQuestion;
    try {
      const questionData = await aiService.generateQuestion(
        role,
        level,
        interviewType,
        {}
      );
      firstQuestion = questionData.question;
    } catch (aiError) {
      console.error("AI Service error:", aiError);
      // Fallback to basic question if AI service fails
      firstQuestion = `Tell me about yourself and your interest in the ${role} role.`;
    }

    const session = {
      id: sessionId,
      role: role || null,
      level: level || null,
      interviewType: interviewType || "Mixed",
      questions: [firstQuestion],
      answers: [],
      currentIndex: 0,
      status: "in_progress",
      createdAt: new Date().toISOString(),
      completedAt: null,
      facialAnalysis: [],
      feedback: null,
    };

    cacheSession(session);
    await persistSessionSafely(session);

    res.json({
      sessionId,
      question: firstQuestion,
      index: 0,
      total: "variable", // Will generate questions dynamically
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer, facialData } = req.body || {};

    const session = await getSessionById(sessionId);

    if (!sessionId || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== "in_progress") {
      return res.status(400).json({ error: "Interview already completed" });
    }

    const currentQuestion = session.questions[session.currentIndex];

    // Evaluate answer using AI
    let evaluation;
    try {
      evaluation = await aiService.evaluateAnswer(
        currentQuestion,
        answer || "",
        session.role,
        session.level
      );
    } catch (aiError) {
      console.error("AI evaluation error:", aiError);
      // Fallback scoring if AI service fails
      evaluation = {
        score: Math.min(Math.max(answer.length / 20, 1), 10),
        strengths: ["Provided a response"],
        improvements: ["Try adding more detail"],
        feedback: "Good attempt. Focus on providing specific examples.",
      };
    }

    // Store live facial analysis samples (single payload or array payload)
    const facialSamples = toFacialSamples(facialData);
    if (facialSamples.length > 0) {
      facialSamples.forEach((sample) => {
        session.facialAnalysis.push({
          questionIndex: session.currentIndex,
          data: sample,
          timestamp: sample.timestamp || new Date().toISOString(),
        });
      });
    }

    // Store answer with evaluation
    session.answers.push({
      questionIndex: session.currentIndex,
      question: currentQuestion,
      answer: answer || "",
      evaluation: evaluation,
      answeredAt: new Date().toISOString(),
    });

    session.currentIndex += 1;

    // Decide if interview is complete
    const isComplete = session.currentIndex >= MAX_QUESTIONS;

    if (isComplete) {
      session.status = "completed";
      session.completedAt = new Date().toISOString();
      await persistSessionSafely(session);

      // Calculate average score
      const avgScore =
        session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
        session.answers.length;

      return res.json({
        sessionId,
        status: session.status,
        message: "Interview completed!",
        completedAt: session.completedAt,
        stats: {
          totalQuestions: session.answers.length,
          averageScore: Math.round(avgScore * 10) / 10,
          answers: session.answers,
          facialAnalysis: session.facialAnalysis,
        },
      });
    }

    // Generate next unique question
    let nextQuestion;
    const previousQuestions = [...session.questions];
    const averageScore =
      session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
      session.answers.length;
    const lastAnswer = session.answers[session.answers.length - 1];

    for (let attempt = 0; attempt < MAX_QUESTION_GENERATION_ATTEMPTS; attempt += 1) {
      try {
        const sessionContext = {
          questionsAsked: session.currentIndex,
          averageScore,
          previousQuestions,
          lastAnswerSummary: {
            question: lastAnswer?.question || "",
            score: lastAnswer?.evaluation?.score || 0,
            strengths: lastAnswer?.evaluation?.strengths || [],
            improvements: lastAnswer?.evaluation?.improvements || [],
          },
        };

        const questionData = await aiService.generateQuestion(
          session.role,
          session.level,
          session.interviewType,
          sessionContext
        );

        if (!isDuplicateQuestion(questionData?.question, previousQuestions)) {
          nextQuestion = questionData.question;
          break;
        }
      } catch (aiError) {
        console.error("Failed to generate next question:", aiError);
      }
    }

    if (!nextQuestion) {
      let fallbackAttempt = 0;
      do {
        nextQuestion = buildFallbackQuestion(session, fallbackAttempt);
        fallbackAttempt += 1;
      } while (
        isDuplicateQuestion(nextQuestion, previousQuestions) &&
        fallbackAttempt < 10
      );
    }

    session.questions.push(nextQuestion);
    await persistSessionSafely(session);

    res.json({
      sessionId,
      question: nextQuestion,
      lastEvaluation: evaluation,
      index: session.currentIndex,
      status: "in_progress",
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: "Failed to submit answer" });
  }
};

const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSessionById(sessionId);

    if (!sessionId || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Calculate statistics
    const avgScore =
      session.answers.length > 0
        ? session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
          session.answers.length
        : 0;

    res.json({
      sessionId: session.id,
      role: session.role,
      level: session.level,
      interviewType: session.interviewType,
      status: session.status,
      currentIndex: session.currentIndex,
      totalQuestionsAnswered: session.answers.length,
      averageScore: Math.round(avgScore * 10) / 10,
      createdAt: session.createdAt,
      answers: session.answers,
      facialAnalysis: session.facialAnalysis,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
};

const analyzeFacialData = async (req, res) => {
  try {
    const { frameBase64, frame_base64, currentQuestion, question } = req.body || {};
    const imageFrame = frameBase64 || frame_base64;
    const activeQuestion = currentQuestion || question || null;

    if (!imageFrame) {
      return res.status(400).json({ error: "Frame data required" });
    }

    // Call Gemini Vision API via AI service
    const analysis = await aiService.analyzeFacialExpression(imageFrame, activeQuestion);

    res.json({
      success: true,
      analysis: {
        expression: analysis.expression,
        eye_contact: analysis.eye_contact,
        engagement_level: analysis.engagement_level,
        concerns: analysis.concerns,
        posture: analysis.posture,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error analyzing facial expression:", error);
    res.status(500).json({
      error: "Failed to analyze facial expression",
      message: error.message,
    });
  }
};

const getSessionFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSessionById(sessionId);

    if (!sessionId || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== "completed") {
      return res.status(400).json({
        error: "Session must be completed before generating feedback",
      });
    }

    if (session.feedback) {
      return res.json({
        success: true,
        sessionId,
        feedback: session.feedback,
      });
    }

    // Calculate average score
    const avgScore =
      session.answers.length > 0
        ? session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
          session.answers.length
        : 0;

    // Prepare session data for comprehensive feedback
    const sessionData = {
      role: session.role,
      level: session.level,
      interview_type: session.interviewType,
      average_score: Math.round(avgScore * 10) / 10,
      qa_pairs: session.answers.map(a => ({
        question: a.question,
        answer: a.answer,
        score: a.evaluation?.score || 0,
        feedback: a.evaluation?.feedback || "",
      })),
      facial_engagement: session.facialAnalysis.length > 0
        ? {
            data_points: session.facialAnalysis.length,
            average_engagement: Math.round(
              session.facialAnalysis.reduce((sum, f) => sum + (f.data?.engagement_level || 5), 0) /
              session.facialAnalysis.length
            ),
          }
        : null,
    };

    // Call Gemini to generate comprehensive feedback
    const feedback = await aiService.getInterviewFeedback(sessionData);
    session.feedback = {
      summary: feedback.summary || "Interview completed successfully",
      strengths: feedback.strengths || [],
      improvements: feedback.improvements || [],
      action_items: feedback.action_items || [],
      next_steps: feedback.next_steps || [],
      average_score: Math.round(avgScore * 10) / 10,
      total_questions: session.answers.length,
      interview_type: session.interviewType,
      generatedAt: new Date().toISOString(),
    };
    await persistSessionSafely(session);

    res.json({
      success: true,
      sessionId,
      feedback: session.feedback,
    });
  } catch (error) {
    console.error("Error generating session feedback:", error);
    res.status(500).json({
      error: "Failed to generate feedback",
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getSession,
  analyzeFacialData,
  getSessionFeedback,
};
