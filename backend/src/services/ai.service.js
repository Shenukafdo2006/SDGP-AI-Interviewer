const axios = require("axios");

const AI_URL = process.env.FASTAPI_BASE_URL || "http://localhost:8000";

const aiClient = axios.create({
  baseURL: AI_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAxiosErrorMessage = (error, fallbackLabel) => {
  const responseMessage =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error;

  if (responseMessage) {
    return String(responseMessage);
  }

  if (error?.code === "ECONNREFUSED") {
    return `${fallbackLabel} service is not running at ${AI_URL}`;
  }

  if (error?.code === "ECONNABORTED") {
    return `${fallbackLabel} service timed out at ${AI_URL}`;
  }

  if (error?.message) {
    return String(error.message);
  }

  return `${fallbackLabel} service request failed`;
};

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
    const message = getAxiosErrorMessage(error, "Question generation");
    console.error("Error generating question:", message);
    throw new Error(`Failed to generate question: ${message}`);
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
    const message = getAxiosErrorMessage(error, "Answer evaluation");
    console.error("Error evaluating answer:", message);
    throw new Error(`Failed to evaluate answer: ${message}`);
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
    const message = getAxiosErrorMessage(error, "CV analysis");
    console.error("Error analyzing CV:", message);
    throw new Error(`Failed to analyze CV: ${message}`);
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
    const message = getAxiosErrorMessage(error, "Facial analysis");
    console.error("Error analyzing facial expression:", message);
    throw new Error(`Failed to analyze facial expression: ${message}`);
  }
};

exports.getInterviewFeedback = async (sessionData) => {
  try {
    const res = await aiClient.post("/get-interview-feedback", sessionData);
    return res.data;
  } catch (error) {
    const message = getAxiosErrorMessage(error, "Interview feedback");
    console.error("Error generating feedback:", message);
    throw new Error(`Failed to generate feedback: ${message}`);
  }
};
