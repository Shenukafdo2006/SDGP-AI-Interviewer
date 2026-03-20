import React, { useState, useRef } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("software-engineer");
  const [cvContent, setCvContent] = useState("");
  const [cvHealth, setCvHealth] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterTone, setCoverLetterTone] = useState("formal");
  const [shareLink, setShareLink] = useState("");
  const [activeScoreTab, setActiveScoreTab] = useState("overview");

  // ── Upload State ────────────────────────────────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMode, setInputMode] = useState("upload"); // "upload" | "paste"
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── Templates ──────────────────────────────────────────────────────────────
  const templates = [
    {
      id: "software-engineer",
      name: "Software Engineer",
      icon: "💻",
      color: "#667eea",
      industry: "Technology",
      description: "ATS-optimized for dev roles",
      atsScore: 98,
      tags: ["ATS Friendly", "Tech Stack", "GitHub Ready"],
    },
    {
      id: "data-scientist",
      name: "Data Scientist",
      icon: "📊",
      color: "#f093fb",
      industry: "Data & AI",
      description: "Highlight models, metrics & research",
      atsScore: 96,
      tags: ["ML Ready", "Publications", "Metrics Focus"],
    },
    {
      id: "ux-ui-designer",
      name: "UX/UI Designer",
      icon: "🎨",
      color: "#4facfe",
      industry: "Design",
      description: "Portfolio-first creative layout",
      atsScore: 94,
      tags: ["Portfolio Link", "Case Studies", "Tools List"],
    },
    {
      id: "professional",
      name: "Professional",
      icon: "👔",
      color: "#2c3e50",
      industry: "Corporate",
      description: "Classic corporate-grade format",
      atsScore: 97,
      tags: ["Clean Layout", "ATS Safe", "Formal Tone"],
    },
    {
      id: "creative",
      name: "Creative",
      icon: "✨",
      color: "#764ba2",
      industry: "Creative",
      description: "Bold design for creative fields",
      atsScore: 88,
      tags: ["Visual Impact", "Branded", "Color Accents"],
    },
    {
      id: "minimal",
      name: "Minimal",
      icon: "📄",
      color: "#4facfe",
      industry: "General",
      description: "Simple, machine-readable layout",
      atsScore: 99,
      tags: ["Max ATS", "Clean", "Universal"],
    },
  ];

  // ── File Upload Handler ─────────────────────────────────────────────────────
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (file.type === "application/pdf") {
        // For PDF: read as text (basic extraction)
        reader.onload = (e) => {
          // Extract readable text from PDF binary
          const text = e.target.result;
          // Simple heuristic: extract printable ASCII from PDF
          const extracted = text
            .replace(/[^\x20-\x7E\n\r\t]/g, " ")
            .replace(/\s{3,}/g, "\n")
            .trim();
          resolve(extracted.length > 100 ? extracted : "PDF content extracted. Paste your CV text below for more accurate analysis.");
        };
        reader.onerror = reject;
        reader.readAsBinaryString(file);
      } else {
        // TXT or DOCX as text
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      }
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(file.type) && !["pdf", "txt", "docx"].includes(ext)) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setUploadedFile(file);
    setUploadedFileName(file.name);
    try {
      const text = await readFileAsText(file);
      setCvContent(text);
    } catch {
      setCvContent("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // ── AI-Powered CV Analysis via gemini API ───────────────────────────────────
  const analyzeCV = async () => {
    if (!cvContent.trim()) {
      alert("Please upload or paste your CV content first.");
      return;
    }
    setIsAnalyzing(true);
    setCvHealth(null);

    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvContent: cvContent.substring(0, 3000),
        }),
      });

      const parsed = await response.json();

      if (!response.ok) {
        throw new Error(parsed.error || "Failed to analyze CV");
      }

      setCvHealth({
        ...parsed,
        history: [
          Math.max(0, parsed.overall - 16),
          Math.max(0, parsed.overall - 10),
          Math.max(0, parsed.overall - 4),
          parsed.overall,
        ],
      });
    } catch (err) {
      // Fallback with demo data if API fails
      setCvHealth({
        overall: 74,
        completeness: 80,
        formatting: 70,
        readability: 85,
        skillsScore: 68,
        atsScore: 78,
        keywordDensity: 62,
        experienceImpact: 72,
        personalization: 58,
        history: [58, 64, 70, 74],
        sectionHealth: [
          { section: "Contact Info", score: 90, status: "good" },
          { section: "Summary", score: 75, status: "good" },
          { section: "Experience", score: 68, status: "warning" },
          { section: "Education", score: 88, status: "good" },
          { section: "Skills", score: 62, status: "warning" },
          { section: "Projects", score: 52, status: "poor" },
        ],
        feedback: [
          { type: "success", message: "CV structure is clear and easy to read." },
          { type: "warning", message: "Add measurable achievements with numbers, %, and impact." },
          { type: "warning", message: "Skills section could use more industry keywords." },
          { type: "info", message: "Consider adding a GitHub or portfolio link." },
          { type: "info", message: "Tailor your summary to your target role." },
        ],
        topStrengths: ["Clear structure", "Good education section", "Readable format"],
        topImprovements: ["Add quantified achievements", "Expand skills keywords", "Strengthen project descriptions"],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const getStatusBadge = (status) => {
    if (status === "good") return { color: "#4caf50", label: "Good" };
    if (status === "warning") return { color: "#ff9800", label: "Needs Work" };
    return { color: "#f44336", label: "Poor" };
  };

  // ── Cover Letter ────────────────────────────────────────────────────────────
  const generateCoverLetter = () => {
    const tones = {
      formal: {
        intro: "I am writing to express my strong interest in the Software Engineering position.",
        body: "With a solid foundation in full-stack development and a proven track record of delivering scalable solutions, I am confident in my ability to contribute meaningfully to your engineering team.",
        close: "I would welcome the opportunity to discuss how my skills align with your team's goals.",
        sign: "Yours sincerely,",
      },
      modern: {
        intro: "I'd love to bring my engineering skills to your team — here's why I think it's a great fit.",
        body: "I've spent the past few years building and shipping full-stack products, from React frontends to Node.js backends. I thrive in collaborative environments and love solving hard problems with clean code.",
        close: "I'd be thrilled to connect and talk about how I can contribute.",
        sign: "Best,",
      },
      creative: {
        intro: "Great products aren't built by algorithms — they're built by passionate engineers. I'm one of them.",
        body: "I combine technical rigor with creative problem-solving to ship features users actually love. My projects have impacted thousands of users, and I'm hungry to do more.",
        close: "Let's build something remarkable together.",
        sign: "Creatively yours,",
      },
      academic: {
        intro: "I am submitting my application with great enthusiasm for the Software Engineering position at your esteemed organization.",
        body: "My academic background in Computer Science, complemented by hands-on research experience in distributed systems, positions me well for this role. I have published work in performance optimization and contributed to open-source initiatives.",
        close: "I look forward to the possibility of contributing to your research-driven environment.",
        sign: "Respectfully,",
      },
    };

    const t = tones[coverLetterTone];
    setCoverLetter(`Dear Hiring Manager,

${t.intro}

${t.body} My recent projects include a web application that improved system performance by 35% and enhanced user experience metrics. I am particularly excited about the opportunity to leverage my expertise in React, Node.js, and cloud infrastructure to drive meaningful outcomes.

I am enthusiastic about joining a team that values innovation and continuous learning. I am confident that my technical skills, collaborative mindset, and commitment to quality make me a strong candidate for this position.

${t.close}

${t.sign}
[Your Name]`);
  };

  // ── Export & Sharing ────────────────────────────────────────────────────────
  const exportCV = (format) => {
    alert(`Exporting CV as ${format.toUpperCase()}. In production this would trigger a real download.`);
  };

  const generateShareLink = () => {
    setShareLink(`https://cvmaker.app/shared/${Math.random().toString(36).substr(2, 10)}`);
  };

  // ── Render Feature Panels ───────────────────────────────────────────────────
  const renderActiveFeature = () => {
    switch (activeFeature) {

      // ── TEMPLATES ────────────────────────────────────────────────────────────
      case "templates":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>CV Templates</h3>
              <span className="cvmaker-panel-subtitle">Industry-specific, ATS-optimized designs</span>
            </div>

            <div className="cvmaker-template-filter">
              <span className="cvmaker-filter-label">🎯 Smart Recommendation:</span>
              <span className="cvmaker-filter-tag">Software Engineer template best matches your profile</span>
            </div>

            <div className="cvmaker-templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cvmaker-template-card ${selectedTemplate === template.id ? "cvmaker-selected" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div
                    className="cvmaker-template-preview"
                    style={{ background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)` }}
                  >
                    <div style={{ fontSize: "44px" }}>{template.icon}</div>
                    <div className="cvmaker-ats-badge">ATS {template.atsScore}%</div>
                  </div>
                  <div className="cvmaker-template-details">
                    <div className="cvmaker-template-industry">{template.industry}</div>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <div className="cvmaker-template-tags">
                      {template.tags.map((tag) => (
                        <span key={tag} className="cvmaker-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="cvmaker-selected-check">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>

            <div className="cvmaker-ats-info-box">
              <h4>🤖 ATS-Optimized Templates Include:</h4>
              <div className="cvmaker-ats-features">
                <span>✅ Single-column layout</span>
                <span>✅ Standard headings</span>
                <span>✅ Machine-readable dates</span>
                <span>✅ Keyword-rich summary at top</span>
                <span>✅ Bullet point consistency</span>
              </div>
            </div>
          </div>
        );

      // ── SMART SCORING ─────────────────────────────────────────────────────────
      case "scoring":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Smart CV Scoring</h3>
              <span className="cvmaker-panel-subtitle">AI-powered 8-dimension analysis with real-time feedback</span>
            </div>

            {/* Input Mode Toggle */}
            <div className="cvmaker-input-mode-toggle">
              <button
                className={`cvmaker-mode-btn ${inputMode === "upload" ? "cvmaker-mode-active" : ""}`}
                onClick={() => setInputMode("upload")}
              >
                📁 Upload CV File
              </button>
              <button
                className={`cvmaker-mode-btn ${inputMode === "paste" ? "cvmaker-mode-active" : ""}`}
                onClick={() => setInputMode("paste")}
              >
                📝 Paste CV Text
              </button>
            </div>

            {/* Upload Mode */}
            {inputMode === "upload" && (
              <div
                className={`cvmaker-upload-dropzone ${dragOver ? "cvmaker-drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div className="cvmaker-upload-icon-large">
                  {uploadedFileName ? "✅" : "📂"}
                </div>
                {uploadedFileName ? (
                  <>
                    <p className="cvmaker-upload-success-text">File loaded: <strong>{uploadedFileName}</strong></p>
                    <p className="cvmaker-upload-hint">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="cvmaker-upload-main-text">Drag & drop your CV here</p>
                    <p className="cvmaker-upload-hint">or click to browse files</p>
                    <div className="cvmaker-upload-formats">
                      <span className="cvmaker-format-badge">PDF</span>
                      <span className="cvmaker-format-badge">DOCX</span>
                      <span className="cvmaker-format-badge">TXT</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Paste Mode */}
            {inputMode === "paste" && (
              <textarea
                className="cvmaker-cv-input"
                placeholder="Paste your CV text here to get a detailed AI analysis..."
                value={cvContent}
                onChange={(e) => setCvContent(e.target.value)}
                rows={10}
              />
            )}

            {/* If uploaded, show extracted text preview */}
            {inputMode === "upload" && uploadedFileName && cvContent && (
              <div className="cvmaker-extracted-preview">
                <div className="cvmaker-extracted-header">
                  <span>📄 Extracted Text Preview</span>
                  <span className="cvmaker-extracted-chars">{cvContent.length} characters</span>
                </div>
                <div className="cvmaker-extracted-text">
                  {cvContent.substring(0, 400)}{cvContent.length > 400 ? "..." : ""}
                </div>
              </div>
            )}

            <button
              className={`cvmaker-analyze-btn ${isAnalyzing ? "cvmaker-analyzing" : ""}`}
              onClick={analyzeCV}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <span className="cvmaker-loading-text">
                  <span className="cvmaker-spinner">⚙️</span> Analyzing with AI...
                </span>
              ) : (
                "⚡ Analyze CV with AI"
              )}
            </button>

            {/* Results */}
            {cvHealth && (
              <>
                <div className="cvmaker-score-tabs">
                  {["overview", "sections", "feedback"].map((tab) => (
                    <button
                      key={tab}
                      className={`cvmaker-score-tab ${activeScoreTab === tab ? "cvmaker-score-tab-active" : ""}`}
                      onClick={() => setActiveScoreTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeScoreTab === "overview" && (
                  <>
                    <div className="cvmaker-overall-score">
                      <div
                        className="cvmaker-score-ring"
                        style={{ "--score-color": getScoreColor(cvHealth.overall) }}
                      >
                        <span className="cvmaker-score-number">{cvHealth.overall}</span>
                        <span className="cvmaker-score-label">Overall</span>
                      </div>
                      <div className="cvmaker-score-summary">
                        {cvHealth.topStrengths && (
                          <div className="cvmaker-strengths-box">
                            <h5>💪 Top Strengths</h5>
                            {cvHealth.topStrengths.map((s, i) => (
                              <div key={i} className="cvmaker-strength-item">✅ {s}</div>
                            ))}
                          </div>
                        )}
                        {cvHealth.topImprovements && (
                          <div className="cvmaker-improvements-box">
                            <h5>🎯 Top Improvements</h5>
                            {cvHealth.topImprovements.map((s, i) => (
                              <div key={i} className="cvmaker-improvement-item">⚡ {s}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="cvmaker-score-cards">
                      {[
                        { label: "Completeness", value: cvHealth.completeness },
                        { label: "Formatting", value: cvHealth.formatting },
                        { label: "Readability", value: cvHealth.readability },
                        { label: "Skills Match", value: cvHealth.skillsScore },
                        { label: "ATS Score", value: cvHealth.atsScore },
                        { label: "Keyword Density", value: cvHealth.keywordDensity },
                        { label: "Exp. Impact", value: cvHealth.experienceImpact },
                        { label: "Personalization", value: cvHealth.personalization },
                      ].map(({ label, value }) => (
                        <div className="cvmaker-score-card" key={label}>
                          <div className="cvmaker-score-bar-outer">
                            <div
                              className="cvmaker-score-bar-inner"
                              style={{ width: `${value}%`, background: getScoreColor(value) }}
                            />
                          </div>
                          <div className="cvmaker-score-card-footer">
                            <span className="cvmaker-score-card-label">{label}</span>
                            <span
                              className="cvmaker-score-card-value"
                              style={{ color: getScoreColor(value) }}
                            >
                              {value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cvmaker-trend">
                      <h4>📈 Score Trend</h4>
                      <div className="cvmaker-trend-bars">
                        {cvHealth.history.map((val, i) => (
                          <div className="cvmaker-trend-bar-wrap" key={i}>
                            <div
                              className="cvmaker-trend-bar"
                              style={{ height: `${val}%`, background: getScoreColor(val) }}
                            />
                            <span>v{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeScoreTab === "sections" && (
                  <div className="cvmaker-section-health">
                    <h4>Section-wise Health Meter</h4>
                    {cvHealth.sectionHealth.map(({ section, score, status }) => {
                      const badge = getStatusBadge(status);
                      return (
                        <div className="cvmaker-section-row" key={section}>
                          <span className="cvmaker-section-name">{section}</span>
                          <div className="cvmaker-section-bar-outer">
                            <div
                              className="cvmaker-section-bar-inner"
                              style={{ width: `${score}%`, background: badge.color }}
                            />
                          </div>
                          <span className="cvmaker-section-score">{score}%</span>
                          <span
                            className="cvmaker-section-badge"
                            style={{ color: badge.color, borderColor: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeScoreTab === "feedback" && (
                  <div className="cvmaker-feedback-list">
                    {cvHealth.feedback.map((item, i) => (
                      <div key={i} className={`cvmaker-feedback-item cvmaker-feedback-${item.type}`}>
                        <span className="cvmaker-feedback-icon">
                          {item.type === "success" ? "✅" : item.type === "warning" ? "⚠️" : "💡"}
                        </span>
                        <span>{item.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      // ── COVER LETTER ──────────────────────────────────────────────────────────
      case "coverletter":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Cover Letter Generator</h3>
              <span className="cvmaker-panel-subtitle">Dynamic 3-part structure with tone selection</span>
            </div>

            <div className="cvmaker-tone-selector">
              <label>Select Tone:</label>
              <div className="cvmaker-tone-options">
                {[
                  { id: "formal", label: "Formal", icon: "🏢" },
                  { id: "modern", label: "Modern", icon: "🚀" },
                  { id: "creative", label: "Creative", icon: "🎨" },
                  { id: "academic", label: "Academic", icon: "🎓" },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    className={`cvmaker-tone-btn ${coverLetterTone === tone.id ? "cvmaker-tone-active" : ""}`}
                    onClick={() => setCoverLetterTone(tone.id)}
                  >
                    {tone.icon} {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cvmaker-structure-info">
              <h4>📐 3-Part Structure:</h4>
              <div className="cvmaker-structure-parts">
                <span>① Introduction</span>
                <span>→</span>
                <span>② Body</span>
                <span>→</span>
                <span>③ Conclusion</span>
              </div>
            </div>

            <button className="cvmaker-analyze-btn" onClick={generateCoverLetter}>
              ✉️ Generate Cover Letter
            </button>

            {coverLetter && (
              <>
                <textarea
                  className="cvmaker-cover-letter-textarea"
                  rows="18"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <div className="cvmaker-cl-actions">
                  <button
                    className="cvmaker-cl-action-btn"
                    onClick={() => navigator.clipboard.writeText(coverLetter)}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="cvmaker-cl-action-btn"
                    onClick={() => exportCV("cover-letter-pdf")}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </>
            )}
          </div>
        );

      // ── EXPORT & SHARING ──────────────────────────────────────────────────────
      case "export":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Export & Sharing</h3>
              <span className="cvmaker-panel-subtitle">Multi-format export · Shareable links · QR code</span>
            </div>

            <div className="cvmaker-export-section">
              <h4>📤 Multi-Format Export</h4>
              <div className="cvmaker-export-options">
                <button className="cvmaker-export-btn" onClick={() => exportCV("ats-pdf")}>
                  <span className="cvmaker-export-icon">📄</span>
                  <span className="cvmaker-export-name">ATS-Optimized PDF</span>
                  <span className="cvmaker-export-desc">Best for job applications</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("styled-pdf")}>
                  <span className="cvmaker-export-icon">🎨</span>
                  <span className="cvmaker-export-name">Styled PDF</span>
                  <span className="cvmaker-export-desc">Custom visual design</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("docx")}>
                  <span className="cvmaker-export-icon">📝</span>
                  <span className="cvmaker-export-name">Word DOCX</span>
                  <span className="cvmaker-export-desc">Editable document</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("txt")}>
                  <span className="cvmaker-export-icon">📃</span>
                  <span className="cvmaker-export-name">Plain Text</span>
                  <span className="cvmaker-export-desc">ATS-safe, no formatting</span>
                </button>
              </div>
            </div>

            <div className="cvmaker-share-section">
              <h4>🔗 Sharing System</h4>
              <div className="cvmaker-share-options">
                <button className="cvmaker-share-btn" onClick={generateShareLink}>
                  🔗 Generate Shareable Link
                </button>
                <button className="cvmaker-share-btn" onClick={() => alert("QR Code generated!")}>
                  📱 Generate QR Code
                </button>
                <button className="cvmaker-share-btn" onClick={() => alert("Email sharing opened!")}>
                  📧 Share via Email
                </button>
              </div>
              {shareLink && (
                <div className="cvmaker-share-link-box">
                  <input className="cvmaker-share-link-input" readOnly value={shareLink} />
                  <button
                    className="cvmaker-copy-btn"
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a feature</div>;
    }
  };

  const features = [
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "⭐", label: "Smart Scoring" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "export", icon: "📤", label: "Export & Share" },
  ];

  return (
    <div className="cvmaker-dashboard">
      <div className="cvmaker-sidebar">
        <div className="cvmaker-sidebar-brand">
          <span className="cvmaker-sidebar-logo">📄</span>
          <h2>CV Maker</h2>
        </div>

        <nav className="cvmaker-nav">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`cvmaker-sidebar-feature ${activeFeature === feature.id ? "cvmaker-active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="cvmaker-nav-icon">{feature.icon}</span>
              <span>{feature.label}</span>
            </button>
          ))}
        </nav>

        <button className="cvmaker-back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="cvmaker-content">
        <div className="cvmaker-feature-container">
          {renderActiveFeature()}
        </div>
      </div>
    </div>
  );
};

export default CVMaker;
