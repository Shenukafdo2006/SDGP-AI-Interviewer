const aiService = require("../services/ai.service");
const { admin, db } = require("../firebase");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

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

const decodeUploadedFile = (fileData) => {
  const match = String(fileData || "").match(/^data:.*;base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid uploaded file payload");
  }
  return Buffer.from(match[1], "base64");
};

const extractTextWithTextUtil = async (filePath) => {
  const { stdout } = await execFileAsync("/usr/bin/textutil", [
    "-convert",
    "txt",
    "-stdout",
    filePath,
  ]);
  return stdout;
};

const extractPdfText = async (filePath) => {
  try {
    const { stdout } = await execFileAsync("/usr/bin/mdls", [
      "-raw",
      "-name",
      "kMDItemTextContent",
      filePath,
    ]);
    const cleaned = String(stdout || "").trim();
    if (cleaned && cleaned !== "(null)") {
      return cleaned;
    }
  } catch (error) {
    console.warn("mdls PDF extraction failed:", error.message);
  }

  const { stdout } = await execFileAsync("/usr/bin/strings", [filePath]);
  return stdout;
};

const extractUploadedCvText = async (filename, fileData) => {
  const safeName = path.basename(filename || "cv-upload");
  const ext = path.extname(safeName).toLowerCase();
  const tempPath = path.join(os.tmpdir(), `cv-upload-${Date.now()}-${safeName}`);

  await fs.writeFile(tempPath, decodeUploadedFile(fileData));

  try {
    if (ext === ".txt") {
      return await fs.readFile(tempPath, "utf8");
    }

    if (ext === ".docx") {
      return await extractTextWithTextUtil(tempPath);
    }

    if (ext === ".pdf") {
      return await extractPdfText(tempPath);
    }

    throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT CV.");
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
};

const analyzeUploadedCV = async (req, res) => {
  try {
    const { filename, fileData } = req.body || {};

    if (!filename || !fileData) {
      return res.status(400).json({ error: "filename and fileData are required" });
    }

    const cvContent = (await extractUploadedCvText(filename, fileData)).trim();

    if (!cvContent) {
      return res.status(400).json({ error: "Could not extract text from the uploaded CV" });
    }

    const analysis = await aiService.analyzeCV(cvContent);
    return res.json(analysis);
  } catch (error) {
    console.error("Error analyzing uploaded CV:", error);

    const message = error.message || "Failed to analyze uploaded CV";
    const isClientInputError =
      message.includes("Unsupported file format") ||
      message.includes("Could not extract text") ||
      message.includes("Invalid uploaded file payload");

    if (isClientInputError) {
      return res.status(400).json({
        error: "Invalid CV upload",
        message,
      });
    }

    return res.status(500).json({
      error: "Failed to analyze uploaded CV",
      message,
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
  analyzeUploadedCV,
  saveCV,
};
