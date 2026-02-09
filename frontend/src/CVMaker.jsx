import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = () => {
  const [activeFeature, setActiveFeature] = useState("scoring");
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [cvHealth, setCvHealth] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [coverLetter, setCoverLetter] = useState("");
  const [atsScore, setAtsScore] = useState(null);

  // Templates data
  const templates = [
    { id: "modern", name: "Modern", icon: "✨", color: "#667eea" },
    { id: "professional", name: "Professional", icon: "👔", color: "#2c3e50" },
    { id: "creative", name: "Creative", icon: "🎨", color: "#764ba2" },
    { id: "minimal", name: "Minimal", icon: "📄", color: "#4caf50" },
    { id: "academic", name: "Academic", icon: "🎓", color: "#2196f3" },
    { id: "tech", name: "Tech", icon: "💻", color: "#ff9800" },
  ];

  // Feature 1: Smart CV Scoring
  const analyzeCV = () => {
    const score = {
      overall: 78,
      completeness: 85,
      formatting: 72,
      atsScore: 90,
      feedback: [
        { type: "success", message: "✅ Professional summary is excellent" },
        { type: "warning", message: "⚠️ Add more quantifiable achievements" },
        { type: "info", message: "ℹ️ Consider adding GitHub portfolio link" },
        { type: "success", message: "✅ Skills section matches SE internship requirements" },
      ],
    };
    setCvHealth(score);
  };

  // Feature 2: Job Description Matching
  const matchJobDescription = () => {
    if (!jobDescription.trim()) {
      alert("⚠️ Please enter a job description to analyze");
      return;
    }

    const jdKeywords = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const uniqueJdKeywords = [...new Set(jdKeywords)];
    
    // Simulate CV data for keyword matching
    const sampleCVData = {
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      summary: "Software engineering student with experience in web development",
      experience: ["Web Developer Intern", "Freelance Developer"],
      education: ["BSc Computer Science"],
      projects: ["E-commerce Website", "Task Management App"]
    };
    
    const cvText = JSON.stringify(sampleCVData).toLowerCase();

    const matched = [];
    const missing = [];

    uniqueJdKeywords.forEach((keyword) => {
      if (cvText.includes(keyword)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const scorePercentage = Math.round((matched.length / uniqueJdKeywords.length) * 100);

    setMatchScore({
      percentage: scorePercentage,
      matchedKeywords: matched.length,
      totalKeywords: uniqueJdKeywords.length,
      matchedList: matched.slice(0, 10),
      missingList: missing.slice(0, 10),
    });
  };

  // Feature 3: ATS Test
  const runATSTest = () => {
    setAtsScore(85);
  };

  // Feature 4: Cover Letter Generator
  const generateCoverLetter = () => {
    const template = `Dear Hiring Manager,

I am writing to express my interest in the internship position at your company. With my background in technology and passion for learning, I am confident in my ability to contribute effectively.

As a motivated student seeking internship opportunities in software engineering, I have developed strong skills in programming, problem-solving, and team collaboration.

Thank you for considering my application.

Sincerely,
[Your Name]`;

    setCoverLetter(template);
  };

  // Render active feature based on state
  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "templates":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>📋 CV Templates</h3>
              <p>Choose from professionally designed templates for your internship applications</p>
            </div>

            <div className="templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                  style={{ borderColor: template.color }}
                >
                  <div className="template-icon" style={{ color: template.color }}>
                    {template.icon}
                  </div>
                  <h4>{template.name}</h4>
                  <p>
                    Perfect for{" "}
                    {template.id === "tech"
                      ? "SE students"
                      : template.id === "academic"
                      ? "QS students"
                      : template.id === "professional"
                      ? "PM students"
                      : "all roles"}
                  </p>
                  <button className="preview-btn" style={{ background: template.color }}>
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "scoring":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>📊 Smart CV Scoring & Feedback</h3>
              <p>Get detailed analysis of your CV's strength and areas for improvement</p>
            </div>

            <button onClick={analyzeCV} className="analyze-btn">
              🔍 Analyze My CV
            </button>

            {cvHealth && (
              <div className="scoring-results">
                <div className="score-cards">
                  <div className="score-card">
                    <div className="score-value" style={{ color: "#4caf50" }}>
                      {cvHealth.overall}%
                    </div>
                    <div className="score-label">Overall Score</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: "#2196f3" }}>
                      {cvHealth.completeness}%
                    </div>
                    <div className="score-label">Completeness</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: "#ff9800" }}>
                      {cvHealth.formatting}%
                    </div>
                    <div className="score-label">Formatting</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: "#9c27b0" }}>
                      {cvHealth.atsScore}%
                    </div>
                    <div className="score-label">ATS Friendly</div>
                  </div>
                </div>

                <div className="feedback-section">
                  <h4>💡 Recommendations for Internship Applications</h4>
                  <div className="feedback-list">
                    {cvHealth.feedback.map((item, index) => (
                      <div key={index} className={`feedback-item ${item.type}`}>
                        {item.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "jobmatch":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>🎯 Job Description Matching</h3>
              <p>Match your CV against job descriptions for better internship opportunities</p>
            </div>

            <div className="matcher-description">
              <p>📋 Paste a job description below to see how well your CV matches the requirements.</p>
            </div>

            <div className="form-group">
              <textarea
                placeholder="Paste internship job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="8"
                className="job-description-textarea"
              />
            </div>

            <button onClick={matchJobDescription} className="analyze-btn">
              🔍 Analyze Match Score
            </button>

            {matchScore && (
              <div className="match-results">
                <div className="match-score-header">
                  <div
                    className="score-badge"
                    style={{
                      background:
                        matchScore.percentage >= 70
                          ? "#4caf50"
                          : matchScore.percentage >= 40
                          ? "#ff9800"
                          : "#f44336",
                    }}
                  >
                    {matchScore.percentage}%
                  </div>
                  <div className="score-text">
                    <h4>Match Score</h4>
                    <p>
                      Matched {matchScore.matchedKeywords} out of {matchScore.totalKeywords} keywords
                    </p>
                  </div>
                </div>

                <div className="keywords-section">
                  <div className="keyword-group matched">
                    <h5>✅ Matched Keywords</h5>
                    <div className="keyword-tags">
                      {matchScore.matchedList.map((keyword, index) => (
                        <span key={index} className="keyword-tag green">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="keyword-group missing">
                    <h5>❌ Missing Keywords</h5>
                    <div className="keyword-tags">
                      {matchScore.missingList.map((keyword, index) => (
                        <span key={index} className="keyword-tag red">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "ai":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>🤖 AI-Powered Suggestions</h3>
              <p>Get personalized recommendations to enhance your CV for specific roles</p>
            </div>

            <div className="suggestions-grid">
              <div className="suggestion-card">
                <div className="suggestion-icon">💡</div>
                <h4>Summary Enhancement</h4>
                <p>Make your professional summary more impactful for tech roles</p>
                <button className="suggestion-btn">Enhance Now</button>
              </div>
              
              <div className="suggestion-card">
                <div className="suggestion-icon">🎯</div>
                <h4>Skills Optimization</h4>
                <p>Add trending skills for SE/QS/PM internships</p>
                <button className="suggestion-btn">Optimize Skills</button>
              </div>
              
              <div className="suggestion-card">
                <div className="suggestion-icon">📈</div>
                <h4>Experience Rewriting</h4>
                <p>Use action-oriented language for better impact</p>
                <button className="suggestion-btn">Rewrite</button>
              </div>
              
              <div className="suggestion-card">
                <div className="suggestion-icon">🔍</div>
                <h4>ATS Optimization</h4>
                <p>Improve parsing by Applicant Tracking Systems</p>
                <button className="suggestion-btn">Optimize for ATS</button>
              </div>
            </div>
          </div>
        );

      case "coverletter":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>✉️ Cover Letter Generator</h3>
              <p>Create personalized cover letters matching your CV</p>
            </div>

            <button onClick={generateCoverLetter} className="analyze-btn">
              ✨ Generate Cover Letter
            </button>

            {coverLetter && (
              <div className="cover-letter-section">
                <div className="cover-letter-header">
                  <h4>Generated Cover Letter</h4>
                  <button onClick={() => navigator.clipboard.writeText(coverLetter)} className="copy-btn">
                    📋 Copy to Clipboard
                  </button>
                </div>
                <div className="cover-letter-content">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="12"
                    className="cover-letter-textarea"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "ats":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>✅ ATS (Applicant Tracking System) Test</h3>
              <p>Check how well your CV will parse through automated systems</p>
            </div>

            <button onClick={runATSTest} className="analyze-btn">
              🧪 Run ATS Test
            </button>

            {atsScore !== null && (
              <div className="ats-results">
                <div className="ats-score">
                  <div className="score-circle">
                    <div
                      className="circle"
                      style={{
                        background: `conic-gradient(
                          ${atsScore >= 70 ? "#4caf50" : atsScore >= 40 ? "#ff9800" : "#f44336"} 0% ${atsScore}%,
                          #e0e0e0 ${atsScore}% 100%
                        )`,
                      }}
                    >
                      <div className="inner-circle">
                        <div className="score-content">
                          <span className="score-number">{atsScore}%</span>
                          <span className="score-label">
                            {atsScore >= 70 ? "ATS Friendly" : atsScore >= 40 ? "Needs Work" : "Not ATS Optimized"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ats-tips">
                  <h4>💡 ATS Optimization Tips</h4>
                  <ul>
                    <li>✅ Use standard headings: "Experience", "Education", "Skills"</li>
                    <li>✅ Avoid tables, images, and complex formatting</li>
                    <li>✅ Use bullet points (•) instead of special characters</li>
                    <li>✅ Include relevant keywords from job description</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case "portfolio":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>🎨 Portfolio Builder</h3>
              <p>Create and showcase your projects for internship applications</p>
            </div>

            <div className="portfolio-builder">
              <h4>Add Your Projects</h4>
              <div className="project-form">
                <input type="text" placeholder="Project Title" className="project-input" />
                <textarea placeholder="Project Description" className="project-textarea"></textarea>
                <input type="text" placeholder="Technologies Used (comma separated)" className="project-input" />
                <input type="text" placeholder="GitHub Link (optional)" className="project-input" />
                <button className="add-project-btn">+ Add Project</button>
              </div>
            </div>
          </div>
        );

      case "export":
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>📤 Export CV</h3>
              <p>Download your CV in multiple formats</p>
            </div>

            <div className="export-options">
              <div className="export-card">
                <div className="export-icon">📄</div>
                <h4>PDF Format</h4>
                <p>Best for online applications</p>
                <button className="export-btn">Download PDF</button>
              </div>
              
              <div className="export-card">
                <div className="export-icon">📝</div>
                <h4>Word Document</h4>
                <p>Editable format</p>
                <button className="export-btn">Download DOCX</button>
              </div>
              
              <div className="export-card">
                <div className="export-icon">📱</div>
                <h4>Plain Text</h4>
                <p>For online forms</p>
                <button className="export-btn">Download TXT</button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>🎯 Welcome to CV Maker</h3>
              <p>Select a feature from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  // Feature list for sidebar
  const features = [
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "📊", label: "CV Scoring" },
    { id: "jobmatch", icon: "🎯", label: "Job Match" },
    { id: "ai", icon: "🤖", label: "AI Suggestions" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "ats", icon: "✅", label: "ATS Test" },
    { id: "portfolio", icon: "🎨", label: "Portfolio" },
    { id: "export", icon: "📤", label: "Export" },
  ];

  return (
    <div className="cv-maker-dashboard">
      {/* Sidebar Navigation */}
      <div className="cv-maker-sidebar">
        <div className="sidebar-header">
          <h2>🎯 CV Maker</h2>
          <p className="subtitle">AI-Powered Resume Builder</p>
          <div className="user-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "65%" }}></div>
            </div>
            <span>65% Complete</span>
          </div>
        </div>

        <div className="sidebar-features">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`sidebar-feature ${activeFeature === feature.id ? "active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <span className="feature-label">{feature.label}</span>
              {(feature.id === "scoring" || feature.id === "jobmatch") && (
                <span className="badge">{feature.id === "scoring" ? "New" : "Hot"}</span>
              )}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="target-audience">
            <h4>🎯 For Internship Students</h4>
            <div className="audience-tags">
              <span className="tag">Software Engineering</span>
              <span className="tag">Quality Assurance</span>
              <span className="tag">Project Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="cv-maker-content">
        <div className="content-header">
          <h1>
            {features.find((f) => f.id === activeFeature)?.icon}
            {features.find((f) => f.id === activeFeature)?.label}
          </h1>
          <p className="feature-description">
            {activeFeature === "scoring" && "Get instant feedback on your CV completeness and quality"}
            {activeFeature === "jobmatch" && "Match your CV against job descriptions for better opportunities"}
            {activeFeature === "ai" && "Get AI-powered suggestions to improve your CV"}
            {activeFeature === "templates" && "Choose from professionally designed templates"}
            {activeFeature === "coverletter" && "Generate matching cover letters for your applications"}
            {activeFeature === "ats" && "Test your CV against Applicant Tracking Systems"}
            {activeFeature === "portfolio" && "Build your professional portfolio"}
            {activeFeature === "export" && "Download your CV in multiple formats"}
          </p>
        </div>

        {/* Active Feature Component */}
        <div className="feature-container">{renderActiveFeature()}</div>

        {/* Quick Stats Bar */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h4>CV Score</h4>
              <p className="stat-value">{cvHealth?.overall || "78"}/100</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h4>Match Rate</h4>
              <p className="stat-value">{matchScore?.percentage || "85"}%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <h4>Internship Ready</h4>
              <p className="stat-value">92%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h4>Time Saved</h4>
              <p className="stat-value">4.5h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVMaker;