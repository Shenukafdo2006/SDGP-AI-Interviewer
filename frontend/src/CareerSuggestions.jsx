import React, { useState, useMemo } from 'react';
import './CareerSuggestions.css';

// ============================================
// CAREER DATA
// ============================================
const careersData = [
  {
    id: 1,
    logo: '/logos/99x.png',
    title: 'Software Engineer',
    company: '99X Technology',
    salary: 'LKR 150,000 - 350,000',
    skills: ['JavaScript', 'React', 'Node.js', 'Agile', 'Git'],
    growth: 'High Demand',
    details:
      'Work on high-quality software products for global clients using modern tech stacks and agile practices.',
    reasons: [
      '99X is known for excellent software engineering culture',
      'Many opportunities to work on cloud and product development',
      'Strong training and career progression paths'
    ],
    internshipRequirements: [
      'Pursuing or completed a degree in Computer Science, Software Engineering, IT, or related.',
      'Basic knowledge of programming and software fundamentals (e.g., OOP, data structures).',
      'Understanding of software development lifecycle (SDLC).',
      'Ability to write clean code in languages like Java, Python, JavaScript or similar.',
      'Problem-solving skills and eagerness to learn new technologies.',
      'Good communication and teamwork skills.'
    ],
    categories: ['Web Development', 'System Design', 'Project Management']
  },
  {
    id: 2,
    logo: '/logos/codegen.png',
    title: 'Backend Developer',
    company: 'CodeGen',
    salary: 'LKR 160,000 - 380,000',
    skills: ['Java', 'Spring Boot', 'REST APIs'],
    growth: 'High Demand',
    details: 'Develop scalable backend systems and APIs.',
    reasons: [
      'Great role for building strong server-side development skills',
      'High demand for backend engineers in enterprise software',
      'Excellent path into cloud and integration engineering'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic backend knowledge (Node.js / Java / Python)',
      'Understanding of APIs and databases',
      'Familiar with Git and version control',
      'Basic data structures & problem solving',
      'Good teamwork and communication skills'
    ],
    categories: ['Backend Development', 'APIs & Integration', 'Cloud Computing']
  },
  {
    id: 3,
    logo: '/logos/ifs.jpg',
    title: 'Full Stack Developer',
    company: 'IFS',
    salary: 'LKR 140,000 - 320,000',
    skills: ['React', 'Node.js', 'MongoDB'],
    growth: 'Very High Demand',
    details: 'Build end-to-end web applications using modern frameworks.',
    reasons: [
      'Full stack roles offer broad technical exposure',
      'Very valuable for startups and product companies',
      'Strong career growth into senior engineering roles'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic knowledge of frontend and backend development',
      'Familiar with HTML, CSS, JavaScript and at least one framework (React/Angular)',
      'Understanding of backend technologies (Node.js / Java / Python)',
      'Knowledge of databases (SQL or MongoDB)',
      'Understanding of REST APIs and full-stack architecture',
      'Basic Git and version control usage',
      'Problem-solving mindset and willingness to learn',
      'Good communication and teamwork skills'
    ],
    categories: ['Frontend Development', 'Backend Development', 'Web Development']
  },
  {
    id: 4,
    logo: '/logos/wso2.png',
    title: 'Mobile App Developer',
    company: 'WSO2',
    salary: 'LKR 130,000 - 300,000',
    skills: ['Flutter', 'React Native', 'Android', 'iOS'],
    growth: 'High Demand',
    details: 'Develop mobile applications for Android and iOS platforms.',
    reasons: [
      'Mobile apps remain highly relevant in the software industry',
      'Great path for cross-platform and native app experience',
      'Strong opportunity to work on UI and product-focused solutions'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic knowledge of mobile app development (Android, iOS, or cross-platform)',
      'Familiar with frameworks like Flutter or React Native',
      'Understanding of programming languages like Java, Kotlin, Swift, or JavaScript',
      'Knowledge of REST APIs and mobile app integration',
      'Basic understanding of UI/UX principles for mobile apps',
      'Familiar with Git and version control',
      'Problem-solving mindset and willingness to learn',
      'Good communication and teamwork skills'
    ],
    categories: ['Mobile Development', 'UI/UX Design']
  },
  {
    id: 5,
    logo: '/logos/hsenid.jpg',
    title: 'Software Developer',
    company: 'hSenid Software International',
    salary: 'LKR 120,000 - 280,000',
    skills: ['C#', '.NET', 'SQL', 'REST APIs', 'Teamwork'],
    growth: 'Stable',
    details:
      'Work on HR and business management software used across industries in Sri Lanka and abroad.',
    reasons: [
      'hSenid is a respected local software provider',
      'Good for understanding enterprise systems',
      'Balanced work responsibilities'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic understanding of programming concepts and OOP principles',
      'Knowledge of at least one programming language (Java, Python, C++, or JavaScript)',
      'Familiarity with databases and basic SQL queries',
      'Understanding of software development lifecycle (SDLC)',
      'Basic knowledge of data structures and algorithms',
      'Familiar with version control systems like Git',
      'Problem-solving skills and attention to detail',
      'Good communication and teamwork skills'
    ],
    categories: ['Web Development', 'System Design']
  },
  
  {
    id: 6,
    logo: '/logos/ifs.jpg',
    title: 'Frontend Developer',
    company: 'IFS Sri Lanka',
    salary: 'LKR 130,000 - 310,000',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'UI/UX'],
    growth: 'High',
    details:
      'Develop responsive and user-friendly interfaces for enterprise applications.',
    reasons: [
      'Strong demand for frontend skills in the local market',
      'International exposure while working at IFS',
      'Good entry point to enterprise web dev'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic knowledge of frontend development',
      'Familiar with HTML, CSS, and JavaScript',
      'Understanding of responsive web design principles',
      'Basic knowledge of frameworks or libraries like React, Angular, or Vue',
      'Understanding of UI/UX fundamentals',
      'Familiar with Git and version control',
      'Problem-solving skills and willingness to learn',
      'Good communication and teamwork skills'
    ],
    categories: ['Frontend Development', 'UI/UX Design', 'Web Development']
  },
  {
    id: 7,
    logo: '/logos/johnkeels.jpg',
    title: 'Software Solutions Engineer',
    company: 'John Keells IT',
    salary: 'LKR 140,000 - 330,000',
    skills: ['Java', 'Microservices', 'Cloud', 'SQL', 'Teamwork'],
    growth: 'Growing',
    details:
      'Design and build software solutions for sectors including leisure, aviation, and exports.',
    reasons: [
      'Works on diverse tech projects',
      'Exposure to enterprise-level systems',
      'Great cross-team collaboration'
    ],
    internshipRequirements: [
    'Degree in IT/SE/CS (ongoing or completed)',
    'Strong understanding of programming fundamentals and OOP',
    'Ability to analyze problems and design software solutions',
    'Basic knowledge of backend and frontend technologies',
    'Understanding of APIs and system integration concepts',
    'Familiarity with databases and data handling',
    'Basic knowledge of cloud platforms or distributed systems is a plus',
    'Good problem-solving and analytical thinking skills',
    'Excellent communication and teamwork skills'
  ]
  },
  {
    id: 8,
    logo: '/logos/millenium.png',
    title: 'DevOps Engineer',
    company: 'MillenniumIT ESP',
    salary: 'LKR 150,000 - 360,000',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    growth: 'Very High',
    details:
      'Support automated infrastructure workflows and cloud deployments using modern DevOps practices.',
    reasons: [
      'DevOps is one of the most in-demand roles in Sri Lanka',
      'Work on scalable systems',
      'Great salary growth potential'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic understanding of DevOps concepts and practices',
      'Familiarity with Linux/Unix systems and command line',
      'Basic knowledge of CI/CD pipelines (GitHub Actions, Jenkins, etc.)',
      'Understanding of containerization tools like Docker',
      'Basic knowledge of cloud platforms (AWS, Azure, or GCP)',
      'Familiarity with version control systems like Git',
      'Understanding of networking fundamentals is a plus',
      'Problem-solving mindset and willingness to learn',
      'Good communication and teamwork skills'
    ],
    categories: ['DevOps', 'Cloud Computing']
  },
  {
    id: 9,
    logo: '/logos/syscolabs.png',
    title: 'AI / ML Engineer',
    company: 'Sysco LABS',
    salary: 'LKR 180,000 - 400,000',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Modeling', 'SQL'],
    growth: 'Very High',
    details:
      'Work on machine learning projects and data-driven products for global clients.',
    reasons: [
      'Sysco LABS works on cutting-edge tech stacks',
      'AI & ML skills are trending globally',
      'Cross-domain experience'
    ],
     internshipRequirements: [
    'Degree in IT/SE/CS/Data Science (ongoing or completed)',
    'Strong knowledge of Python programming',
    'Basic understanding of machine learning concepts (supervised/unsupervised learning)',
    'Familiarity with libraries like Scikit-learn, TensorFlow, or PyTorch',
    'Understanding of data preprocessing and data analysis techniques',
    'Basic knowledge of statistics and linear algebra',
    'Experience with datasets and model training is a plus',]
    
  },
  {
    id: 10,
    logo: '/logos/virtusa.jpg',
    title: 'Quality Assurance Engineer',
    company: 'Virtusa Sri Lanka',
    salary: 'LKR 130,000 - 300,000',
    skills: ['Selenium', 'Test Automation', 'Agile', 'JIRA', 'Reporting'],
    growth: 'Stable',
    details:
      'Ensure the quality of software through test automation and manual testing practices.',
    reasons: [
      'QA roles are abundant in Sri Lankan IT firms',
      'Good starting point for new grads',
      'Opportunity to grow into leadership'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS (ongoing or completed)',
      'Basic understanding of software testing concepts (manual & automated testing)',
      'Knowledge of testing types (unit testing, integration testing, system testing)',
      'Familiarity with testing tools like Selenium, Cypress, or similar',
      'Basic understanding of SDLC and STLC',
      'Ability to identify, document, and track bugs',
      'Basic programming knowledge is a plus (Java, Python, or JavaScript)',
      'Attention to detail and analytical thinking',
      'Good communication and teamwork skills'
    ],
    categories: ['Quality Assurance']
  },
  {
    id: 11,
    logo: '/logos/wso2.png',
    title: 'Integration Developer',
    company: 'WSO2 Sri Lanka',
    salary: 'LKR 160,000 - 370,000',
    skills: ['Java', 'APIs', 'Middleware', 'Microservices', 'Cloud'],
    growth: 'Very High',
    details:
      'Develop integration platforms and API ecosystems for distributed enterprise systems.',
    reasons: [
      'WSO2 is a leader in integration software',
      'Great for backend & middleware experience',
      'Exposure to enterprise architecture'
    ],
    internshipRequirements: [
    'Degree in IT/SE/CS (ongoing or completed)',
    'Basic understanding of APIs and system integration concepts',
    'Knowledge of RESTful services and client-server communication',
    'Familiarity with programming languages like Java, Python, or JavaScript',
    'Understanding of microservices architecture is a plus',
    'Basic knowledge of databases and data formats (JSON, XML)',
    'Familiarity with integration tools or platforms is an advantage',]
  },
  {
    id: 12,
    logo: '/logos/microimage.png',
    title: 'Business Systems Developer',
    company: 'Microimage',
    salary: 'LKR 120,000 - 290,000',
    skills: ['Power BI', 'SQL', 'C#', 'Data Analytics', 'Reporting'],
    growth: 'Growing',
    details:
      'Develop business intelligence and workforce optimization software solutions.',
    reasons: [
      'Strong local reputation in analytics space',
      'Good mix of dev + data skills',
      'Work on products used by enterprises'
    ],
    internshipRequirements: [
      'Degree in IT/SE/CS/Information Systems (ongoing or completed)',
      'Basic understanding of software development and business system concepts',
      'Knowledge of programming languages like Java, Python, C#, or JavaScript',
      'Understanding of databases, SQL, and data management',
      'Basic knowledge of business processes and system analysis',
      'Familiarity with APIs, system integration, or enterprise applications is a plus',
      'Problem-solving and analytical thinking skills',
      'Good communication and teamwork skills',
      'Willingness to learn business requirements gathering and solution design'
    ],
    categories: ['Project Management', 'System Design', 'Web Development']
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
  const [showRequirements, setShowRequirements] = useState(false);

  const hasInternshipRequirements =
  career.internshipRequirements &&
  career.internshipRequirements.length > 0;
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

      <div className="career-card-actions">
        <button
          className="career-card-btn"
          onClick={() => onExplore(career)}
        >
          Explore
        </button>

        {hasInternshipRequirements && (
          <button
            className="career-card-btn career-card-btn-secondary"
            onClick={() => setShowRequirements(!showRequirements)}
          >
            {showRequirements
              ? 'Hide Internship Requirements'
              : 'Internship Requirements'}
          </button>
        )}
      </div>

      {hasInternshipRequirements && showRequirements && (
        <div className="internship-requirements-panel">
          <h4 className="internship-requirements-title">
            Internship Requirements
          </h4>

          <ul className="internship-requirements-list">
            {career.internshipRequirements.map((requirement, index) => (
              <li key={index} className="internship-requirement-item">
                <span className="requirement-check">✔</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
const CareerSuggestions = ({ onBack }) => {
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
    const normalizedUserSkills = [
      ...new Set(userSkills.map((skill) => normalizeSkill(skill)))
    ];

    const normalizedCareerSkills = career.skills.map((skill) =>
      normalizeSkill(skill)
    );

    const matchedSkills = normalizedCareerSkills.filter((careerSkill) =>
      normalizedUserSkills.some(
        (userSkill) =>
          careerSkill.includes(userSkill) || userSkill.includes(careerSkill)
      )
    );

    const skillScore =
      normalizedCareerSkills.length > 0
        ? (matchedSkills.length / normalizedCareerSkills.length) * 70
        : 0;

    const matchedInterests = (career.categories || []).filter((category) =>
      userInterests.includes(category)
    );

    const interestScore =
      career.categories && career.categories.length > 0
        ? (matchedInterests.length / career.categories.length) * 30
        : 0;

    const totalScore = Math.round(skillScore + interestScore);

    return {
      score: Math.min(totalScore, 100),
      matchedSkills,
      matchedInterests
    };
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
        <button className="go-back-button" onClick={onBack}>← Back</button>
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