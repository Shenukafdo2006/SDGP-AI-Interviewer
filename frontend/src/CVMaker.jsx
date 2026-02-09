import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  // =====================
  // States
  // =====================
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [jobDescription, setJobDescription] = useState("");
  const [cvContent, setCvContent] = useState("");
  const [cvHealth, setCvHealth] = useState(null);

  // =====================
  // Templates & Features
  // =====================
  const templates = [
    { id: "modern", name: "Modern", icon: "✨", color: "#667eea", description: "Clean and colorful design perfect for tech roles", bestFor: "Software Engineers, Designers" },
    { id: "professional", name: "Professional", icon: "👔", color: "#2c3e50", description: "Corporate and formal layout for traditional industries", bestFor: "Finance, Consulting, Management" },
    { id: "creative", name: "Creative", icon: "🎨", color: "#764ba2", description: "Design-focused with portfolio showcase sections", bestFor: "Designers, Artists, Marketing" },
    { id: "minimal", name: "Minimal", icon: "📄", color: "#4caf50", description: "Simple and ATS-friendly for maximum compatibility", bestFor: "All industries, ATS systems" },
    { id: "academic", name: "Academic", icon: "🎓", color: "#2196f3", description: "Research-focused with publications section", bestFor: "Researchers, Professors, PhD candidates" },
    { id: "tech", name: "Tech", icon: "💻", color: "#ff9800", description: "Optimized for technical roles with project highlights", bestFor: "Software Engineers, DevOps, Data Scientists" },
  ];

  const features = [
    { id: "dashboard", icon: "📊", label: "CV Health Dashboard" },
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "⭐", label: "Smart Scoring" },
    { id: "jobmatch", icon: "🎯", label: "Job Matching" },
    { id: "ai", icon: "🤖", label: "AI Suggestions" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "ats", icon: "✅", label: "ATS Test" },
    { id: "integration", icon: "🔗", label: "Integrations" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "collaborate", icon: "🤝", label: "Collaborate" },
    { id: "privacy", icon: "🔒", label: "Privacy" },
    { id: "export", icon: "📤", label: "Export" },
  ];

  // =====================
  // Functions
  // =====================
  const analyzeCV = () => {
    const score = {
      overall: 78,
      completeness: 85,
      formatting: 72,
      atsScore: 90,
      readability: 88,
      skillsScore: 70,
      feedback: [
        { type: "success", message: "✅ Professional summary is excellent" },
        { type: "warning", message: "⚠️ Add more quantifiable achievements" },
        { type: "info", message: "ℹ️ Consider adding GitHub portfolio link" },
      ],
      sectionScores: {
        summary: 92,
        experience: 65,
        education: 88,
        skills: 70,
        projects: 75,
      },
    };
    setCvHealth(score);
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "dashboard":
        return (
          <div className="feature-panel">
            <h3>📊 CV Health Dashboard</h3>
            <p>Overview of your CV's performance</p>
          </div>
        );

      case "templates":
        return (
          <div className="feature-panel">
            <h3>📋 Choose a Template</h3>
            <div className="template-list">
              {templates.map((tpl) => (
                <div key={tpl.id} className={`template-card ${tpl.id === activeFeature ? "active" : ""}`} style={{ borderColor: tpl.color }}>
                  <span className="icon">{tpl.icon}</span>
                  <h4>{tpl.name}</h4>
                  <p>{tpl.description}</p>
                  <small>Best for: {tpl.bestFor}</small>
                </div>
              ))}
            </div>
          </div>
        );

      case "scoring":
        return (
          <div className="feature-panel">
            <h3>⭐ Smart CV Scoring</h3>
            <textarea
              placeholder="Paste your CV here..."
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
              rows={6}
              className="cv-input"
            />
            <button onClick={analyzeCV} className="analyze-btn">Analyze CV</button>
            {cvHealth && (
              <div className="cv-score-results">
                <h4>Overall Score: {cvHealth.overall}%</h4>
                <p>Completeness: {cvHealth.completeness}%</p>
                <p>Formatting: {cvHealth.formatting}%</p>
                <p>ATS Score: {cvHealth.atsScore}%</p>
                <div className="feedback-list">
                  {cvHealth.feedback.map((f, i) => (
                    <p key={i} className={`feedback-${f.type}`}>{f.message}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="feature-panel">
            <h3>{features.find((f) => f.id === activeFeature)?.label}</h3>
            <p>Feature content coming soon...</p>
          </div>
        );
    }
  };

  // =====================
  // JSX Return
  // =====================
  return (
    <div className="cvmaker-dashboard">
      {/* Sidebar */}
      <div className="cvmaker-sidebar">
        <h2>🎯 CV Maker Pro</h2>
        <p>AI-Powered Resume Builder</p>
        <div className="sidebar-features">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`sidebar-feature ${activeFeature === feature.id ? "active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span>{feature.icon}</span> {feature.label}
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={() => onBack && onBack()}>← Back</button>
      </div>

      {/* Main Content */}
      <div className="cvmaker-content">
        {renderActiveFeature()}
      </div>
    </div>
  );
};

export default CVMaker;
