const { randomUUID } = require("crypto");
const aiService = require("../services/ai.service");

const sessions = new Map();

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
      facialAnalysis: [],
    };

    sessions.set(sessionId, session);

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

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessions.get(sessionId);

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

    // Store facial analysis if provided
    if (facialData) {
      session.facialAnalysis.push({
        questionIndex: session.currentIndex,
        data: facialData,
        timestamp: new Date().toISOString(),
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
    // For now, let's do 5 questions per interview
    const MAX_QUESTIONS = 5;
    const isComplete = session.currentIndex >= MAX_QUESTIONS;

    if (isComplete) {
      session.status = "completed";

      // Calculate average score
      const avgScore =
        session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
        session.answers.length;

      return res.json({
        sessionId,
        status: session.status,
        message: "Interview completed!",
        completedAt: new Date().toISOString(),
        stats: {
          totalQuestions: session.answers.length,
          averageScore: Math.round(avgScore * 10) / 10,
          answers: session.answers,
          facialAnalysis: session.facialAnalysis,
        },
      });
    }

    // Generate next question
    let nextQuestion;
    try {
      const sessionContext = {
        questionsAsked: session.currentIndex,
        averageScore:
          session.answers.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) /
          session.answers.length,
      };

      const questionData = await aiService.generateQuestion(
        session.role,
        session.level,
        session.interviewType,
        sessionContext
      );
      nextQuestion = questionData.question;
    } catch (aiError) {
      console.error("Failed to generate next question:", aiError);
      nextQuestion = `Tell me about your experience with ${session.role} responsibilities.`;
    }

    session.questions.push(nextQuestion);

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

const getSession = (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessions.get(sessionId);

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
    const { frameBase64, currentQuestion } = req.body;

    if (!frameBase64) {
      return res.status(400).json({ error: "Frame data required" });
    }

    // Call Gemini Vision API via AI service
    const analysis = await aiService.analyzeFacialExpression(frameBase64, currentQuestion);

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

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessions.get(sessionId);

    if (session.status !== "completed") {
      return res.status(400).json({
        error: "Session must be completed before generating feedback",
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

    res.json({
      success: true,
      sessionId,
      feedback: {
        summary: feedback.summary || "Interview completed successfully",
        strengths: feedback.strengths || [],
        improvements: feedback.improvements || [],
        action_items: feedback.action_items || [],
        next_steps: feedback.next_steps || [],
        average_score: Math.round(avgScore * 10) / 10,
        total_questions: session.answers.length,
        interview_type: session.interviewType,
      },
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
