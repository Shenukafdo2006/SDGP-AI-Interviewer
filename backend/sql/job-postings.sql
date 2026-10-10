-- source_documents PDF columns were already applied in the local database.
-- Run this remaining statement once as a MySQL user with ALTER privileges.
-- job_postings has no uploaded_at column, so do not add an uploaded_at index here.

ALTER TABLE job_postings
  ADD COLUMN role_family VARCHAR(100) NOT NULL DEFAULT 'unclassified',
  ADD INDEX idx_job_postings_role_review (role_family, review_status);
