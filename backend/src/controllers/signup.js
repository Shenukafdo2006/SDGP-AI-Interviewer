const { db } = require("../config/firebase-admin");
const bcrypt = require("bcrypt");

const signupController = async (req, res) => {
  try {
    const { uid, name, email, password } = req.body;

    if (!uid || !name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.collection("users").doc(uid).set({
      uid,
      name,
      email,
      hashedPassword,
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