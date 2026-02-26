const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://revolvesoftware2025_db_user:M5fC2rL9bY1vlgRZ@cluster0.3prl58a.mongodb.net/";

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

app.get("/api/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post("/api/user/:id/achievement/:achName", async (req, res) => {
  const { unlocked, progress } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const ach = user.achievements.find(a => a.name === req.params.achName);
  if (!ach) return res.status(404).json({ message: "Achievement not found" });

  if (unlocked) {
    ach.unlocked = true;
    ach.date = new Date().toISOString().split("T")[0];
  }
  if (progress) ach.progress = progress;

  user.stats.find(s => s.label === "Achievements").value = user.achievements.filter(a => a.unlocked).length;

  if (unlocked) {
    user.xp.current += 100;
    if (user.xp.current >= user.xp.total) {
      user.xp.level++;
      user.xp.current -= user.xp.total;
      user.xp.total += 500;
    }
  }

  await user.save();
  res.json({ message: "Updated" });
});

app.listen(5000, () => console.log("Server running on port 5000"));