const axios = require("axios");

const AI_URL = process.env.FASTAPI_BASE_URL || "http://localhost:8000";

const aiClient = axios.create({
  baseURL: AI_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

exports.generateQuestion = async (role, level, interviewType, sessionContext = {}) => {
  try {
    const res = await aiClient.post("/generate-question", {
      role,
      level,
      interview_type: interviewType,
      session_context: sessionContext,
    });
    return res.data;
  } catch (error) {
    console.error("Error generating question:", error.message);
    throw new Error(`Failed to generate question: ${error.message}`);
  }
};

exports.evaluateAnswer = async (question, answer, role, level) => {
  try {
    const res = await aiClient.post("/evaluate-answer", {
      question,
      answer,
      role,
      level,
    });
    return res.data;
  } catch (error) {
    console.error("Error evaluating answer:", error.message);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
};
//CV MAKER 
exports.analyzeCV = async (cvContent) => {
  try {
    const res = await aiClient.post("/analyze-cv", {
      cv_content: cvContent,
    });
    return res.data;
  } catch (error) {
    console.error("Error analyzing CV:", error.message);
    throw new Error(`Failed to analyze CV: ${error.message}`);
  }
};

exports.analyzeFacialExpression = async (frameBase64, question = null) => {
  try {
    const res = await aiClient.post("/analyze-facial-expression", {
      frame_base64: frameBase64,
      question,
    });
    return res.data;
  } catch (error) {
    console.error("Error analyzing facial expression:", error.message);
    throw new Error(`Failed to analyze facial expression: ${error.message}`);
  }
};

exports.getInterviewFeedback = async (sessionData) => {
  try {
    const res = await aiClient.post("/get-interview-feedback", sessionData);
    return res.data;
  } catch (error) {
    console.error("Error generating feedback:", error.message);
    throw new Error(`Failed to generate feedback: ${error.message}`);
  }
};
