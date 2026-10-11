import { useEffect, useState } from "react";
import "./JobPostingReview.css";

const ROLE_FAMILIES = [
  { value: "intern-software-engineer", label: "Intern Software Engineer" },
  { value: "intern-quality-assurance", label: "Intern Quality Assurance" },
  { value: "intern-data-scientist", label: "Intern Data Scientist / ML Engineer" },
  { value: "intern-web-developer", label: "Intern Web Developer" },
  { value: "intern-ui-ux-designer", label: "Intern UI/UX Designer" },
  { value: "intern-project-manager", label: "Intern Project Manager" },
];

const suggestedRoleFamily = (filename = "") =>
  filename.toLowerCase().startsWith("ml_")
    ? "intern-data-scientist"
    : "intern-software-engineer";

const blankPosting = (roleFamily = "intern-software-engineer") => ({
  key: `${Date.now()}-${Math.random()}`,
  companyName: "",
  roleTitle: "",
  roleFamily,
  location: "",
  workMode: "",
  employmentType: "Internship",
  duration: "",
  applicationUrl: "",
  applicationEmail: "",
  applicationStatus: "unknown",
  description: "",
  requiredSkillsText: "",
  preferredSkillsText: "",
});

const parseSkills = (value) =>
  value.split(/[\n,;]/).map((skill) => skill.trim()).filter(Boolean);

