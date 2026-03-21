const express = require("express");
const router = express.Router();
const { admin, db } = require("../firebase");
const bcrypt = require("bcrypt");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // remove extra spaces
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // check if email already exists in Firebase Auth
    try {
      await admin.auth().getUserByEmail(email);
      return res.status(400).json({ error: "Email already exists" });
    } catch (err) {
      // continue only if user not found
      if (err.code !== "auth/user-not-found") {
        throw err;
      }
    }

    // hash password before saving in Firestore
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in Firebase Authentication
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // save user in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      firstName,
      lastName,
      email,
      hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      uid: user.uid,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // find user by email in Firestore
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

    // compare entered password with hashed password from Firestore
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      uid: user.uid,
      firstName: user.firstName || "",
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
