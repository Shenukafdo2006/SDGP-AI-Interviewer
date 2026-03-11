const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const {
  admin: achievementsAdmin,
  initCollections,
  getOrCreateUser,
} = require("./config/firebase");
require("./config/firebase-interview");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");

const app  = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/api/interview", aiInterviewRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Achievements API is running 🚀" });
});

// ─── GET /api/user/:userId ────────────────────────────────────────────────────
app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data }   = await getOrCreateUser(userId);

    res.json({
      stats:        data.stats,
      xp:           data.xp,
      achievements: data.achievements,
    });
  } catch (err) {
    console.error("GET /api/user error:", err);
    res.status(500).json({ error: "Failed to load user data." });
  }
});

// ─── POST /api/user/:userId/achievement/:name ─────────────────────────────────
// Unlocks ONE achievement only — only that achievement's unlocked flag is saved.
app.post("/api/user/:userId/achievement/:name", async (req, res) => {
  try {
    const { userId, name } = req.params;
    const { ref, data }    = await getOrCreateUser(userId);

    const achName = decodeURIComponent(name);
    const { stats, xp, achievements } = data;

    // Find the achievement
    const achIndex = achievements.findIndex((a) => a.name === achName);
    if (achIndex === -1) {
      return res.status(404).json({ error: `Achievement "${achName}" not found.` });
    }
    if (achievements[achIndex].unlocked) {
      return res.status(400).json({ error: "Achievement already unlocked." });
    }

    const xpReward = achievements[achIndex].xp ?? 50;

    // ── XP calculation ───────────────────────────────────────────────────────
    let current = xp.current + xpReward;
    let level   = xp.level;
    let total   = xp.total;
    while (current >= total) { current -= total; level += 1; total += 500; }

    const newXp = { ...xp, current, level, total };

    // ── Stats update ─────────────────────────────────────────────────────────
    const newStats = stats.map((s) => {
      if (s.label === "Achievements") return { ...s, value: s.value + 1 };
      if (s.label === "Level")        return { ...s, value: level };
      return s;
    });

    // ── Targeted Firestore write — only touch the ONE achievement field ───────
    // Dot-notation updates a single array element without overwriting the rest.
    await ref.update({
      [`achievements.${achIndex}.unlocked`]: true,
      stats:     newStats,
      xp:        newXp,
      updatedAt: achievementsAdmin.firestore.FieldValue.serverTimestamp(),
    });

    // Build the full updated list to return to the frontend
    const updatedAchievements = achievements.map((a, i) =>
      i === achIndex ? { ...a, unlocked: true } : a
    );

    res.json({
      stats:        newStats,
      xp:           newXp,
      achievements: updatedAchievements,
    });

  } catch (err) {
    console.error("POST /api/user/achievement error:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

// ─── DELETE /api/user/:userId/reset ──────────────────────────────────────────
app.delete("/api/user/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;
    const { ref }    = await getOrCreateUser(userId);

    const DEFAULT_STATS = [
      { icon: "🏆", label: "Achievements", value: 0 },
      { icon: "🔥", label: "Day Streak",   value: 0 },
      { icon: "⚡",  label: "Level",        value: 0 },
    ];

    const DEFAULT_XP = {
      level:   0,
      current: 0,
      total:   1000,
      title:   "Career Achiever",
      icon:    "⚡",
    };

    const DEFAULT_ACHIEVEMENTS = [
      { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
      { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",            color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
      { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
      { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
      { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
      { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
    ];

    await ref.update({
      stats:        DEFAULT_STATS,
      xp:           DEFAULT_XP,
      achievements: DEFAULT_ACHIEVEMENTS,
      updatedAt:    achievementsAdmin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: `User ${userId} reset to defaults.` });
  } catch (err) {
    console.error("DELETE /api/user/reset error:", err);
    res.status(500).json({ error: "Failed to reset user." });
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function start() {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  });

  initCollections().catch((err) => {
    console.warn("⚠️ Firestore initialization skipped:", err.message);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
