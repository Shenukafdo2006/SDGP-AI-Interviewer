const express = require("express");
const router = express.Router();

const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const verifyFirebaseToken = require("../middleware/authMiddleware");

router.post("/signup", signupController);
router.post("/login", verifyFirebaseToken, loginController);

module.exports = router;