const axios = require("axios");

const AI_URL = process.env.FASTAPI_BASE_URL;

exports.generateQuestion = async (data) => {
  const res = await axios.post(`${AI_URL}/generate-question`, data);
  return res.data;
};

exports.evaluateAnswer = async (data) => {
  const res = await axios.post(`${AI_URL}/evaluate-answer`, data);
  return res.data;
};