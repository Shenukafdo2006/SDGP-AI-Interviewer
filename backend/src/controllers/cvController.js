const aiService = require("../services/ai.service");
const { admin, db } = require("../firebase");

const sanitizeForFirestore = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, sanitizeForFirestore(item)])
        .filter(([, item]) => item !== undefined)
    );
  }

  return value === undefined ? undefined : value;
};

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

const saveCV = async (req, res) => {
  try {
    const {
      uid,
      cvName,
      templateId = null,
      cvFormData = {},
      educationEntries = [],
      employmentEntries = [],
      skillsEntries = [],
      languagesEntries = [],
      additionalSections = {},
      designSettings = {},
    } = req.body || {};

    if (!uid || !String(uid).trim()) {
      return res.status(400).json({ error: "uid is required" });
    }

    const payload = sanitizeForFirestore({
      uid: String(uid).trim(),
      cvName: cvName ? String(cvName).trim() : "Untitled CV",
      templateId,
      cvFormData,
      educationEntries,
      employmentEntries,
      skillsEntries,
      languagesEntries,
      additionalSections,
      designSettings,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const savedRef = await db.collection("savedCVs").add(payload);

    return res.status(201).json({
      success: true,
      id: savedRef.id,
      message: "CV saved successfully",
    });
  } catch (error) {
    console.error("Error saving CV:", error);
    return res.status(500).json({
      error: "Failed to save CV",
      message: error.message,
    });
  }
};

module.exports = {
  analyzeCVSmart,
  saveCV,
};
