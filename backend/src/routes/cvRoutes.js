const express = require("express");
const { analyzeCVSmart } = require("../controllers/cvController");

const router = express.Router();

router.post("/analysis", analyzeCVSmart);

module.exports = router;
