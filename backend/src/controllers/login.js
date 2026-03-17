const { db } = require("../config/firebase-admin");

const loginController = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: userDoc.data(),
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = loginController;