const dotenv = require("dotenv");
const app = require("./app");
const {
  admin,
  initCollections,
  getOrCreateUser,
} = require("./config/firebase-interview");

dotenv.config();

const port = Number(process.env.PORT) || 5001;

app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = await getOrCreateUser(userId);

    res.json({
      stats: data.stats,
      xp: data.xp,
      achievements: data.achievements,
    });
  } catch (err) {
    console.error("GET /api/user error:", err);
    res.status(500).json({ error: "Failed to load user data." });
  }
});

app.post("/api/user/:userId/achievement/:name", async (req, res) => {
  try {
    const { userId, name } = req.params;
    const { ref, data } = await getOrCreateUser(userId);

    const achievementName = decodeURIComponent(name);
    const { stats, xp, achievements } = data;
    const achievementIndex = achievements.findIndex(
      (achievement) => achievement.name === achievementName
    );

    if (achievementIndex === -1) {
      return res
        .status(404)
        .json({ error: `Achievement "${achievementName}" not found.` });
    }

    if (achievements[achievementIndex].unlocked) {
      return res.status(400).json({ error: "Achievement already unlocked." });
    }

    const xpReward = achievements[achievementIndex].xp ?? 50;
    let current = xp.current + xpReward;
    let level = xp.level;
    let total = xp.total;

    while (current >= total) {
      current -= total;
      level += 1;
      total += 500;
    }

    const newXp = { ...xp, current, level, total };
    const newStats = stats.map((stat) => {
      if (stat.label === "Achievements") {
        return { ...stat, value: stat.value + 1 };
      }

      if (stat.label === "Level") {
        return { ...stat, value: level };
      }

      return stat;
    });

    await ref.update({
      [`achievements.${achievementIndex}.unlocked`]: true,
      stats: newStats,
      xp: newXp,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedAchievements = achievements.map((achievement, index) =>
      index === achievementIndex
        ? { ...achievement, unlocked: true }
        : achievement
    );

    return res.json({
      stats: newStats,
      xp: newXp,
      achievements: updatedAchievements,
    });
  } catch (err) {
    console.error("POST /api/user/achievement error:", err);
    return res.status(500).json({ error: "Failed to save achievement." });
  }
});

app.delete("/api/user/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;
    const { ref } = await getOrCreateUser(userId);

    const defaultStats = [
      { icon: "🏆", label: "Achievements", value: 0 },
      { icon: "🔥", label: "Day Streak", value: 0 },
      { icon: "⚡", label: "Level", value: 0 },
    ];

    const defaultXp = {
      level: 0,
      current: 0,
      total: 1000,
      title: "Career Achiever",
      icon: "⚡",
    };

    const defaultAchievements = [
      {
        name: "First Interview",
        desc: "Completed your first mock interview",
        color: "#c084fc",
        icon: "🎤",
        xp: 50,
        unlocked: false,
      },
      {
        name: "Quiz Master",
        desc: "Scored 100% on 5 quizzes",
        color: "#fbbf24",
        icon: "🏆",
        xp: 70,
        unlocked: false,
      },
      {
        name: "Week Warrior",
        desc: "Maintained a 7-day learning streak",
        color: "#f87171",
        icon: "🔥",
        xp: 60,
        unlocked: false,
      },
      {
        name: "CV Creator",
        desc: "Created and downloaded your CV",
        color: "#a78bfa",
        icon: "📄",
        xp: 40,
        unlocked: false,
      },
      {
        name: "Knowledge Seeker",
        desc: "Read 20 learning resources",
        color: "#60a5fa",
        icon: "📚",
        xp: 80,
        unlocked: false,
      },
      {
        name: "Perfect Score",
        desc: "Get 90%+ on 10 interviews",
        color: "#34d399",
        icon: "⭐",
        xp: 90,
        unlocked: false,
      },
    ];

    await ref.update({
      stats: defaultStats,
      xp: defaultXp,
      achievements: defaultAchievements,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ message: `User ${userId} reset to defaults.` });
  } catch (err) {
    console.error("DELETE /api/user/reset error:", err);
    return res.status(500).json({ error: "Failed to reset user." });
  }
});

async function start() {
  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });

  initCollections().catch((err) => {
    console.warn("Firestore initialization skipped:", err.message);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
