const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://revolvesoftware2025_db_user:M5fC2rL9bY1vlgRZ@cluster0.3prl58a.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const achievementSchema = new mongoose.Schema({
  name: String,
  desc: String,
  unlocked: Boolean,
  date: String,
  progress: Object,
  color: String,
  icon: String,
});

const userSchema = new mongoose.Schema({
  _id: String,
  stats: Array,
  xp: Object,
  achievements: [achievementSchema],
});

const User = mongoose.model("User", userSchema);

async function createUser() {
  const exists = await User.findById("user123");
  if (exists) {
    console.log("User already exists");
    return;
  }

  const initialStats = [
    { icon: "🏆", label: "Achievements", value: 4 },
    { icon: "🔥", label: "Day Streak", value: 15 },
    { icon: "⚡", label: "Level", value: 10 },
  ];

  const initialXp = {
    level: 10,
    current: 800,
    total: 1000,
    title: "Career Achiever",
    icon: "⚡",
  };

  const defaultAchievements = [
    { name: "First Interview", desc: "Completed your first mock interview", unlocked: true, date: "2024-10-15", color: "#a020f0", icon: "🔒" },
    { name: "Quiz Master", desc: "Scored 100% on 5 quizzes", unlocked: true, date: "2024-10-22", color: "#ffa500", icon: "🏆" },
    { name: "Week Warrior", desc: "Maintained a 7-day learning streak", unlocked: true, date: "2024-10-28", color: "#ff0066", icon: "🔥" },
    { name: "CV Creator", desc: "Created and downloaded your CV", unlocked: true, date: "2024-11-01", color: "#a020f0", icon: "📄" },
    { name: "Knowledge Seeker", desc: "Read 20 learning resources", unlocked: false, progress: { current: 12, total: 20 }, color: "#3b82f6", icon: "⚡" },
    { name: "Perfect Score", desc: "Get 90%+ on 10 interviews", unlocked: false, progress: { current: 3, total: 10 }, color: "#22c55e", icon: "⭕" },
  ];

  await User.create({
    _id: "user123",
    stats: initialStats,
    xp: initialXp,
    achievements: defaultAchievements,
  });

  console.log("Initial user created");
}

createUser().then(() => mongoose.disconnect());