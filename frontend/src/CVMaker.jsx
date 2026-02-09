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
  
  // Feature 1: Smart CV Scoring
  const analyzeCV = () => {
    const score = {
      overall: 78,
      completeness: 85,
      formatting: 72,
      atsScore: 90,
      readability: 88,
      skillsScore: 70,
      experienceScore: 65,
      feedback: [
        { type: "success", message: "✅ Professional summary is excellent and well-structured" },
        { type: "warning", message: "⚠️ Add more quantifiable achievements (e.g., 'Increased sales by 40%')" },
        { type: "info", message: "ℹ️ Consider adding GitHub portfolio link to showcase projects" },
        { type: "success", message: "✅ Skills section matches SE internship requirements perfectly" },
        { type: "warning", message: "⚠️ Experience section needs action verbs (use 'Led' instead of 'Was responsible for')" },
        { type: "info", message: "ℹ️ Add 3 more technical skills to match industry standards" },
      ],
      sectionScores: {
        summary: 92,
        experience: 65,
        education: 88,
        skills: 70,
        projects: 75,
      },
      improvements: [
        { section: "Experience", priority: "High", impact: "+15 points" },
        { section: "Skills", priority: "Medium", impact: "+10 points" },
        { section: "Projects", priority: "Low", impact: "+5 points" },
      ]
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
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>📊 Smart CV Scoring & Feedback</h3>
              <p>Get detailed AI-powered analysis of your CV's strength and improvement areas</p>
            </div>

            <div className="cvmaker-scoring-input">
              <textarea
                className="cvmaker-cv-input"
                placeholder="Paste your CV content here for instant analysis..."
                value={cvContent}
                onChange={(e) => setCvContent(e.target.value)}
                rows="6"
              />
            </div>

            <button onClick={analyzeCV} className="cvmaker-analyze-btn">
              🔍 Analyze My CV
            </button>

            {cvHealth && (
              <div className="cvmaker-scoring-results">
                <div className="cvmaker-score-cards">
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#4caf50" }}>
                      {cvHealth.overall}%
                    </div>
                    <div className="cvmaker-score-label">Overall Score</div>
                  </div>
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#2196f3" }}>
                      {cvHealth.completeness}%
                    </div>
                    <div className="cvmaker-score-label">Completeness</div>
                  </div>
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#ff9800" }}>
                      {cvHealth.formatting}%
                    </div>
                    <div className="cvmaker-score-label">Formatting</div>
                  </div>
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#9c27b0" }}>
                      {cvHealth.atsScore}%
                    </div>
                    <div className="cvmaker-score-label">ATS Friendly</div>
                  </div>
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#00bcd4" }}>
                      {cvHealth.readability}%
                    </div>
                    <div className="cvmaker-score-label">Readability</div>
                  </div>
                  <div className="cvmaker-score-card">
                    <div className="cvmaker-score-value" style={{ color: "#e91e63" }}>
                      {cvHealth.skillsScore}%
                    </div>
                    <div className="cvmaker-score-label">Skills Match</div>
                  </div>
                </div>

                <div className="cvmaker-feedback-section">
                  <h4>💡 Detailed Feedback & Recommendations</h4>
                  <div className="cvmaker-feedback-list">
                    {cvHealth.feedback.map((item, index) => (
                      <div key={index} className={`cvmaker-feedback-item cvmaker-${item.type}`}>
                        {item.message}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cvmaker-section-breakdown">
                  <h4>📑 Section Breakdown</h4>
                  <div className="cvmaker-sections-list">
                    {Object.entries(cvHealth.sectionScores).map(([section, score]) => (
                      <div key={section} className="cvmaker-section-item">
                        <div className="cvmaker-section-name-score">
                          <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                          <span className={`cvmaker-section-score ${score >= 80 ? 'cvmaker-score-high' : score >= 60 ? 'cvmaker-score-medium' : 'cvmaker-score-low'}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="cvmaker-section-progress">
                          <div className="cvmaker-section-progress-fill" style={{
                            width: `${score}%`,
                            background: score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336'
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
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