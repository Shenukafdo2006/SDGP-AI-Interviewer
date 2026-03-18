const { db } = require("../config/firebase-admin");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.hashedPassword) {
      return res.status(500).json({ error: "User password not found" });
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = loginController;