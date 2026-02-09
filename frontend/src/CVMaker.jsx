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
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [matchScore, setMatchScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]); // Add this state

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
    
    const sampleCVData = {
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "Docker"],
      summary: "Software engineering student with experience in web development and cloud technologies",
      experience: ["Web Developer Intern", "Freelance Developer", "Open Source Contributor"],
      education: ["BSc Computer Science"],
      projects: ["E-commerce Website", "Task Management App", "Machine Learning Model"]
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
      matchedList: matched.slice(0, 15),
      missingList: missing.slice(0, 15),
      recommendations: missing.slice(0, 5).map(skill => ({
        skill,
        action: `Add ${skill} to your skills section or complete a project using it`,
        priority: missing.indexOf(skill) < 3 ? "High" : "Medium"
      }))
    });
  };

  // Feature 5: AI Content Suggestions
  const generateAISuggestions = () => {
    setAiSuggestions([
      {
        section: "Summary",
        original: "I am a software developer with experience in coding",
        suggested: "Results-driven Software Developer with 3+ years of experience building scalable web applications using modern technologies",
        improvement: "+25 points",
        reason: "More specific, quantified, and uses strong action words"
      },
      {
        section: "Experience",
        original: "Made website faster",
        suggested: "Optimized website loading speed from 5.2s to 1.5s (71% improvement), enhancing user experience for 50,000+ monthly visitors",
        improvement: "+20 points",
        reason: "Quantifiable results with specific metrics"
      },
      {
        section: "Skills",
        original: "Good at Python",
        suggested: "Python (Advanced): Django, Flask, NumPy, Pandas - 3+ years production experience",
        improvement: "+15 points",
        reason: "Specific frameworks and proficiency level"
      },
      {
        section: "Projects",
        original: "Built a web app",
        suggested: "Developed full-stack e-commerce platform using React and Node.js, implementing secure payment gateway (Stripe) and serving 1,000+ active users",
        improvement: "+18 points",
        reason: "Specific technologies and measurable impact"
      }
    ]);
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "dashboard":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>🎯 CV Health Dashboard</h3>
              <p>Complete overview of your CV's performance and areas for improvement</p>
            </div>

            <div className="cvmaker-health-overview">
              <div className="cvmaker-health-score-large">
                <div className="cvmaker-score-circle-large">
                  <svg viewBox="0 0 200 200" className="cvmaker-progress-ring">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#667eea"
                      strokeWidth="20"
                      strokeDasharray="565.48"
                      strokeDashoffset={565.48 - (565.48 * 78) / 100}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="cvmaker-score-overlay">
                    <div className="cvmaker-score-number-large">78</div>
                    <div className="cvmaker-score-label-large">Overall Health</div>
                  </div>
                </div>
              </div>

              <div className="cvmaker-health-metrics">
                <div className="cvmaker-metric-card">
                  <div className="cvmaker-metric-icon">📊</div>
                  <div className="cvmaker-metric-info">
                    <h4>ATS Score</h4>
                    <p className="cvmaker-metric-value">90/100</p>
                    <span className="cvmaker-metric-status cvmaker-excellent">Excellent</span>
                  </div>
                </div>

                <div className="cvmaker-metric-card">
                  <div className="cvmaker-metric-icon">📖</div>
                  <div className="cvmaker-metric-info">
                    <h4>Readability</h4>
                    <p className="cvmaker-metric-value">88/100</p>
                    <span className="cvmaker-metric-status cvmaker-good">Good</span>
                  </div>
                </div>

                <div className="cvmaker-metric-card">
                  <div className="cvmaker-metric-icon">✅</div>
                  <div className="cvmaker-metric-info">
                    <h4>Completeness</h4>
                    <p className="cvmaker-metric-value">85/100</p>
                    <span className="cvmaker-metric-status cvmaker-good">Good</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cvmaker-section-scores">
              <h4>📋 Section-by-Section Analysis</h4>
              <div className="cvmaker-sections-grid">
                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Professional Summary</span>
                    <span className="cvmaker-section-score cvmaker-score-high">92/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '92%', background: '#4caf50'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">✅ Excellent - Well written and impactful</p>
                </div>

                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Work Experience</span>
                    <span className="cvmaker-section-score cvmaker-score-medium">65/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '65%', background: '#ff9800'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">⚠️ Add quantifiable achievements</p>
                </div>

                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Education</span>
                    <span className="cvmaker-section-score cvmaker-score-high">88/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '88%', background: '#4caf50'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">✅ Complete and well-formatted</p>
                </div>

                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Skills</span>
                    <span className="cvmaker-section-score cvmaker-score-medium">70/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '70%', background: '#ff9800'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">⚠️ Add 3 more technical skills</p>
                </div>

                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Projects</span>
                    <span className="cvmaker-section-score cvmaker-score-medium">75/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '75%', background: '#2196f3'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">ℹ️ Add GitHub links to projects</p>
                </div>

                <div className="cvmaker-section-score-card">
                  <div className="cvmaker-section-header">
                    <span className="cvmaker-section-name">Formatting</span>
                    <span className="cvmaker-section-score cvmaker-score-medium">72/100</span>
                  </div>
                  <div className="cvmaker-progress-bar-small">
                    <div className="cvmaker-progress-fill-small" style={{width: '72%', background: '#2196f3'}}></div>
                  </div>
                  <p className="cvmaker-section-feedback">ℹ️ Consider using bullet points</p>
                </div>
              </div>
            </div>

            <div className="cvmaker-improvement-roadmap">
              <h4>🚀 Improvement Roadmap</h4>
              <div className="cvmaker-roadmap-items">
                <div className="cvmaker-roadmap-item cvmaker-priority-high">
                  <div className="cvmaker-roadmap-icon">🔴</div>
                  <div className="cvmaker-roadmap-content">
                    <h5>Experience Section <span className="cvmaker-impact">+15 points</span></h5>
                    <p>Add quantifiable achievements with metrics and numbers</p>
                    <span className="cvmaker-priority-badge cvmaker-high">High Priority</span>
                  </div>
                </div>

                <div className="cvmaker-roadmap-item cvmaker-priority-medium">
                  <div className="cvmaker-roadmap-icon">🟡</div>
                  <div className="cvmaker-roadmap-content">
                    <h5>Skills Section <span className="cvmaker-impact">+10 points</span></h5>
                    <p>Add trending skills: Docker, Kubernetes, AWS</p>
                    <span className="cvmaker-priority-badge cvmaker-medium">Medium Priority</span>
                  </div>
                </div>

                <div className="cvmaker-roadmap-item cvmaker-priority-low">
                  <div className="cvmaker-roadmap-icon">🟢</div>
                  <div className="cvmaker-roadmap-content">
                    <h5>Projects Section <span className="cvmaker-impact">+5 points</span></h5>
                    <p>Link to GitHub repositories for code samples</p>
                    <span className="cvmaker-priority-badge cvmaker-low">Low Priority</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cvmaker-comparison">
              <h4>📊 Industry Comparison</h4>
              <div className="cvmaker-comparison-chart">
                <div className="cvmaker-comparison-item">
                  <span className="cvmaker-comparison-label">Your CV</span>
                  <div className="cvmaker-comparison-bar">
                    <div className="cvmaker-comparison-fill cvmaker-your-score" style={{width: '78%'}}>78%</div>
                  </div>
                </div>
                <div className="cvmaker-comparison-item">
                  <span className="cvmaker-comparison-label">Industry Average</span>
                  <div className="cvmaker-comparison-bar">
                    <div className="cvmaker-comparison-fill cvmaker-industry-avg" style={{width: '65%'}}>65%</div>
                  </div>
                </div>
                <div className="cvmaker-comparison-item">
                  <span className="cvmaker-comparison-label">Top 10% CVs</span>
                  <div className="cvmaker-comparison-bar">
                    <div className="cvmaker-comparison-fill cvmaker-top-ten" style={{width: '92%'}}>92%</div>
                  </div>
                </div>
              </div>
              <p className="cvmaker-comparison-note">
                💡 You're performing <strong>20% above industry average</strong>! 
                Focus on high-priority improvements to reach top 10%.
              </p>
            </div>
          </div>
        );

      case "templates":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>📋 CV Templates</h3>
              <p>Choose from professionally designed templates optimized for different industries</p>
            </div>
            <div className="cvmaker-template-filter">
              <button className="cvmaker-filter-btn cvmaker-active">All Templates</button>
              <button className="cvmaker-filter-btn">ATS-Friendly</button>
              <button className="cvmaker-filter-btn">Creative</button>
              <button className="cvmaker-filter-btn">Technical</button>
            </div>
            <div className="cvmaker-templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cvmaker-template-card ${selectedTemplate === template.id ? "cvmaker-selected" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="cvmaker-template-preview">
                    <div className="cvmaker-template-icon" style={{ color: template.color }}>
                      {template.icon}
                    </div>
                  </div>
                  <div className="cvmaker-template-details">
                    <h4>{template.name}</h4>
                    <p className="cvmaker-template-description">{template.description}</p>
                    <div className="cvmaker-template-meta">
                      <span className="cvmaker-best-for">
                        <strong>Best for:</strong> {template.bestFor}
                      </span>
                    </div>
                    <div className="cvmaker-template-actions">
                      <button 
                        className="cvmaker-preview-btn" 
                        style={{ background: template.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Previewing ${template.name} template...`);
                        }}
                      >
                        Preview
                      </button>
                      {selectedTemplate === template.id && (
                        <button className="cvmaker-use-template-btn">
                          ✓ Using
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cvmaker-template-tips">
              <h4>💡 Template Selection Tips</h4>
              <ul>
                <li><strong>For Tech Jobs:</strong> Use Modern or Tech templates with project sections</li>
                <li><strong>For Corporate:</strong> Professional template works best for finance/consulting</li>
                <li><strong>For ATS Systems:</strong> Minimal template has highest compatibility (95%+)</li>
                <li><strong>For Creative Roles:</strong> Creative template showcases your design sense</li>
              </ul>
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

      case "jobmatch":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>🎯 Job Description Matching</h3>
              <p>Analyze how well your CV matches specific job requirements</p>
            </div>

            <div className="cvmaker-matcher-description">
              <p>📋 Paste a job description below to see your match score and missing keywords</p>
            </div>

            <div className="cvmaker-form-group">
              <label className="cvmaker-input-label">Job Description</label>
              <textarea
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="10"
                className="cvmaker-job-description-textarea"
              />
            </div>

            <button onClick={matchJobDescription} className="cvmaker-analyze-btn">
              🔍 Analyze Match Score
            </button>

            {matchScore && (
              <div className="cvmaker-match-results">
                <div className="cvmaker-match-score-header">
                  <div
                    className="cvmaker-score-badge"
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
                  <div className="cvmaker-score-text">
                    <h4>Match Score</h4>
                    <p>
                      Matched {matchScore.matchedKeywords} out of {matchScore.totalKeywords} keywords
                    </p>
                    <span className={`cvmaker-match-status ${
                      matchScore.percentage >= 70 ? 'cvmaker-excellent' : 
                      matchScore.percentage >= 50 ? 'cvmaker-good' : 'cvmaker-needs-work'
                    }`}>
                      {matchScore.percentage >= 70 ? '🎉 Excellent Match!' : 
                       matchScore.percentage >= 50 ? '👍 Good Match' : '⚠️ Needs Improvement'}
                    </span>
                  </div>
                </div>

                <div className="cvmaker-keywords-section">
                  <div className="cvmaker-keyword-group cvmaker-matched">
                    <h5>✅ Matched Keywords ({matchScore.matchedList.length})</h5>
                    <div className="cvmaker-keyword-tags">
                      {matchScore.matchedList.map((keyword, index) => (
                        <span key={index} className="cvmaker-keyword-tag cvmaker-green">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="cvmaker-keyword-group cvmaker-missing">
                    <h5>❌ Missing Keywords ({matchScore.missingList.length})</h5>
                    <div className="cvmaker-keyword-tags">
                      {matchScore.missingList.map((keyword, index) => (
                        <span key={index} className="cvmaker-keyword-tag cvmaker-red">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {matchScore.recommendations && (
                  <div className="cvmaker-recommendations-section">
                    <h4>💡 Recommendations to Improve Match</h4>
                    <div className="cvmaker-recommendations-list">
                      {matchScore.recommendations.map((rec, index) => (
                        <div key={index} className="cvmaker-recommendation-item">
                          <div className="cvmaker-rec-header">
                            <span className="cvmaker-rec-skill">{rec.skill}</span>
                            <span className={`cvmaker-priority-badge cvmaker-${rec.priority.toLowerCase()}`}>
                              {rec.priority} Priority
                            </span>
                          </div>
                          <p className="cvmaker-rec-action">{rec.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "ai":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>🤖 AI-Powered Content Suggestions</h3>
              <p>Get intelligent recommendations to enhance every section of your CV</p>
            </div>

            <button onClick={generateAISuggestions} className="cvmaker-analyze-btn">
              ✨ Generate AI Suggestions
            </button>

            {aiSuggestions.length > 0 && (
              <div className="cvmaker-ai-suggestions">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="cvmaker-suggestion-comparison">
                    <div className="cvmaker-suggestion-header">
                      <h5>{suggestion.section}</h5>
                      <span className="cvmaker-improvement-badge">{suggestion.improvement}</span>
                    </div>
                    
                    <div className="cvmaker-comparison-boxes">
                      <div className="cvmaker-original-box">
                        <div className="cvmaker-box-label">❌ Original (Weak)</div>
                        <p>{suggestion.original}</p>
                      </div>
                      
                      <div className="cvmaker-arrow">→</div>
                      
                      <div className="cvmaker-suggested-box">
                        <div className="cvmaker-box-label">✅ AI Suggestion (Strong)</div>
                        <p>{suggestion.suggested}</p>
                      </div>
                    </div>
                    
                    <div className="cvmaker-suggestion-reason">
                      <strong>Why this is better:</strong> {suggestion.reason}
                    </div>
                    
                    <div className="cvmaker-suggestion-actions">
                      <button className="cvmaker-apply-btn">Apply Suggestion</button>
                      <button className="cvmaker-edit-btn">Edit & Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="cvmaker-ai-quick-tools">
              <h4>🛠️ Quick AI Tools</h4>
              <div className="cvmaker-quick-tools-grid">
                <div className="cvmaker-quick-tool">
                  <div className="cvmaker-tool-icon">💡</div>
                  <h5>Enhance Summary</h5>
                  <p>Make your professional summary more compelling</p>
                  <button className="cvmaker-tool-btn">Enhance</button>
                </div>
                
                <div className="cvmaker-quick-tool">
                  <div className="cvmaker-tool-icon">📊</div>
                  <h5>Add Metrics</h5>
                  <p>Suggest quantifiable achievements</p>
                  <button className="cvmaker-tool-btn">Add Metrics</button>
                </div>
                
                <div className="cvmaker-quick-tool">
                  <div className="cvmaker-tool-icon">🎯</div>
                  <h5>Action Verbs</h5>
                  <p>Replace weak verbs with powerful ones</p>
                  <button className="cvmaker-tool-btn">Optimize</button>
                </div>
                
                <div className="cvmaker-quick-tool">
                  <div className="cvmaker-tool-icon">🔍</div>
                  <h5>Keyword Optimizer</h5>
                  <p>Add industry-specific keywords</p>
                  <button className="cvmaker-tool-btn">Optimize</button>
                </div>
              </div>
            </div>
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