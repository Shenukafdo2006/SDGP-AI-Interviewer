import React, { useState, useMemo } from 'react';
import './CareerSuggestions.css';

// ============================================
// CAREER DATA - Extended with skills, growth, and reasons
// ============================================
const careersData = [
  {
    id: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/IFS_logo.png',
    title: 'Front End Developer - IFS',
    company: 'IFS',
    salary: '$30k - $65k',
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML'],
    growth: 'High Demand',
    details: 'Work on modern web applications, collaborate with UI/UX teams, and use technologies like React, TypeScript, and CSS. You will be responsible for creating responsive user interfaces and ensuring cross-browser compatibility.',
    reasons: [
      'Matches your JavaScript and React skills',
      'Growing demand in Sri Lankan tech industry',
      'Great entry point for web development career'
    ]
  },
  {
    id: 2,
    logo: 'https://wso2.com/files/images/logo.svg',
    title: 'Backend Developer - WSO2',
    company: 'WSO2',
    salary: '$35k - $70k',
    skills: ['Node.js', 'Java', 'Python', 'MongoDB', 'REST APIs'],
    growth: 'Very High',
    details: 'Build scalable backend systems, APIs, and microservices using Node.js, Java, and cloud platforms. Work with databases and ensure system reliability and performance.',
    reasons: [
      'Strong backend development opportunities',
      'Exposure to enterprise-level systems',
      'Work with cutting-edge cloud technologies'
    ]
  },
  {
    id: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Virtusa_logo.png',
    title: 'Quality Assurance Engineer - Virtusa',
    company: 'Virtusa',
    salary: '$28k - $55k',
    skills: ['Selenium', 'Testing', 'Automation', 'JIRA', 'Agile'],
    growth: 'Stable',
    details: 'Ensure software quality through automated and manual testing, work with QA tools like Selenium, and collaborate with development teams to deliver bug-free products.',
    reasons: [
      'Critical role in software development lifecycle',
      'Good work-life balance opportunities',
      'Pathway to QA leadership roles'
    ]
  },
  {
    id: 4,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    title: 'Project Manager - Google',
    company: 'Google',
    salary: '$45k - $90k',
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'],
    growth: 'High Demand',
    details: 'Lead cross-functional teams, manage project timelines, and deliver innovative solutions in a fast-paced environment. Coordinate between stakeholders and ensure project success.',
    reasons: [
      'Leadership and strategic planning focus',
      'High earning potential with experience',
      'Work with global teams and technologies'
    ]
  },
  {
    id: 5,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    title: 'Data Scientist - Amazon',
    company: 'Amazon',
    salary: '$50k - $95k',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    growth: 'Very High',
    details: 'Analyze large datasets, build machine learning models, and derive insights that drive business decisions. Work with cutting-edge AI/ML technologies.',
    reasons: [
      'High demand for AI/ML professionals',
      'Competitive salary packages',
      'Work on impactful data-driven projects'
    ]
  },
  {
    id: 6,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    title: 'Cloud Solutions Architect - Microsoft',
    company: 'Microsoft',
    salary: '$55k - $100k',
    skills: ['Azure', 'AWS', 'Cloud Architecture', 'DevOps', 'Networking'],
    growth: 'Very High',
    details: 'Design and implement cloud solutions, migrate applications to the cloud, and ensure scalability and security of cloud infrastructure.',
    reasons: [
      'Cloud computing is the future',
      'Excellent career growth trajectory',
      'Work with enterprise clients globally'
    ]
  }
];

// ============================================
// AVAILABLE INTERESTS
// ============================================
const availableInterests = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Quality Assurance',
  'Project Management',
  'Cybersecurity',
  'UI/UX Design',
  'Game Development',
  'Blockchain'
];

