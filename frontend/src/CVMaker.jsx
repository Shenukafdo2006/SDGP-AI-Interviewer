import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [cvHealth, setCvHealth] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [coverLetter, setCoverLetter] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [cvContent, setCvContent] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [shareSettings, setShareSettings] = useState({
    privacy: "private",
    password: "",
    expiryDate: "",
    allowDownload: true,
  });
  const [collaborators, setCollaborators] = useState([]);
  const [cvVersions, setCvVersions] = useState([]);

  // Templates data with enhanced details
  const templates = [
    { 
      id: "modern", 
      name: "Modern", 
      icon: "✨", 
      color: "#667eea",
      description: "Clean and colorful design perfect for tech roles",
      bestFor: "Software Engineers, Designers"
    },
    { 
      id: "professional", 
      name: "Professional", 
      icon: "👔", 
      color: "#2c3e50",
      description: "Corporate and formal layout for traditional industries",
      bestFor: "Finance, Consulting, Management"
    },
    { 
      id: "creative", 
      name: "Creative", 
      icon: "🎨", 
      color: "#764ba2",
      description: "Design-focused with portfolio showcase sections",
      bestFor: "Designers, Artists, Marketing"
    },
    { 
      id: "minimal", 
      name: "Minimal", 
      icon: "📄", 
      color: "#4caf50",
      description: "Simple and ATS-friendly for maximum compatibility",
      bestFor: "All industries, ATS systems"
    },
    { 
      id: "academic", 
      name: "Academic", 
      icon: "🎓", 
      color: "#2196f3",
      description: "Research-focused with publications section",
      bestFor: "Researchers, Professors, PhD candidates"
    },
    { 
      id: "tech", 
      name: "Tech", 
      icon: "💻", 
      color: "#ff9800",
      description: "Optimized for technical roles with project highlights",
      bestFor: "Software Engineers, DevOps, Data Scientists"
    },
  ];

  // Feature list for sidebar
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

  return (
    <div className="cvmaker-dashboard">
      {/* Sidebar Navigation */}
      <div className="cvmaker-sidebar">
        <div className="cvmaker-sidebar-header">
          <h2>🎯 CV Maker Pro</h2>
          <p className="cvmaker-subtitle">AI-Powered Resume Builder</p>
          <div className="cvmaker-user-progress">
            <div className="cvmaker-progress-bar">
              <div className="cvmaker-progress-fill" style={{ width: "78%" }}></div>
            </div>
            <span>CV Health: 78%</span>
          </div>
        </div>

        <div className="cvmaker-sidebar-features">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`cvmaker-sidebar-feature ${activeFeature === feature.id ? "cvmaker-active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="cvmaker-feature-icon">{feature.icon}</span>
              <span className="cvmaker-feature-label">{feature.label}</span>
              {(feature.id === "dashboard" || feature.id === "ai" || feature.id === "analytics") && (
                <span className="cvmaker-badge">
                  {feature.id === "dashboard" ? "New" : feature.id === "ai" ? "Hot" : "Pro"}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="cvmaker-sidebar-footer">
          <button className="cvmaker-back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="cvmaker-target-audience">
            <h4>🎯 Perfect For</h4>
            <div className="cvmaker-audience-tags">
              <span className="cvmaker-tag">Software Engineering</span>
              <span className="cvmaker-tag">Quality Assurance</span>
              <span className="cvmaker-tag">Project Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="cvmaker-content">
        <div className="cvmaker-content-header">
          <h1>
            {features.find((f) => f.id === activeFeature)?.icon}
            {" "}
            {features.find((f) => f.id === activeFeature)?.label}
          </h1>
          <p className="cvmaker-feature-description">
            {activeFeature === "dashboard" && "Complete overview of your CV's health and performance metrics"}
            {activeFeature === "scoring" && "Get instant AI-powered feedback on your CV completeness and quality"}
            {activeFeature === "jobmatch" && "Match your CV against job descriptions for better opportunities"}
            {activeFeature === "ai" && "Get intelligent AI suggestions to improve every section of your CV"}
            {activeFeature === "templates" && "Choose from industry-optimized professional templates"}
            {activeFeature === "coverletter" && "Generate personalized cover letters that complement your CV"}
            {activeFeature === "ats" && "Test your CV against Applicant Tracking Systems"}
            {activeFeature === "integration" && "Import data automatically from LinkedIn and GitHub"}
            {activeFeature === "analytics" && "Track CV performance and get data-driven insights"}
            {activeFeature === "collaborate" && "Share with mentors and track version history"}
            {activeFeature === "privacy" && "Control who can access and download your CV"}
            {activeFeature === "export" && "Download your CV in multiple formats"}
          </p>
        </div>

        {/* Active Feature Component */}
        <div className="cvmaker-feature-container">
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>🎯 Welcome to CV Maker</h3>
              <p>Select a feature from the sidebar to get started</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="cvmaker-quick-stats">
          <div className="cvmaker-stat-card">
            <div className="cvmaker-stat-icon">📄</div>
            <div className="cvmaker-stat-info">
              <h4>CV Score</h4>
              <p className="cvmaker-stat-value">78/100</p>
            </div>
          </div>
          <div className="cvmaker-stat-card">
            <div className="cvmaker-stat-icon">🎯</div>
            <div className="cvmaker-stat-info">
              <h4>Job Match</h4>
              <p className="cvmaker-stat-value">85%</p>
            </div>
          </div>
          <div className="cvmaker-stat-card">
            <div className="cvmaker-stat-icon">✅</div>
            <div className="cvmaker-stat-info">
              <h4>ATS Score</h4>
              <p className="cvmaker-stat-value">90%</p>
            </div>
          </div>
          <div className="cvmaker-stat-card">
            <div className="cvmaker-stat-icon">👁️</div>
            <div className="cvmaker-stat-info">
              <h4>Total Views</h4>
              <p className="cvmaker-stat-value">127</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVMaker;