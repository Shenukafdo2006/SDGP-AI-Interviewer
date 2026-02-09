import React, { useState } from 'react';
import './CVMaker.css';

const CVMaker = () => {
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: []
  });

  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [cvHealth, setCvHealth] = useState(null);
  const [showScoring, setShowScoring] = useState(false);
  const [showMatching, setShowMatching] = useState(false);

  // ==========================================
  // FEATURE 1: Smart CV Scoring & Feedback System
  // ==========================================
  const analyzeCV = () => {
    const score = {
      overall: 0,
      completeness: 0,
      formatting: 0,
      feedback: []
    };

    // Check completeness - Required fields
    const requiredFields = ['fullName', 'email', 'phone'];
    const filledFields = requiredFields.filter(field => cvData.personalInfo[field]);
    score.completeness = Math.round((filledFields.length / requiredFields.length) * 100);

    // Check sections
    if (cvData.experience.length > 0) score.completeness += 10;
    if (cvData.education.length > 0) score.completeness += 10;
    if (cvData.skills.length > 0) score.completeness += 10;

    // Cap at 100
    score.completeness = Math.min(score.completeness, 100);

    // Formatting check
    score.formatting = cvData.summary.length > 50 ? 100 : Math.round((cvData.summary.length / 50) * 100);

    // Calculate overall
    score.overall = Math.round((score.completeness + score.formatting) / 2);

    // Generate feedback
    if (cvData.personalInfo.fullName === '') {
      score.feedback.push({ type: 'error', message: '❌ Add your full name' });
    }
    if (cvData.personalInfo.email === '') {
      score.feedback.push({ type: 'error', message: '❌ Add your email address' });
    }
    if (cvData.personalInfo.phone === '') {
      score.feedback.push({ type: 'warning', message: '⚠️ Add your phone number' });
    }
    if (cvData.experience.length === 0) {
      score.feedback.push({ type: 'warning', message: '⚠️ Add at least one work experience' });
    }
    if (cvData.skills.length < 5) {
      score.feedback.push({ type: 'info', message: 'ℹ️ Add more skills (at least 5 recommended)' });
    }
    if (cvData.summary.length < 50) {
      score.feedback.push({ type: 'info', message: 'ℹ️ Write a longer professional summary (50+ characters)' });
    }

    setCvHealth(score);
    setShowScoring(true);
  };

  // ==========================================
  // FEATURE 2: Job Description Matching
  // ==========================================
  const matchJobDescription = () => {
    if (!jobDescription.trim()) {
      alert('⚠️ Please enter a job description to analyze');
      return;
    }

    // Extract keywords from job description (words longer than 3 characters)
    const jdKeywords = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Remove duplicates
    const uniqueJdKeywords = [...new Set(jdKeywords)];

    // Get all CV text
    const cvText = JSON.stringify(cvData).toLowerCase();
    
    // Count matched keywords
    const matched = [];
    const missing = [];

    uniqueJdKeywords.forEach(keyword => {
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
      missingList: missing.slice(0, 15)
    });
    setShowMatching(true);
  };

  return (
    <div className="cv-maker-container">
      {/* Header */}
      <div className="cv-maker-header">
        <h1>🎯 AI-Powered CV Maker</h1>
        <p>Create, Analyze & Optimize Your Resume</p>
      </div>

      {/* Feature Buttons */}
      <div className="feature-buttons">
        <button onClick={analyzeCV} className="feature-btn primary">
          📊 Smart CV Scoring & Feedback
        </button>
        <button onClick={() => setShowMatching(!showMatching)} className="feature-btn secondary">
          🎯 Job Description Matching
        </button>
      </div>

      {/* Basic CV Form */}
      <div className="cv-form-section">
        <h2>📝 Your CV Information</h2>
        
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={cvData.personalInfo.fullName}
            onChange={(e) => setCvData({
              ...cvData,
              personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
            })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={cvData.personalInfo.email}
              onChange={(e) => setCvData({
                ...cvData,
                personalInfo: { ...cvData.personalInfo, email: e.target.value }
              })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="+1 (234) 567-8900"
              value={cvData.personalInfo.phone}
              onChange={(e) => setCvData({
                ...cvData,
                personalInfo: { ...cvData.personalInfo, phone: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="City, Country"
            value={cvData.personalInfo.location}
            onChange={(e) => setCvData({
              ...cvData,
              personalInfo: { ...cvData.personalInfo, location: e.target.value }
            })}
          />
        </div>

        <div className="form-group">
          <label>Professional Summary</label>
          <textarea
            placeholder="Write a brief summary about your professional background and career goals... (50+ characters recommended)"
            value={cvData.summary}
            onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
            rows="5"
          />
          <small className="char-count">
            {cvData.summary.length} characters 
            {cvData.summary.length < 50 && ` (${50 - cvData.summary.length} more needed)`}
          </small>
        </div>

        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input
            type="text"
            placeholder="e.g., React, JavaScript, Python, Node.js, SQL, AWS"
            value={cvData.skills.join(', ')}
            onChange={(e) => setCvData({ 
              ...cvData, 
              skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
          />
          <small className="skill-count">
            {cvData.skills.length} skill{cvData.skills.length !== 1 ? 's' : ''} added
            {cvData.skills.length < 5 && ` (${5 - cvData.skills.length} more recommended)`}
          </small>
        </div>
      </div>

      {/* Feature 1: CV Health Score Display */}
      {showScoring && cvHealth && (
        <div className="cv-health-dashboard">
          <div className="dashboard-header">
            <h3>📊 Your CV Health Score</h3>
            <button onClick={() => setShowScoring(false)} className="close-btn">✕</button>
          </div>
          
          <div className="score-circle">
            <div className="circle" style={{
              background: `conic-gradient(
                ${cvHealth.overall >= 70 ? '#4caf50' : cvHealth.overall >= 40 ? '#ff9800' : '#f44336'} 0% ${cvHealth.overall}%,
                #e0e0e0 ${cvHealth.overall}% 100%
              )`
            }}>
              <div className="inner-circle">
                <div className="score-content">
                  <span className="score-number">{cvHealth.overall}%</span>
                  <span className="score-label">
                    {cvHealth.overall >= 70 ? 'Excellent' : cvHealth.overall >= 40 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="health-bars">
            <div className="health-bar">
              <div className="health-bar-header">
                <span>Completeness</span>
                <span className="percentage">{cvHealth.completeness}%</span>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${cvHealth.completeness}%` }}></div>
              </div>
            </div>

            <div className="health-bar">
              <div className="health-bar-header">
                <span>Formatting Quality</span>
                <span className="percentage">{cvHealth.formatting}%</span>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${cvHealth.formatting}%` }}></div>
              </div>
            </div>
          </div>

          <div className="feedback-section">
            <h4>💡 Recommendations to Improve Your CV</h4>
            <div className="feedback-list">
              {cvHealth.feedback.length > 0 ? (
                cvHealth.feedback.map((item, index) => (
                  <div key={index} className={`feedback-item ${item.type}`}>
                    {item.message}
                  </div>
                ))
              ) : (
                <div className="feedback-item success">
                  ✅ Excellent! Your CV is complete and well-formatted!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Job Description Matcher */}
      {showMatching && (
        <div className="job-matcher-section">
          <div className="dashboard-header">
            <h3>🎯 Job Description Matcher</h3>
            <button onClick={() => setShowMatching(false)} className="close-btn">✕</button>
          </div>

          <div className="matcher-description">
            <p>📋 Paste a job description below to see how well your CV matches the requirements.</p>
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              placeholder="Paste the complete job description here...

Example:
We are seeking a Senior Full Stack Developer with 5+ years of experience.

Requirements:
- Strong knowledge of React and Node.js
- Experience with AWS cloud services
- Proficiency in JavaScript/TypeScript
- Database experience (MongoDB, PostgreSQL)
..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="10"
              className="job-description-textarea"
            />
            <small>{jobDescription.length} characters</small>
          </div>

          <button onClick={matchJobDescription} className="analyze-btn">
            🔍 Analyze Match Score
          </button>

          {/* Match Results */}
          {matchScore && (
            <div className="match-results">
              <div className="match-score-header">
                <div className="score-badge" style={{
                  background: matchScore.percentage >= 70 ? '#4caf50' : 
                              matchScore.percentage >= 40 ? '#ff9800' : '#f44336'
                }}>
                  {matchScore.percentage}%
                </div>
                <div className="score-text">
                  <h4>Match Score</h4>
                  <p>Matched {matchScore.matchedKeywords} out of {matchScore.totalKeywords} keywords</p>
                  <div className="match-rating">
                    {matchScore.percentage >= 70 && '🌟 Excellent Match!'}
                    {matchScore.percentage >= 40 && matchScore.percentage < 70 && '👍 Good Match'}
                    {matchScore.percentage < 40 && '⚠️ Needs Improvement'}
                  </div>
                </div>
              </div>

              <div className="keywords-section">
                <div className="keyword-group matched">
                  <h5>✅ Matched Keywords ({matchScore.matchedList.length})</h5>
                  <p className="keyword-description">These keywords from the job description are already in your CV</p>
                  <div className="keyword-tags">
                    {matchScore.matchedList.map((keyword, index) => (
                      <span key={index} className="keyword-tag green">{keyword}</span>
                    ))}
                  </div>
                </div>

                <div className="keyword-group missing">
                  <h5>❌ Missing Keywords ({matchScore.missingList.length})</h5>
                  <p className="keyword-description">Consider adding these keywords to improve your match</p>
                  <div className="keyword-tags">
                    {matchScore.missingList.map((keyword, index) => (
                      <span key={index} className="keyword-tag red">{keyword}</span>
                    ))}
                  </div>
                  {matchScore.missingList.length > 0 && (
                    <p className="hint">
                      💡 <strong>Tip:</strong> Add relevant missing keywords to your professional summary, skills, or experience sections to improve your match score.
                    </p>
                  )}
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={() => {
                  setJobDescription('');
                  setMatchScore(null);
                }} className="reset-btn">
                  🔄 Try Another Job Description
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips Section */}
      <div className="quick-tips">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📝</div>
            <h4>Be Specific</h4>
            <p>Use concrete examples and quantifiable achievements in your summary</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Match Keywords</h4>
            <p>Tailor your CV to include keywords from the job description</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">✨</div>
            <h4>Keep It Clean</h4>
            <p>Use clear formatting and avoid unnecessary graphics or colors</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🚀</div>
            <h4>Show Impact</h4>
            <p>Focus on achievements and results rather than just responsibilities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVMaker;