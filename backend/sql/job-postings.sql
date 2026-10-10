-- Run once against interviewer_jobs after the base tables have been created.
-- This extends the existing source_documents/job_postings/job_skills schema.

ALTER TABLE source_documents
  ADD COLUMN mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  ADD COLUMN file_sha256 CHAR(64) NULL,
  ADD COLUMN original_pdf LONGBLOB NULL,
  ADD COLUMN uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN reviewed_at TIMESTAMP NULL DEFAULT NULL,
  ADD UNIQUE KEY uq_source_documents_file_sha256 (file_sha256);

ALTER TABLE job_postings
  ADD COLUMN role_family VARCHAR(100) NOT NULL DEFAULT 'unclassified',
  ADD INDEX idx_job_postings_role_review (role_family, review_status);