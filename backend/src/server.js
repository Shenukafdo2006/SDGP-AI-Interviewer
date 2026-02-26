const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://revolvesoftware2025_db_user:r485BIZHi70xBK37@cluster0.es8vooe.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const achievementSchema = new mongoose.Schema({
  name:     String,
  desc:     String,
  unlocked: { type: Boolean, default: false },
  date:     String,
  color:    String,
  icon:     String,
  xp:       Number,
});

const courseSchema = new mongoose.Schema({
  name:     String,
  desc:     String,
  unlocked: { type: Boolean, default: false },
  date:     String,
  color:    String,
  icon:     String,
  xp:       Number,
});

const statsSchema = new mongoose.Schema({
  icon:  String,
  label: String,
  value: { type: Number, default: 0 },
});

const xpSchema = new mongoose.Schema({
  level:   { type: Number, default: 0 },
  current: { type: Number, default: 0 },
  total:   { type: Number, default: 1000 },
  title:   { type: String, default: "Career Achiever" },
  icon:    { type: String, default: "⚡" },
});

const userSchema = new mongoose.Schema({
  _id:          String,
  stats:        [statsSchema],
  xp:           xpSchema,
  achievements: [achievementSchema],
  courses:      [courseSchema],
});

const User = mongoose.model("User", userSchema);

const seedUser = async () => {
  const userId = "user123";
  const existing = await User.findById(userId);
  if (!existing) {
    const user = new User({
      _id: userId,
      stats: [
        { icon: "🏆", label: "Achievements", value: 0 },
        { icon: "🔥", label: "Day Streak",   value: 0 },
        { icon: "⚡",  label: "Level",       value: 0 },
      ],
      xp: { level: 0, current: 0, total: 1000, title: "Career Achiever", icon: "⚡" },
      achievements: [
        { name: "First Interview",  desc: "Completed your first mock interview", unlocked: false, color: "#a855f7", icon: "🎤", xp: 50 },
        { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           unlocked: false, color: "#f59e0b", icon: "🏆", xp: 70 },
        { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  unlocked: false, color: "#ef4444", icon: "🔥", xp: 60 },
        { name: "CV Creator",       desc: "Created and downloaded your CV",      unlocked: false, color: "#8b5cf6", icon: "📄", xp: 40 },
        { name: "Knowledge Seeker", desc: "Read 20 learning resources",          unlocked: false, color: "#3b82f6", icon: "📚", xp: 80 },
        { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           unlocked: false, color: "#22c55e", icon: "⭐", xp: 90 },
      ],
      courses: [
        { name: "JavaScript Basics",    desc: "Learn JS fundamentals",          unlocked: false, color: "#f59e0b", icon: "📜", xp: 60 },
        { name: "React Essentials",     desc: "Build UIs with React",           unlocked: false, color: "#3b82f6", icon: "⚛️",  xp: 80 },
        { name: "Node.js & Express",    desc: "Server-side development",        unlocked: false, color: "#22c55e", icon: "🟢", xp: 70 },
        { name: "MongoDB Mastery",      desc: "Database design with MongoDB",   unlocked: false, color: "#a855f7", icon: "🍃", xp: 75 },
        { name: "CSS & Tailwind",       desc: "Style modern web apps",          unlocked: false, color: "#ef4444", icon: "🎨", xp: 55 },
        { name: "System Design",        desc: "Design scalable systems",        unlocked: false, color: "#8b5cf6", icon: "🏗️",  xp: 90 },
      ],
    });
    await user.save();
    console.log("Seeded initial user data");
  }
};
seedUser();

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/user/:id/achievement/:achName", async (req, res) => {
  try {
    const { unlocked } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ach = user.achievements.find((a) => a.name === req.params.achName);
    if (!ach) return res.status(404).json({ message: "Achievement not found" });

    if (ach.unlocked) {
      return res.json({ message: "Already unlocked", achievement: ach, xp: user.xp, stats: user.stats });
    }

    ach.unlocked = true;
    ach.date = new Date().toISOString().split("T")[0];

    const achStat = user.stats.find((s) => s.label === "Achievements");
    if (achStat) achStat.value = user.achievements.filter((a) => a.unlocked).length;

    user.xp.current += ach.xp;
    if (user.xp.current >= user.xp.total) {
      user.xp.level   += 1;
      user.xp.current -= user.xp.total;
      user.xp.total   += 500;
      const levelStat = user.stats.find((s) => s.label === "Level");
      if (levelStat) levelStat.value = user.xp.level;
    }

    user.markModified("achievements");
    user.markModified("stats");
    user.markModified("xp");

    await user.save();
    res.json({ message: "Achievement unlocked", achievement: ach, xp: user.xp, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/user/:id/course/:courseName", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const course = user.courses.find((c) => c.name === req.params.courseName);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.unlocked) {
      return res.json({ message: "Already unlocked", course, xp: user.xp, stats: user.stats });
    }

    course.unlocked = true;
    course.date = new Date().toISOString().split("T")[0];

    user.xp.current += course.xp || 50;
    if (user.xp.current >= user.xp.total) {
      user.xp.level   += 1;
      user.xp.current -= user.xp.total;
      user.xp.total   += 500;
      const levelStat = user.stats.find((s) => s.label === "Level");
      if (levelStat) levelStat.value = user.xp.level;
    }

    user.markModified("courses");
    user.markModified("xp");
    user.markModified("stats");

    await user.save();
    res.json({ message: "Course unlocked", course, xp: user.xp, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));