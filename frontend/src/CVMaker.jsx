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
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [atsScore, setAtsScore] = useState(null);

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

  // Feature 3: ATS Test
  const runATSTest = () => {
    setAtsScore({
      score: 85,
      compatibility: "Excellent",
      issues: [
        { type: "warning", message: "Avoid using tables - use bullet points instead" },
        { type: "success", message: "Good use of standard section headings" },
        { type: "info", message: "Font is ATS-friendly (recommended: Arial, Calibri)" },
      ],
      tips: [
        "Use standard headings: Experience, Education, Skills",
        "Avoid tables, images, and complex formatting",
        "Use bullet points (•) instead of special characters",
        "Include relevant keywords from job description",
        "Save as .docx or .pdf (not scanned images)"
      ]
    });
  };

  // Feature 4: Cover Letter Generator
  const generateCoverLetter = () => {
    const jobTitle = "Software Engineering Intern";
    const company = "Tech Company";
    
    const template = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in computer science and hands-on experience in web development, I am confident in my ability to contribute effectively to your team.

As a motivated computer science student, I have developed strong skills in:
- Full-stack web development using React, Node.js, and SQL
- Problem-solving through data structures and algorithms
- Collaborative development using Git and Agile methodologies

My recent project, an E-commerce Website, demonstrates my ability to build scalable applications. I optimized the loading speed by 70% and implemented secure payment integration, serving over 1,000+ users.

I am particularly drawn to ${company} because of your commitment to innovation and your work in cutting-edge technologies. I am eager to bring my technical skills, dedication, and passion for learning to your team.

I would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application.

Sincerely,
[Your Name]

---
Generated by AI-Powered CV Maker
Tailored for: ${jobTitle} at ${company}`;
    
    setCoverLetter(template);
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

  // Feature 6: LinkedIn/GitHub Integration
  const importFromLinkedIn = () => {
    alert("🔗 LinkedIn Integration: This would connect to LinkedIn API and import your profile data.\n\nDemo: Importing profile data...");
    setTimeout(() => {
      alert("✅ Successfully imported:\n• Work Experience (3 positions)\n• Education (BSc Computer Science)\n• Skills (15 skills)\n• Recommendations (5)");
    }, 1500);
  };

  const importFromGitHub = () => {
    alert("🔗 GitHub Integration: This would connect to GitHub API and import your repositories.\n\nDemo: Importing repository data...");
    setTimeout(() => {
      alert("✅ Successfully imported:\n• 12 Public Repositories\n• Top Languages: JavaScript, Python, Java\n• 450+ Contributions this year\n• 5 Featured Projects");
    }, 1500);
  };

  // Export CV function (placeholder)
  const exportCV = (format) => {
    alert(`Exporting as ${format.toUpperCase()}...`);
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

      case "coverletter":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>✉️ Cover Letter Generator</h3>
              <p>Create personalized cover letters that complement your CV</p>
            </div>
            
            <div className="cvmaker-cover-letter-form">
              <div className="cvmaker-form-group">
                <label className="cvmaker-input-label">Job Title</label>
                <input 
                  type="text" 
                  className="cvmaker-input" 
                  placeholder="e.g., Software Engineering Intern"
                />
              </div>
              
              <div className="cvmaker-form-group">
                <label className="cvmaker-input-label">Company Name</label>
                <input 
                  type="text" 
                  className="cvmaker-input" 
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
              </div>
              
              <div className="cvmaker-form-group">
                <label className="cvmaker-input-label">Job Description (Optional)</label>
                <textarea 
                  className="cvmaker-input cvmaker-textarea-small" 
                  placeholder="Paste job description for better personalization..."
                  rows="4"
                />
              </div>
            </div>
            
            <button onClick={generateCoverLetter} className="cvmaker-analyze-btn">
              ✨ Generate Cover Letter
            </button>
            
            {coverLetter && (
              <div className="cvmaker-cover-letter-section">
                <div className="cvmaker-cover-letter-header">
                  <h4>📝 Generated Cover Letter</h4>
                  <div className="cvmaker-cover-actions">
                    <button 
                      onClick={() => navigator.clipboard.writeText(coverLetter)} 
                      className="cvmaker-copy-btn"
                    >
                      📋 Copy
                    </button>
                    <button 
                      onClick={() => exportCV('docx')} 
                      className="cvmaker-download-btn"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
                <div className="cvmaker-cover-letter-content">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="18"
                    className="cvmaker-cover-letter-textarea"
                  />
                </div>
                
                <div className="cvmaker-cover-letter-tips">
                  <h5>💡 Cover Letter Tips</h5>
                  <ul>
                    <li>Keep it concise (250-400 words)</li>
                    <li>Customize for each company and role</li>
                    <li>Highlight 2-3 key achievements from your CV</li>
                    <li>Show enthusiasm for the company's mission</li>
                    <li>End with a clear call-to-action</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case "ats":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>✅ ATS (Applicant Tracking System) Test</h3>
              <p>Check how well your CV will perform with automated screening systems</p>
            </div>

            <div className="cvmaker-ats-info">
              <div className="cvmaker-info-box">
                <h5>📌 What is ATS?</h5>
                <p>
                  Applicant Tracking Systems are software used by 75%+ of companies to automatically 
                  screen CVs before human review. A low ATS score means your CV might be rejected 
                  before anyone reads it.
                </p>
              </div>
            </div>

            <button onClick={runATSTest} className="cvmaker-analyze-btn">
              🧪 Run ATS Compatibility Test
            </button>

            {atsScore !== null && (
              <div className="cvmaker-ats-results">
                <div className="cvmaker-ats-score-display">
                  <div className="cvmaker-ats-score">
                    <div className="cvmaker-score-circle-ats">
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
                          stroke={atsScore.score >= 80 ? "#4caf50" : atsScore.score >= 60 ? "#ff9800" : "#f44336"}
                          strokeWidth="20"
                          strokeDasharray="565.48"
                          strokeDashoffset={565.48 - (565.48 * atsScore.score) / 100}
                          transform="rotate(-90 100 100)"
                        />
                      </svg>
                      <div className="cvmaker-score-overlay">
                        <div className="cvmaker-score-number-ats">{atsScore.score}%</div>
                        <div className="cvmaker-score-label-ats">{atsScore.compatibility}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cvmaker-ats-summary">
                    <h4>ATS Compatibility Report</h4>
                    <p>Your CV scored <strong>{atsScore.score}%</strong> for ATS compatibility.</p>
                    <div className="cvmaker-ats-verdict">
                      {atsScore.score >= 80 ? (
                        <span className="cvmaker-verdict cvmaker-pass">
                          ✅ Excellent! Your CV will pass most ATS systems
                        </span>
                      ) : atsScore.score >= 60 ? (
                        <span className="cvmaker-verdict cvmaker-warning">
                          ⚠️ Good, but some improvements recommended
                        </span>
                      ) : (
                        <span className="cvmaker-verdict cvmaker-fail">
                          ❌ Needs work - may be rejected by ATS systems
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="cvmaker-ats-issues">
                  <h4>🔍 Detected Issues</h4>
                  <div className="cvmaker-issues-list">
                    {atsScore.issues.map((issue, index) => (
                      <div key={index} className={`cvmaker-issue-item cvmaker-${issue.type}`}>
                        {issue.message}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cvmaker-ats-tips">
                  <h4>💡 ATS Optimization Guide</h4>
                  <div className="cvmaker-tips-grid">
                    {atsScore.tips.map((tip, index) => (
                      <div key={index} className="cvmaker-tip-card">
                        <div className="cvmaker-tip-number">{index + 1}</div>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cvmaker-ats-checklist">
                  <h4>✅ ATS-Friendly Checklist</h4>
                  <div className="cvmaker-checklist-items">
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" defaultChecked />
                      <span>Use standard section headings (Experience, Education, Skills)</span>
                    </label>
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" defaultChecked />
                      <span>Avoid tables, text boxes, and columns</span>
                    </label>
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" />
                      <span>No headers/footers with important information</span>
                    </label>
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" defaultChecked />
                      <span>Simple fonts (Arial, Calibri, Times New Roman)</span>
                    </label>
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" />
                      <span>Include keywords from job description</span>
                    </label>
                    <label className="cvmaker-checklist-item">
                      <input type="checkbox" defaultChecked />
                      <span>Save as .docx or .pdf (not scanned images)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "integration":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>🔗 LinkedIn & GitHub Integration</h3>
              <p>Import your professional data automatically from LinkedIn and GitHub</p>
            </div>

            <div className="cvmaker-integration-cards">
              <div className="cvmaker-integration-card">
                <div className="cvmaker-integration-icon cvmaker-linkedin">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h4>Import from LinkedIn</h4>
                <p>Automatically pull your work experience, education, skills, and recommendations</p>
                <button onClick={importFromLinkedIn} className="cvmaker-integration-btn cvmaker-linkedin-btn">
                  Connect LinkedIn
                </button>
                <div className="cvmaker-integration-features">
                  <div className="cvmaker-feature-check">✓ Work Experience</div>
                  <div className="cvmaker-feature-check">✓ Education History</div>
                  <div className="cvmaker-feature-check">✓ Skills & Endorsements</div>
                  <div className="cvmaker-feature-check">✓ Recommendations</div>
                </div>
              </div>

              <div className="cvmaker-integration-card">
                <div className="cvmaker-integration-icon cvmaker-github">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </div>
                <h4>Import from GitHub</h4>
                <p>Showcase your coding projects, contributions, and technical expertise</p>
                <button onClick={importFromGitHub} className="cvmaker-integration-btn cvmaker-github-btn">
                  Connect GitHub
                </button>
                <div className="cvmaker-integration-features">
                  <div className="cvmaker-feature-check">✓ Public Repositories</div>
                  <div className="cvmaker-feature-check">✓ Contribution Graph</div>
                  <div className="cvmaker-feature-check">✓ Programming Languages</div>
                  <div className="cvmaker-feature-check">✓ Featured Projects</div>
                </div>
              </div>
            </div>

            <div className="cvmaker-integration-benefits">
              <h4>🎯 Benefits of Integration</h4>
              <div className="cvmaker-benefits-grid">
                <div className="cvmaker-benefit-card">
                  <div className="cvmaker-benefit-icon">⚡</div>
                  <h5>Save Time</h5>
                  <p>Import years of data in seconds instead of typing manually</p>
                </div>
                <div className="cvmaker-benefit-card">
                  <div className="cvmaker-benefit-icon">✅</div>
                  <h5>Accuracy</h5>
                  <p>Reduce errors by pulling data directly from source</p>
                </div>
                <div className="cvmaker-benefit-card">
                  <div className="cvmaker-benefit-icon">🔄</div>
                  <h5>Stay Updated</h5>
                  <p>Sync changes automatically when you update profiles</p>
                </div>
                <div className="cvmaker-benefit-card">
                  <div className="cvmaker-benefit-icon">🎨</div>
                  <h5>Professional Format</h5>
                  <p>Data is automatically formatted to CV standards</p>
                </div>
              </div>
            </div>

            <div className="cvmaker-privacy-notice">
              <h5>🔒 Privacy & Security</h5>
              <p>
                We only access public information and data you explicitly authorize. 
                Your credentials are never stored, and you can revoke access anytime.
              </p>
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