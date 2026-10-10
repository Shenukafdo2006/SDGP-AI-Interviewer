# Job Posting PDF Import

This flow stores each original PDF as a MySQL `LONGBLOB`, extracts searchable text with `pdf-parse`, and keeps extracted imports pending until a reviewer approves structured posting data. Approved required/preferred skills are used by the CV Maker as suggestions; they are not added to a CV until the user confirms them.

## 1. Apply the schema migration

In MySQL Workbench, select the `interviewer_jobs` connection and open `backend/sql/job-postings.sql`. Execute it once. It adds PDF metadata/blob fields to `source_documents` and a `role_family` column to `job_postings`; it uses the existing `job_skills` table.

If Workbench reports that a column or index already exists, stop and inspect the schema instead of repeatedly executing the migration.

## 2. Configure the private import token

Add a long, random `JOB_IMPORT_TOKEN` to the ignored `backend/.env` file. Keep it private and do not commit it. Restart the backend after changing `.env`.

The importer accepts one PDF at a time, up to 10 MB. It rejects files that do not have a PDF signature and rejects duplicate files by SHA-256 hash.

## 3. Import a PDF

Send a multipart POST to `/api/jobs/admin/imports` with the token as a Bearer token and the PDF in a form field named `pdf`. For example, using a shell where `JOB_IMPORT_TOKEN` has been set privately:

```bash
curl -X POST http://localhost:5001/api/jobs/admin/imports \
  -H "Authorization: Bearer $JOB_IMPORT_TOKEN" \
  -F "pdf=@/path/to/original-posting.pdf"
```

The response includes an import ID and extracted text. The PDF and text are stored in `source_documents` with `review_status = 'pending'`.

## 4. Review and approve the posting

A PDF may contain several jobs. Review the extracted text, then submit one or more structured postings using `PUT /api/jobs/admin/imports/:id/review`, also with the Bearer token. Each posting needs `companyName`, `roleTitle`, and `roleFamily`. Use a role-family value matching the CV Maker role ID, for example `intern-software-engineer`.

Example request body:

```json
{
  "postings": [
    {
      "companyName": "Example company",
      "roleTitle": "Software Engineer Intern",
      "roleFamily": "intern-software-engineer",
      "location": "Colombo",
      "workMode": "Hybrid",
      "employmentType": "Internship",
      "duration": "6 months",
      "applicationStatus": "unknown",
      "description": "Reviewed posting summary",
      "requiredSkills": ["JavaScript", "React", "SQL"],
      "preferredSkills": ["Next.js"]
    }
  ]
}
```

The review endpoint writes to the existing `job_postings` and `job_skills` tables and marks the source PDF approved in a transaction. Use only accurate information from the posting. Allowed application statuses are `unknown`, `open`, and `closed`.

## 5. Use the postings in CV Maker

When the user selects an intern role, the frontend requests `/api/jobs/recommendations?role=intern-software-engineer` (or the selected role ID). It displays skills aggregated from approved postings. The user can add relevant skills from the editor's Skills section; the app does not claim a suggested skill without user confirmation.

## Deployment note

A local MySQL server and local `.env` are only available to the backend running on your computer. For the deployed website, deploy the backend and provide it access to a hosted MySQL database using the deployment platform's secret settings. Do not expose the import token or MySQL credentials in frontend code.

The parsed PDF text pasted into chat is not an original PDF file. The actual PDF files must be available on disk before using the upload endpoint.
