import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = () => {
  const [activeFeature, setActiveFeature] = useState("welcome");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // Templates data
  const templates = [
    { id: "modern", name: "Modern", icon: "✨", color: "#667eea" },
    { id: "professional", name: "Professional", icon: "👔", color: "#2c3e50" },
    { id: "creative", name: "Creative", icon: "🎨", color: "#764ba2" },
    { id: "minimal", name: "Minimal", icon: "📄", color: "#4caf50" },
    { id: "academic", name: "Academic", icon: "🎓", color: "#2196f3" },
    { id: "tech", name: "Tech", icon: "💻", color: "#ff9800" },
  ];

  // Feature list for sidebar
  const features = [
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "📊", label: "CV Scoring", badge: "New" },
    { id: "jobmatch", icon: "🎯", label: "Job Match", badge: "Hot" },
    { id: "ai", icon: "🤖", label: "AI Suggestions" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "ats", icon: "✅", label: "ATS Test" },
    { id: "portfolio", icon: "🎨", label: "Portfolio" },
    { id: "export", icon: "📤", label: "Export" },
  ];

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

            {selectedTemplate && (
              <div className="selected-template-info">
                <h4>✅ Selected Template: {templates.find(t => t.id === selectedTemplate)?.name}</h4>
                <p>You can customize this template with your information</p>
                <button className="use-template-btn">
                  Use This Template →
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="feature-panel">
            <div className="panel-header">
              <h3>🎯 Welcome to CV Maker</h3>
              <p>Select a feature from the sidebar to get started with building your professional resume</p>
            </div>
            <div className="welcome-content">
              <div className="welcome-grid">
                <div className="welcome-card">
                  <div className="welcome-icon">📊</div>
                  <h4>Smart CV Analysis</h4>
                  <p>Get AI-powered feedback on your resume</p>
                </div>
                <div className="welcome-card">
                  <div className="welcome-icon">🎯</div>
                  <h4>Job Matching</h4>
                  <p>Match your CV with job requirements</p>
                </div>
                <div className="welcome-card">
                  <div className="welcome-icon">📋</div>
                  <h4>Professional Templates</h4>
                  <p>Choose from beautiful resume designs</p>
                </div>
                <div className="welcome-card">
                  <div className="welcome-icon">✨</div>
                  <h4>AI Suggestions</h4>
                  <p>Improve your CV with smart recommendations</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="cv-maker-dashboard">
      {/* Sidebar Navigation */}
      <div className="cv-maker-sidebar">
        <div className="sidebar-header">
          <h2>🎯 CV Maker</h2>
          <p className="subtitle">AI-Powered Resume Builder</p>
          <div className="user-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "12%" }}></div>
            </div>
            <span>12% Complete</span>
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
              {feature.badge && (
                <span className="badge">{feature.badge}</span>
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
            {features.find((f) => f.id === activeFeature)?.icon || "🎯"}
            {" "}
            {features.find((f) => f.id === activeFeature)?.label || "Welcome"}
          </h1>
          <p className="feature-description">
            {activeFeature === "templates" && "Choose from professionally designed templates"}
            {activeFeature === "welcome" && "Welcome to CV Maker - Your AI-powered resume building assistant"}
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
              <p className="stat-value">--/100</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h4>Match Rate</h4>
              <p className="stat-value">--%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <h4>Internship Ready</h4>
              <p className="stat-value">--%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h4>Time Saved</h4>
              <p className="stat-value">0h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVMaker;