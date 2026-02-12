const express = require("express");
const {
  startInterview,
  submitAnswer,
  getSession,
} = require("../controllers/aiInterviewController");

const router = express.Router();

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/:sessionId", getSession);

module.exports = router;
