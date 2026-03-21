const { db } = require("../config/firebase-interview");

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

