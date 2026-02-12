const { randomUUID } = require("crypto");

const sessions = new Map();

const BASE_QUESTIONS = [
  "Tell me about yourself.",
  "Describe a time you solved a difficult problem.",
  "How do you prioritize tasks under a tight deadline?",
  "What is a recent project you are proud of and why?",
  "How do you handle feedback and criticism?",
];

const buildQuestions = (role, level) => {
  const questions = [...BASE_QUESTIONS];

  if (role) {
    questions.unshift(`Why are you interested in a ${role} role?`);
  }

  if (level) {
    questions.push(`What does success look like for a ${level} candidate in this role?`);
  }

  return questions;
};

const startInterview = (req, res) => {
  const { role, level } = req.body || {};
  const questions = buildQuestions(role, level);
  const sessionId = randomUUID();

  const session = {
    id: sessionId,
    role: role || null,
    level: level || null,
    questions,
    answers: [],
    currentIndex: 0,
    status: "in_progress",
    createdAt: new Date().toISOString(),
  };

  sessions.set(sessionId, session);

  res.json({
    sessionId,
    question: questions[0],
    index: 0,
    total: questions.length,
  });
};

const submitAnswer = (req, res) => {
  const { sessionId, answer } = req.body || {};

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(404).json({ error: "Session not found" });
  }

  const session = sessions.get(sessionId);

  if (session.status !== "in_progress") {
    return res.status(400).json({ error: "Interview already completed" });
  }

  session.answers.push({
    question: session.questions[session.currentIndex],
    answer: answer || "",
    answeredAt: new Date().toISOString(),
  });

  session.currentIndex += 1;

  if (session.currentIndex >= session.questions.length) {
    session.status = "completed";

    return res.json({
      sessionId,
      status: session.status,
      total: session.questions.length,
      answers: session.answers,
    });
  }

  res.json({
    sessionId,
    question: session.questions[session.currentIndex],
    index: session.currentIndex,
    total: session.questions.length,
  });
};

const getSession = (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(404).json({ error: "Session not found" });
  }

  const session = sessions.get(sessionId);

  res.json({
    sessionId: session.id,
    role: session.role,
    level: session.level,
    status: session.status,
    currentIndex: session.currentIndex,
    total: session.questions.length,
    answers: session.answers,
  });
};

module.exports = {
  startInterview,
  submitAnswer,
  getSession,
};
