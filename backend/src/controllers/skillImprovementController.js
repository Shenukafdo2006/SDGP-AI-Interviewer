const { db } = require("../firebase");

// In-memory storage for demo purposes (replace with Firebase when permissions are fixed)
let userProgressStore = {};

const getUserProgress = async (req, res) => {
  try {
    const uid = req.query.uid;
    if (!uid) {
      return res.status(400).json({ error: "User ID required" });
    }

    // Try Firebase first, fallback to in-memory store
    try {
      const goalsDoc = await db.collection("userProgress").doc(uid).collection("goals").doc("weekly").get();
      const goals = goalsDoc.exists ? goalsDoc.data() : null;

      if (goals) {
        return res.json({
          goals: {
            coding: goals.coding || { current: 0, total: 5 },
            learning: goals.learning || { current: 0, total: 2 },
            interview: goals.interview || { current: 0, total: 1 },
            project: goals.project || { current: 0, total: 1 }
          },
          recommendations: {}
        });
      }
    } catch (firebaseError) {
      console.log('Firebase not available, using in-memory store');
    }

    // Fallback to in-memory store
    const userProgress = userProgressStore[uid] || {
      goals: {
        coding: { current: 0, total: 5 },
        learning: { current: 0, total: 2 },
        interview: { current: 0, total: 1 },
        project: { current: 0, total: 1 }
      },
      recommendations: {}
    };

    res.json(userProgress);

  } catch (err) {
    console.error("Error fetching user progress:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateGoalProgress = async (req, res) => {
  try {
    const { uid, category, current, total } = req.body;

    if (!uid || !category) {
      return res.status(400).json({ error: "User ID and category required" });
    }

    // Try Firebase first, fallback to in-memory store
    try {
      const userGoalsRef = db.collection("userProgress").doc(uid).collection("goals").doc("weekly");

      // Get current goals data
      const goalsDoc = await userGoalsRef.get();
      const goals = goalsDoc.exists ? goalsDoc.data() : {};

      // Update the specific category
      goals[category] = {
        current: current !== undefined ? current : (goals[category]?.current || 0),
        total: total !== undefined ? total : (goals[category]?.total || 1)
      };

      await userGoalsRef.set(goals);

      return res.json({
        message: "Goal progress updated successfully",
        goals
      });
    } catch (firebaseError) {
      console.log('Firebase not available, using in-memory store');
    }

    // Fallback to in-memory store
    if (!userProgressStore[uid]) {
      userProgressStore[uid] = {
        goals: {
          coding: { current: 0, total: 5 },
          learning: { current: 0, total: 2 },
          interview: { current: 0, total: 1 },
          project: { current: 0, total: 1 }
        },
        recommendations: {}
      };
    }

    userProgressStore[uid].goals[category] = {
      current: current !== undefined ? current : (userProgressStore[uid].goals[category]?.current || 0),
      total: total !== undefined ? total : (userProgressStore[uid].goals[category]?.total || 1)
    };

    res.json({
      message: "Goal progress updated successfully",
      goals: userProgressStore[uid].goals
    });

  } catch (err) {
    console.error("Error updating goal progress:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateRecommendationProgress = async (req, res) => {
  try {
    const { uid, recommendationId, progress } = req.body;

    if (!uid || !recommendationId) {
      return res.status(400).json({ error: "User ID and recommendation ID required" });
    }

    const recommendationsRef = db.collection("userProgress").doc(uid).collection("recommendations").doc("progress");

    // Get current recommendations data
    const recDoc = await recommendationsRef.get();
    const recommendations = recDoc.exists ? recDoc.data() : {};

    // Update the specific recommendation
    recommendations[recommendationId] = {
      progress: progress || 0,
      lastUpdated: new Date().toISOString()
    };

    await recommendationsRef.set(recommendations);

    res.json({
      message: "Recommendation progress updated successfully",
      recommendations
    });

  } catch (err) {
    console.error("Error updating recommendation progress:", err);
    res.status(500).json({ error: err.message });
  }
};

const resetWeeklyGoals = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "User ID required" });
    }

    const defaultGoals = {
      coding: { current: 0, total: 5 },
      learning: { current: 0, total: 2 },
      interview: { current: 0, total: 1 },
      project: { current: 0, total: 1 }
    };

    await db.collection("userProgress").doc(uid).collection("goals").doc("weekly").set(defaultGoals);

    res.json({
      message: "Weekly goals reset successfully",
      goals: defaultGoals
    });

  } catch (err) {
    console.error("Error resetting weekly goals:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserProgress,
  updateGoalProgress,
  updateRecommendationProgress,
  resetWeeklyGoals
};
