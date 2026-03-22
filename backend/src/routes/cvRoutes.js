const express = require("express");
const { analyzeCVSmart, analyzeUploadedCV, saveCV } = require("../controllers/cvController");

const router = express.Router();

router.post("/analysis", analyzeCVSmart);
router.post("/analysis-upload", analyzeUploadedCV);
router.post("/save", saveCV);

module.exports = router;