function JobPostingReview() {
  const [imports, setImports] = useState([]);
  const [selectedImportId, setSelectedImportId] = useState("");
  const [postings, setPostings] = useState([blankPosting()]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedImport = imports.find((item) => String(item.id) === selectedImportId);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadImports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/jobs/admin/imports", { headers: authHeaders });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load PDF imports.");
      const pendingImports = (data.imports || []).filter((item) => item.reviewStatus === "pending");
      setImports(pendingImports);
      const nextSelectedId =
        pendingImports.some((item) => String(item.id) === selectedImportId)
          ? selectedImportId
          : String(pendingImports[0]?.id || "");
      const selectedSource = pendingImports.find((item) => String(item.id) === nextSelectedId);
      if (nextSelectedId !== selectedImportId) {
        setSelectedImportId(nextSelectedId);
        if (selectedSource) setPostings([blankPosting(suggestedRoleFamily(selectedSource.originalFilename))]);
      }
    } catch (loadError) {
      setError(loadError.message || "Could not load PDF imports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImports();
  }, []);

  const updatePosting = (key, field, value) => {
    setPostings((current) => current.map((posting) =>
      posting.key === key ? { ...posting, [field]: value } : posting,
    ));
  };

  const uploadPdf = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF file.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");
    try {
      const body = new FormData();
      body.append("pdf", file);
      const response = await fetch("/api/jobs/admin/imports", {
        method: "POST",
        headers: authHeaders,
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not import the PDF.");
      setMessage(`${data.originalFilename} imported as a pending review.`);
      await loadImports();
      setSelectedImportId(String(data.id));
      setPostings([blankPosting(suggestedRoleFamily(data.originalFilename))]);
    } catch (uploadError) {
      setError(uploadError.message || "Could not import the PDF.");
    } finally {
      setUploading(false);
    }
  };

  const approvePostings = async () => {
    if (!selectedImport) return;
    if (postings.some((posting) => !posting.companyName.trim() || !posting.roleTitle.trim() || !posting.roleFamily)) {
      setError("Each posting needs a company, role title, and role family.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/jobs/admin/imports/${selectedImport.id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          postings: postings.map(({ key, requiredSkillsText, preferredSkillsText, ...posting }) => ({
            ...posting,
            requiredSkills: parseSkills(requiredSkillsText),
            preferredSkills: parseSkills(preferredSkillsText),
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not approve these postings.");
      setMessage(`Approved ${data.postingIds?.length || postings.length} posting(s).`);
      await loadImports();
    } catch (saveError) {
      setError(saveError.message || "Could not approve these postings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="job-review">
      <header className="job-review__header">
        <div>
          <h3>Review Job Postings</h3>
          <p>Turn imported PDFs into role-specific requirements for CV Maker and CV Filtering.</p>
        </div>
        <button type="button" onClick={loadImports} disabled={loading}>Refresh</button>
      </header>

      {(error || message) && (
        <div className={`job-review__notice ${error ? "job-review__notice--error" : ""}`} role="status">
          {error || message}
        </div>
      )}

      <div className="job-review__toolbar">
        <label className="job-review__token">
          Admin token (production only)
          <input
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Leave blank for local development"
          />
        </label>
        <label className="job-review__upload">
          {uploading ? "Importing PDF..." : "Import another PDF"}
          <input type="file" accept="application/pdf,.pdf" onChange={uploadPdf} disabled={uploading} />
        </label>
      </div>

      <div className="job-review__layout">
        <aside className="job-review__sources">
          <h4>Pending PDFs ({imports.length})</h4>
          {loading ? <p>Loading imports...</p> : imports.length === 0 ? (
            <p>No pending PDFs. Import one above to begin.</p>
          ) : imports.map((item) => (
            <button
              type="button"
              key={item.id}
              className={String(item.id) === selectedImportId ? "job-review__source job-review__source--active" : "job-review__source"}
              onClick={() => {
                setSelectedImportId(String(item.id));
                setPostings([blankPosting(suggestedRoleFamily(item.originalFilename))]);
              }}
            >
              <span>{item.originalFilename}</span>
              <small>{new Date(item.uploadedAt).toLocaleDateString()}</small>
            </button>
          ))}
        </aside>

        <div className="job-review__workspace">
          {!selectedImport ? <p>Select a pending PDF to review.</p> : (
            <>
              <div className="job-review__source-text">
                <h4>Extracted text: {selectedImport.originalFilename}</h4>
                <p className="job-review__suggestion-note">
                  Suggested starting category: {ROLE_FAMILIES.find((role) => role.value === suggestedRoleFamily(selectedImport.originalFilename))?.label}. Review and change it for each posting; PDFs may contain mixed roles.
                </p>
                <pre>{selectedImport.extractedText}</pre>
              </div>

              <div className="job-review__posting-header">
                <h4>Postings from this PDF</h4>
                <button type="button" onClick={() => setPostings((current) => [...current, blankPosting()])}>Add another posting</button>
              </div>

              {postings.map((posting, index) => (
                <fieldset className="job-review__posting" key={posting.key}>
                  <legend>Posting {index + 1}</legend>
                  <div className="job-review__fields">
                    <label>Company<input value={posting.companyName} onChange={(event) => updatePosting(posting.key, "companyName", event.target.value)} /></label>
                    <label>Role title<input value={posting.roleTitle} onChange={(event) => updatePosting(posting.key, "roleTitle", event.target.value)} /></label>
                    <label>CV template category
                      <select value={posting.roleFamily} onChange={(event) => updatePosting(posting.key, "roleFamily", event.target.value)}>
                        {ROLE_FAMILIES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                      </select>
                    </label>
                    <label>Location<input value={posting.location} onChange={(event) => updatePosting(posting.key, "location", event.target.value)} /></label>
                    <label>Work mode<input value={posting.workMode} onChange={(event) => updatePosting(posting.key, "workMode", event.target.value)} placeholder="On-site, hybrid, remote" /></label>
                    <label>Employment type<input value={posting.employmentType} onChange={(event) => updatePosting(posting.key, "employmentType", event.target.value)} /></label>
                    <label>Duration<input value={posting.duration} onChange={(event) => updatePosting(posting.key, "duration", event.target.value)} /></label>
                    <label>Application status
                      <select value={posting.applicationStatus} onChange={(event) => updatePosting(posting.key, "applicationStatus", event.target.value)}>
                        <option value="unknown">Unknown</option><option value="open">Open</option><option value="closed">Closed</option>
                      </select>
                    </label>
                    <label>Application link<input value={posting.applicationUrl} onChange={(event) => updatePosting(posting.key, "applicationUrl", event.target.value)} /></label>
                    <label>Application email<input value={posting.applicationEmail} onChange={(event) => updatePosting(posting.key, "applicationEmail", event.target.value)} /></label>
                  </div>
                  <label>Description and notes<textarea rows="4" value={posting.description} onChange={(event) => updatePosting(posting.key, "description", event.target.value)} /></label>
                  <div className="job-review__fields">
                    <label>Required skills (comma or newline separated)<textarea rows="3" value={posting.requiredSkillsText} onChange={(event) => updatePosting(posting.key, "requiredSkillsText", event.target.value)} /></label>
                    <label>Preferred skills (comma or newline separated)<textarea rows="3" value={posting.preferredSkillsText} onChange={(event) => updatePosting(posting.key, "preferredSkillsText", event.target.value)} /></label>
                  </div>
                  {postings.length > 1 && <button type="button" className="job-review__remove" onClick={() => setPostings((current) => current.filter((item) => item.key !== posting.key))}>Remove this posting</button>}
                </fieldset>
              ))}

              <div className="job-review__actions">
                <button type="button" onClick={approvePostings} disabled={saving}>{saving ? "Saving..." : `Approve ${postings.length} posting(s)`}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default JobPostingReview;
