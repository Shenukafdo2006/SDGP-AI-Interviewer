const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const achievementsSnap = await req.db.collection("achievements").get();
    const statsSnap = await req.db.collection("stats").get();
    const xpSnap = await req.db.collection("xp").doc("userXP").get();

    const achievements = achievementsSnap.docs.map(doc => doc.data());
    const stats = statsSnap.docs.map(doc => doc.data());
    const xp = xpSnap.exists ? xpSnap.data() : {};

    res.json({ achievements, stats, xp });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/achievement", async (req, res) => {
  try {
    const achievement = req.body;

    if (!achievement.name) {
      return res.status(400).json({ error: "Achievement name required" });
    }

    await req.db
      .collection("achievements")
      .doc(achievement.name)
      .set(achievement);

    res.json({ message: "Achievement saved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/xp", async (req, res) => {
  try {
    await req.db
      .collection("xp")
      .doc("userXP")
      .set(req.body);

    res.json({ message: "XP updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;