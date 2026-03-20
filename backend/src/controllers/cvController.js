const aiService = require("../services/ai.service");

const analyzeCVSmart = async (req, res) => {
  try {
    const { cvContent } = req.body || {};

    if (!cvContent || !String(cvContent).trim()) {
      return res.status(400).json({ error: "cvContent is required" });
    }

    const analysis = await aiService.analyzeCV(String(cvContent));
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing CV:", error);
    res.status(500).json({
      error: "Failed to analyze CV",
      message: error.message,
    });
  }
};

module.exports = {
  analyzeCVSmart,
};
