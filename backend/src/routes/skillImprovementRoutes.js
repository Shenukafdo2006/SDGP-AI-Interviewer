const express = require("express");
const router = express.Router();
const {
  getUserProgress,
  updateGoalProgress,
  updateRecommendationProgress,
  resetWeeklyGoals
} = require("../controllers/skillImprovementController");

// Get user progress data
router.get("/progress", getUserProgress);

// Update goal progress
router.post("/goals", updateGoalProgress);

// Update recommendation progress
router.post("/recommendations", updateRecommendationProgress);

// Reset weekly goals (for new week)
router.post("/reset-goals", resetWeeklyGoals);

module.exports = router;