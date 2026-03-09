const { db } = require("../config/firebase-admin");

const signupController = async (req, res) => {
  try {
    const { uid, name, email } = req.body;

    if (!uid || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await db.collection("users").doc(uid).set({
      uid,
      name,
      email,
      createdAt: new Date().toISOString(),
      achievements: [],
    });

    return res.status(201).json({
      message: "User saved successfully",
      uid,
    });
  } catch (error) {
    console.error("Signup controller error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = signupController;