const crypto = require("crypto");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const { pool } = require("../config/mysql");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

const requireImportToken = (req, res, next) => {
  const expected = process.env.JOB_IMPORT_TOKEN;
  const authorization = req.get("authorization") || "";
  const supplied = authorization.replace(/^Bearer\s+/i, "");

  if (!expected) {
    const isLoopbackHost = ["localhost", "127.0.0.1", "::1"].includes(req.hostname);
    if (process.env.NODE_ENV !== "production" && isLoopbackHost) {
      return next();
    }
    return res.status(503).json({ error: "Job import is not configured." });
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  return next();
};

const cleanString = (value, maxLength = 10000) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const cleanSkillList = (value) => {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((skill) => cleanString(skill, 120)).filter(Boolean))];
};

router.post("/admin/imports", requireImportToken, upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Upload one PDF using the 'pdf' field." });
  }

  if (
    !req.file.originalname.toLowerCase().endsWith(".pdf") ||
    req.file.buffer.subarray(0, 5).toString("ascii") !== "%PDF-"
  ) {
    return res.status(415).json({ error: "The uploaded file is not a valid PDF." });
  }

  const parser = new PDFParse({ data: req.file.buffer });
  let extractedText;
  try {
    const result = await parser.getText();
    extractedText = cleanString(result.text, 2_000_000);
  } catch (error) {
    console.error("PDF text extraction failed:", error.message);
    return res.status(422).json({ error: "Could not extract text from this PDF." });
  } finally {
    await parser.destroy().catch(() => {});
  }

  if (!extractedText) {
    return res.status(422).json({ error: "The PDF contains no extractable text." });
  }

  const sha256 = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
  const filename = path.basename(req.file.originalname).slice(0, 255);

  try {
    const [result] = await pool.execute(
      `INSERT INTO source_documents
       (original_filename, storage_provider, storage_key, mime_type, file_sha256,
        original_pdf, extracted_text, review_status, uploaded_at)
       VALUES (?, 'mysql', ?, 'application/pdf', ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
      [filename, sha256, sha256, req.file.buffer, extractedText],
    );

    return res.status(201).json({
      id: result.insertId,
      originalFilename: filename,
      reviewStatus: "pending",
      extractedText,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "This PDF has already been imported." });
    }
    console.error("PDF import failed:", error.code || "UNKNOWN_ERROR");
    return res.status(503).json({ error: "Could not save the PDF import." });
  }
});

router.get("/admin/imports", requireImportToken, async (req, res) => {
  try {
    const [imports] = await pool.query(
          `SELECT id, original_filename AS originalFilename, review_status AS reviewStatus,
            uploaded_at AS uploadedAt, extracted_text AS extractedText
           FROM source_documents ORDER BY uploaded_at DESC LIMIT 100`,
    );
    return res.json({ imports });
  } catch (error) {
    console.error("Job import list failed:", error.code || "UNKNOWN_ERROR");
    return res.status(503).json({ error: "Could not load PDF imports." });
  }
});

router.put("/admin/imports/:id/review", requireImportToken, async (req, res) => {
  const documentId = Number(req.params.id);
  const postings = req.body?.postings;
  if (!Number.isSafeInteger(documentId) || documentId < 1) {
    return res.status(400).json({ error: "Invalid import ID." });
  }
  if (!Array.isArray(postings) || postings.length < 1 || postings.length > 25) {
    return res.status(400).json({ error: "Provide between 1 and 25 reviewed postings." });
  }

  const reviewedPostings = postings.map((posting) => ({
    companyName: cleanString(posting.companyName, 200),
    roleTitle: cleanString(posting.roleTitle, 200),
    roleFamily: cleanString(posting.roleFamily, 100),
    location: cleanString(posting.location, 255),
    workMode: cleanString(posting.workMode, 80),
    employmentType: cleanString(posting.employmentType, 100),
    duration: cleanString(posting.duration, 100),
    applicationUrl: cleanString(posting.applicationUrl, 2048),
    applicationEmail: cleanString(posting.applicationEmail, 320),
    applicationStatus: ["unknown", "open", "closed"].includes(posting.applicationStatus)
      ? posting.applicationStatus
      : "unknown",
    description: cleanString(posting.description, 50000),
    requiredSkills: cleanSkillList(posting.requiredSkills),
    preferredSkills: cleanSkillList(posting.preferredSkills),
  }));

  if (reviewedPostings.some((posting) => !posting.companyName || !posting.roleTitle || !posting.roleFamily)) {
    return res.status(400).json({
      error: "Each posting needs companyName, roleTitle, and roleFamily.",
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [documents] = await connection.execute(
      "SELECT id FROM source_documents WHERE id = ? FOR UPDATE",
      [documentId],
    );
    if (documents.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "PDF import not found." });
    }

    const postingIds = [];
    for (const posting of reviewedPostings) {
      const [result] = await connection.execute(
        `INSERT INTO job_postings
         (source_document_id, company_name, role_title, role_family, location, work_mode,
          employment_type, duration, application_url, application_email, application_status,
          description, requirements, review_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
        [
          documentId,
          posting.companyName,
          posting.roleTitle,
          posting.roleFamily,
          posting.location || null,
          posting.workMode || null,
          posting.employmentType || null,
          posting.duration || null,
          posting.applicationUrl || null,
          posting.applicationEmail || null,
          posting.applicationStatus,
          posting.description || null,
          JSON.stringify({
            requiredSkills: posting.requiredSkills,
            preferredSkills: posting.preferredSkills,
          }),
        ],
      );
      postingIds.push(result.insertId);

      const skillRows = [
        ...posting.requiredSkills.map((skill) => [result.insertId, skill, "required"]),
        ...posting.preferredSkills.map((skill) => [result.insertId, skill, "preferred"]),
      ];
      if (skillRows.length) {
        await connection.query(
          `INSERT INTO job_skills (job_posting_id, skill_name, skill_type)
           VALUES ?`,
          [skillRows],
        );
      }
    }

    await connection.execute(
      "UPDATE source_documents SET review_status = 'approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [documentId],
    );
    await connection.commit();
    return res.json({ status: "approved", postingIds });
  } catch (error) {
    await connection.rollback();
    console.error("Job posting review failed:", error.code || "UNKNOWN_ERROR");
    return res.status(503).json({ error: "Could not save reviewed job postings." });
  } finally {
    connection.release();
  }
});

router.get("/recommendations", async (req, res) => {
  const roleFamily = cleanString(req.query.role, 100);
  if (!roleFamily) {
    return res.status(400).json({ error: "A role query is required." });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT s.skill_name AS skill, s.skill_type AS skillType,
              COUNT(DISTINCT j.id) AS postingCount
      FROM job_postings j
      JOIN job_skills s ON s.job_posting_id = j.id
       WHERE j.review_status = 'approved' AND j.role_family = ?
       GROUP BY s.skill_name, s.skill_type
       ORDER BY (s.skill_type = 'required') DESC, postingCount DESC, s.skill_name ASC
       LIMIT 30`,
      [roleFamily],
    );
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS jobCount FROM job_postings
       WHERE review_status = 'approved' AND role_family = ?`,
      [roleFamily],
    );
    return res.json({ roleFamily, jobCount: countRows[0].jobCount, recommendations: rows });
  } catch (error) {
    console.error("Job recommendation lookup failed:", error.code || "UNKNOWN_ERROR");
    return res.status(503).json({ error: "Job recommendations are unavailable." });
  }
});

module.exports = router;