// ============================================
// SKILL INPUT COMPONENT
// ============================================
const SkillInput = ({ skills, onAddSkill, onRemoveSkill }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      onAddSkill(skill);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  return (
    <div className="skill-input-container">
      <label className="skill-input-label">Your Skills</label>
      <div className="skill-input-wrapper">
        <input
          type="text"
          className="skill-input-field"
          placeholder="Enter a skill (e.g., React, Python)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="skill-add-btn" onClick={handleAddSkill}>
          Add
        </button>
      </div>
      <div className="skill-tags-container">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
            <button
              className="skill-tag-remove"
              onClick={() => onRemoveSkill(skill)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================
// INTEREST SELECTOR COMPONENT
// ============================================
const InterestSelector = ({ selectedInterests, onToggleInterest }) => {
  return (
    <div className="interest-selector-container">
      <label className="interest-selector-label">Your Interests</label>
      <div className="interest-options">
        {availableInterests.map((interest) => (
          <button
            key={interest}
            className={`interest-option ${
              selectedInterests.includes(interest) ? 'selected' : ''
            }`}
            onClick={() => onToggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// CAREER CARD COMPONENT
// ============================================
const CareerCard = ({ career, matchScore, onExplore }) => {
  return (
    <div className="career-card">
      <img
        src={career.logo}
        alt={`${career.company} logo`}
        className="career-card-logo"
      />
      <h3 className="career-card-title">{career.title}</h3>
      <p className="career-card-salary">{career.salary}</p>
      {matchScore > 0 && (
        <span className="career-card-match">{matchScore}% Match</span>
      )}
      <div className="career-card-skills">
        {career.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="career-card-skill">
            {skill}
          </span>
        ))}
      </div>
      <button className="career-card-btn" onClick={() => onExplore(career)}>
        Explore
      </button>
    </div>
  );
};

// ============================================
// CAREER DETAIL VIEW COMPONENT
// ============================================
const CareerDetailView = ({ career, onBack }) => {
  return (
    <div className="career-detail-view">
      <button className="career-detail-back-btn" onClick={onBack}>
        ← Back to Suggestions
      </button>
      
      <div className="career-detail-header">
        <img
          src={career.logo}
          alt={`${career.company} logo`}
          className="career-detail-logo"
        />
        <div>
          <h2 className="career-detail-title">{career.title}</h2>
          <p className="career-detail-salary">{career.salary}</p>
        </div>
      </div>

      <div className="career-detail-section">
        <h4 className="career-detail-section-title">📋 Job Description</h4>
        <p className="career-detail-description">{career.details}</p>
      </div>

      <div className="career-detail-section">
        <h4 className="career-detail-section-title">🛠️ Required Skills</h4>
        <div className="career-detail-skills">
          {career.skills.map((skill, index) => (
            <span key={index} className="career-detail-skill">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="career-detail-section">
        <h4 className="career-detail-section-title">📈 Growth Outlook</h4>
        <div className="career-detail-growth">
          <span className="career-detail-growth-badge">{career.growth}</span>
        </div>
      </div>

      <div className="career-detail-why">
        <h4 className="career-detail-why-title">💡 Why This Career?</h4>
        <ul className="career-detail-why-list">
          {career.reasons.map((reason, index) => (
            <li key={index} className="career-detail-why-item">
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================
// MAIN CAREER SUGGESTIONS COMPONENT
// ============================================
const CareerSuggestions = () => {
  // User profile state
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Handlers for skills
  const handleAddSkill = (skill) => {
    setUserSkills([...userSkills, skill]);
    setHasAnalyzed(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserSkills(userSkills.filter((skill) => skill !== skillToRemove));
    setHasAnalyzed(false);
  };

  // Handler for interests
  const handleToggleInterest = (interest) => {
    if (userInterests.includes(interest)) {
      setUserInterests(userInterests.filter((i) => i !== interest));
    } else {
      setUserInterests([...userInterests, interest]);
    }
    setHasAnalyzed(false);
  };

  // Calculate match score for each career
  const calculateMatchScore = (career) => {
    if (userSkills.length === 0) return 0;

    const userSkillsLower = userSkills.map((s) => s.toLowerCase());
    const careerSkillsLower = career.skills.map((s) => s.toLowerCase());

    let matchCount = 0;
    userSkillsLower.forEach((userSkill) => {
      careerSkillsLower.forEach((careerSkill) => {
        if (
          careerSkill.includes(userSkill) ||
          userSkill.includes(careerSkill)
        ) {
          matchCount++;
        }
      });
    });

    const score = Math.min(
      Math.round((matchCount / career.skills.length) * 100),
      100
    );
    return score;
  };

  // Get ranked careers based on user profile
  const rankedCareers = useMemo(() => {
    if (!hasAnalyzed) return careersData;

    return [...careersData]
      .map((career) => ({
        ...career,
        matchScore: calculateMatchScore(career)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [hasAnalyzed, userSkills]);

  // Handle analyze button click
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="career-suggestions-page">
        <div className="career-loading">
          <div className="career-loading-spinner"></div>
          <p className="career-loading-text">Analyzing your profile...</p>
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedCareer) {
    return (
      <div className="career-suggestions-page">
        <CareerDetailView
          career={selectedCareer}
          onBack={() => setSelectedCareer(null)}
        />
      </div>
    );
  }

  return (
    <div className="career-suggestions-page">
      {/* Header Banner */}
      <div className="career-header-banner">
        <h2 className="career-header-title">
          🚀 Why Explore These Careers?
        </h2>
        <p className="career-header-description">
          Each role is carefully selected to align with current industry demand
          and future growth opportunities, helping you prepare for real-world
          interviews with confidence. Add your skills and interests below to get
          personalized career recommendations.
        </p>
      </div>

      {/* User Profile Section */}
      <div className="career-profile-section">
        <h3 className="career-profile-title">👤 Your Profile</h3>
        <div className="career-profile-grid">
          <SkillInput
            skills={userSkills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
          <InterestSelector
            selectedInterests={userInterests}
            onToggleInterest={handleToggleInterest}
          />
        </div>
        <button
          className="career-analyze-btn"
          onClick={handleAnalyze}
          disabled={userSkills.length === 0 && userInterests.length === 0}
        >
          {hasAnalyzed ? '🔄 Re-analyze Profile' : '✨ Analyze & Get Recommendations'}
        </button>
      </div>

      {/* Career Cards Section */}
      <div className="career-cards-section">
        <h3 className="career-cards-title">
          💼 {hasAnalyzed ? 'Recommended Careers' : 'Available Careers'}
        </h3>
        
        {rankedCareers.length > 0 ? (
          <div className="career-cards-grid">
            {rankedCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                matchScore={hasAnalyzed ? career.matchScore : 0}
                onExplore={setSelectedCareer}
              />
            ))}
          </div>
        ) : (
          <div className="career-empty-state">
            <div className="career-empty-icon">🔍</div>
            <h4 className="career-empty-title">No careers found</h4>
            <p className="career-empty-description">
              Try adjusting your skills or interests to see recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSuggestions;