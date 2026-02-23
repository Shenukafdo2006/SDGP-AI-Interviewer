const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    res.json(userDoc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    await db.collection("users").doc(userId).set(data, { merge: true });

    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/user/:userId/achievement/:achName", async (req, res) => {
  try {
    const { userId, achName } = req.params;
    const { unlocked, progress } = req.body;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    let achievements = userData.achievements || [];

    achievements = achievements.map((ach) =>
      ach.name === achName ? { ...ach, unlocked, progress } : ach
    );

    await userRef.update({ achievements });

    res.json({ message: "Achievement updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});