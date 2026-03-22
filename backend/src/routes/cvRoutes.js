const express = require("express");
const { analyzeCVSmart, saveCV } = require("../controllers/cvController");

const router = express.Router();

router.post("/analysis", analyzeCVSmart);
router.post("/save", saveCV);

module.exports = router;
