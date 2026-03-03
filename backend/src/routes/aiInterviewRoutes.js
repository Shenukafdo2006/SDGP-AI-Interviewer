const express = require("express");
const {
  startInterview,
  submitAnswer,
  getSession,
  analyzeFacialData,
  getSessionFeedback,
} = require("../controllers/aiInterviewController");

const router = express.Router();

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/:sessionId", getSession);
router.post("/facial-analysis", analyzeFacialData);
router.post("/:sessionId/feedback", getSessionFeedback);

module.exports = router;
