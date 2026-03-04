const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const { admin, initCollections, getOrCreateUser } = require("./config/firebase");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/interview", aiInterviewRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Achievements API is running 🚀" });
});

// ─── GET /api/user/:userId ────────────────────────────────────────────────────
// Returns user stats, xp, and achievements.
// Auto-creates the user doc with default data if it doesn't exist yet.
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
// Unlocks an achievement, updates XP and stats, persists to Firestore.
app.post("/api/user/:userId/achievement/:name", async (req, res) => {
  try {
    const { userId, name } = req.params;
    const { ref, data }    = await getOrCreateUser(userId);

    const achName = decodeURIComponent(name);
    let { stats, xp, achievements } = data;

    // Find the achievement
    const achIndex = achievements.findIndex((a) => a.name === achName);
    if (achIndex === -1) {
      return res.status(404).json({ error: `Achievement "${achName}" not found.` });
    }
    if (achievements[achIndex].unlocked) {
      return res.status(400).json({ error: "Achievement already unlocked." });
    }

    // Unlock it
    achievements = achievements.map((a, i) =>
      i === achIndex ? { ...a, unlocked: true } : a
    );

    // Update XP
    let { current, level, total, ...xpRest } = xp;
    current += achievements[achIndex].xp;
    while (current >= total) { current -= total; level += 1; total += 500; }
    xp = { ...xpRest, current, level, total };

    // Update stats — bump Achievements count and sync Level
    stats = stats.map((s) => {
      if (s.label === "Achievements") return { ...s, value: s.value + 1 };
      if (s.label === "Level")        return { ...s, value: level };
      return s;
    });

    // Persist to Firestore
    await ref.update({
      stats,
      xp,
      achievements,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ stats, xp, achievements });
  } catch (err) {
    console.error("POST /api/user/achievement error:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

// ─── DELETE /api/user/:userId/reset ──────────────────────────────────────────
// Utility: resets a user back to default state (handy during dev/testing)
app.delete("/api/user/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;
    const { ref }    = await getOrCreateUser(userId);

    const DEFAULT_STATS = [
      { icon: "🏆", label: "Achievements", value: 0 },
      { icon: "🔥", label: "Day Streak",   value: 0 },
      { icon: "⚡",  label: "Level",       value: 0 },
    ];
    const DEFAULT_XP = { level: 0, current: 0, total: 1000, title: "Career Achiever", icon: "⚡" };
    const DEFAULT_ACHIEVEMENTS = [
      { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
      { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
      { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
      { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
      { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
      { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
    ];

    await ref.update({
      stats:        DEFAULT_STATS,
      xp:           DEFAULT_XP,
      achievements: DEFAULT_ACHIEVEMENTS,
      updatedAt:    admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: `User ${userId} reset to defaults.` });
  } catch (err) {
    console.error("DELETE /api/user/reset error:", err);
    res.status(500).json({ error: "Failed to reset user." });
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function start() {
  await initCollections();         // auto-create Firestore collection on startup
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`   GET  /api/user/:userId`);
    console.log(`   POST /api/user/:userId/achievement/:name`);
    console.log(`   DEL  /api/user/:userId/reset\n`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
