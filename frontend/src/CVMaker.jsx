import React, { useState, useRef, useEffect } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvContent, setCvContent] = useState("");
  const [cvHealth, setCvHealth] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterTone, setCoverLetterTone] = useState("formal");
  const [shareLink, setShareLink] = useState("");
  const [activeScoreTab, setActiveScoreTab] = useState("overview");

  // State for the CV Editor (Edit Mode)
  const [showEditor, setShowEditor] = useState(false);
  const [editingCvName, setEditingCvName] = useState("Untitled CV");
  const [cvFormData, setCvFormData] = useState({
    photo: null,
    givenName: "",
    familyName: "",
    desiredJob: "",
    useAsHeadline: false,
    email: "",
    phone: "",
    address: "",
    postCode: "",
    city: "",
    dateOfBirth: "",
    placeOfBirth: "",
    drivingLicense: "",
    gender: "",
    nationality: "",
    civilStatus: "",
    website: "",
    linkedin: "",
    customField: "",
    professionalSummary: "",
    keySkills: [],
    experienceHighlights: [],
    education: "",
    projects: []
  });

  // ── Upload State ────────────────────────────────────────────────────────────
  const [, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMode, setInputMode] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── Role Filter State for Templates ─────────────────────────────────────────
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef(null);
  
  // ── AI Generated Templates State ────────────────────────────────────────────
  const [aiGeneratedTemplates] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(null);

  // Available intern roles for dropdown
  const internRoles = [
    { id: "intern-software-engineer", label: "Intern Software Engineer", recommendation: "Software Engineer template best matches your profile" },
    { id: "intern-web-developer", label: "Intern Web Developer", recommendation: "Web Developer template optimized for frontend/backend roles" },
    { id: "intern-ui-ux-designer", label: "Intern UI/UX Designer", recommendation: "UI/UX Designer template with portfolio-first layout" },
    { id: "intern-project-manager", label: "Intern Project Manager", recommendation: "Project Manager template focused on leadership and coordination" },
    { id: "intern-data-scientist", label: "Intern Data Scientist", recommendation: "Data Scientist template highlighting models, metrics & research" },
  ];

  // Filter roles based on search term
  const filteredRoles = internRoles.filter(role =>
    role.label.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  // Generate fallback content for templates
  const generateFallbackContent = (roleId) => {
    const contents = {
      "intern-software-engineer": {
        summary: "Passionate software engineer with strong problem-solving skills and experience in full-stack development. Eager to contribute to innovative projects and grow within a dynamic team environment.",
        skills: ["JavaScript/TypeScript", "React.js", "Node.js", "Python", "SQL", "Git", "REST APIs", "Agile Methodology"],
        experience: [
          "Developed and deployed 5+ full-stack applications using React and Node.js, achieving 30% faster page load times",
          "Improved application performance by 35% through code optimization and implementing lazy loading strategies",
          "Collaborated with cross-functional teams to deliver features on schedule, participating in 10+ successful sprint cycles"
        ],
        education: "Bachelor of Science in Computer Science | GPA: 3.8/4.0 | Expected Graduation: May 2025",
        projects: [
          "E-Commerce Platform: Built a full-stack e-commerce site with React, Node.js, and MongoDB, handling 1000+ products",
          "Task Management App: Developed a task management tool with real-time updates using WebSockets and React"
        ]
      },
      "intern-web-developer": {
        summary: "Creative web developer specializing in responsive design and modern frontend frameworks. Passionate about creating seamless user experiences and optimizing web performance.",
        skills: ["HTML5/CSS3", "JavaScript/ES6", "React.js", "Vue.js", "Tailwind CSS", "WordPress", "Web Performance", "SEO"],
        experience: [
          "Built 10+ responsive websites with 98% Lighthouse scores, improving mobile user engagement by 45%",
          "Implemented SEO strategies increasing organic traffic by 45% within 3 months",
          "Created reusable component libraries reducing development time by 30% across team projects"
        ],
        education: "Bachelor of Science in Web Development | University of Technology | 2022-2026",
        projects: [
          "Portfolio Website: Designed and developed a responsive portfolio with 99% accessibility score",
          "E-Learning Platform: Created an interactive learning platform with video integration and progress tracking"
        ]
      },
      "intern-ui-ux-designer": {
        summary: "User-centered designer focused on creating intuitive and beautiful digital experiences. Skilled in translating user research into actionable design solutions that drive engagement.",
        skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Interaction Design"],
        experience: [
          "Redesigned mobile app resulting in 40% increase in user engagement and 25% reduction in bounce rate",
          "Conducted 25+ user interviews to inform design decisions, leading to 3 major product improvements",
          "Created comprehensive design system used by 3 product teams, ensuring consistency across 50+ components"
        ],
        education: "Bachelor of Design in Interaction Design | Design Institute | 2021-2025",
        projects: [
          "Mobile Banking App: Designed end-to-end user flows for a banking app, increasing user retention by 35%",
          "Healthcare Dashboard: Created an accessible dashboard for medical professionals, reducing task completion time by 40%"
        ]
      },
      "intern-project-manager": {
        summary: "Results-driven project manager skilled in leading cross-functional teams and delivering projects on time and within budget. Adept at stakeholder management and agile methodologies.",
        skills: ["Agile/Scrum", "JIRA", "Stakeholder Management", "Risk Assessment", "Budget Planning", "Team Leadership", "Communication", "Strategic Planning"],
        experience: [
          "Managed 5 projects simultaneously with 95% on-time delivery rate, handling budgets up to $500K",
          "Reduced project costs by 20% through efficient resource allocation and vendor negotiations",
          "Implemented agile practices increasing team velocity by 40% and improving stakeholder satisfaction by 35%"
        ],
        education: "Master of Business Administration (MBA) | Business School | 2023-2025",
        projects: [
          "Digital Transformation: Led a 6-month project to migrate legacy systems, completed 2 weeks ahead of schedule",
          "Product Launch: Coordinated cross-functional launch of 3 new features, achieving 150% of adoption targets"
        ]
      },
      "intern-data-scientist": {
        summary: "Data scientist with strong analytical skills and experience in machine learning and statistical analysis. Passionate about extracting actionable insights from complex datasets.",
        skills: ["Python", "SQL", "Machine Learning", "TensorFlow", "Data Visualization", "Statistical Analysis", "Pandas", "Tableau"],
        experience: [
          "Built predictive models achieving 92% accuracy, reducing customer churn by 15%",
          "Analyzed 1M+ records to identify key business insights, driving a 10% revenue increase",
          "Created interactive dashboards reducing reporting time by 60% for executive stakeholders"
        ],
        education: "Master of Science in Data Science | University of Technology | 2022-2024",
        projects: [
          "Customer Segmentation: Implemented K-means clustering to segment 500K customers, enabling targeted marketing",
          "Stock Price Prediction: Developed LSTM model achieving 88% accuracy in predicting stock trends"
        ]
      }
    };
    return contents[roleId] || contents["intern-software-engineer"];
  };

  // Base Templates
  const baseTemplates = [
    {
      id: "intern-software-engineer-base",
      name: "Intern Software Engineer",
      icon: "💻",
      color: "#667eea",
      industry: "Technology",
      description: "ATS-optimized for dev roles",
      atsScore: 98,
      tags: ["ATS Friendly", "Tech Stack", "GitHub Ready"],
      roleCategory: "intern-software-engineer",
      aiContent: generateFallbackContent("intern-software-engineer")
    },
    {
      id: "intern-data-scientist-base",
      name: "Intern Data Scientist",
      icon: "📊",
      color: "#f093fb",
      industry: "Data & AI",
      description: "Highlight models, metrics & research",
      atsScore: 96,
      tags: ["ML Ready", "Publications", "Metrics Focus"],
      roleCategory: "intern-data-scientist",
      aiContent: generateFallbackContent("intern-data-scientist")
    },
    {
      id: "intern-ui-ux-designer-base",
      name: "Intern UX/UI Designer",
      icon: "🎨",
      color: "#4facfe",
      industry: "Design",
      description: "Portfolio-first creative layout",
      atsScore: 94,
      tags: ["Portfolio Link", "Case Studies", "Tools List"],
      roleCategory: "intern-ui-ux-designer",
      aiContent: generateFallbackContent("intern-ui-ux-designer")
    },
    {
      id: "intern-quality-assurance-base",
      name: "Intern Quality Assurance",
      icon: "👔",
      color: "#2c3e50",
      industry: "Technology",
      description: "ATS-optimized for QA roles",
      atsScore: 97,
      tags: ["ATS Friendly", "Testing Tools", "Bug Tracking"],
      roleCategory: "intern-software-engineer",
      aiContent: generateFallbackContent("intern-software-engineer")
    },
    {
      id: "intern-web-developer-base",
      name: "Intern Web Developer",
      icon: "✨",
      color: "#764ba2",
      industry: "Technology",
      description: "ATS-optimized for web development roles",
      atsScore: 88,
      tags: ["Frontend", "Backend", "Full Stack Ready"],
      roleCategory: "intern-web-developer",
      aiContent: generateFallbackContent("intern-web-developer")
    },
    {
      id: "intern-project-manager-base",
      name: "Intern Project Manager",
      icon: "📄",
      color: "#4facfe",
      industry: "Management",
      description: "ATS-optimized for project coordination roles",
      atsScore: 99,
      tags: ["Leadership", "Agile Ready", "Scrum"],
      roleCategory: "intern-project-manager",
      aiContent: generateFallbackContent("intern-project-manager")
    },
  ];

  // Combine base templates with AI-generated templates
  const allTemplates = [...baseTemplates, ...aiGeneratedTemplates];
  
  // Filter templates based on selected role
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  
  const filteredTemplates = selectedRoleId
    ? allTemplates.filter(template => template.roleCategory === selectedRoleId)
    : allTemplates;

  // Get current recommendation
  const getCurrentRecommendation = () => {
    if (selectedRoleId) {
      const selectedRole = internRoles.find(role => role.id === selectedRoleId);
      return selectedRole ? selectedRole.recommendation : "Select a role to see personalized recommendations";
    }
    return "Software Engineer template best matches your profile";
  };

  // Handle role selection
  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    const selectedRole = internRoles.find(r => r.id === roleId);
    setRoleSearchTerm(selectedRole?.label || "");
    setShowRoleDropdown(false);
    setSelectedTemplate(null);
  };

  // Clear role filter
  const clearRoleFilter = () => {
    setSelectedRoleId(null);
    setRoleSearchTerm("");
    setSelectedTemplate(null);
  };

  // Handle explore template button click - Opens editor with template content
  const handleExploreTemplate = (template) => {
    const templateContent = template.aiContent || generateFallbackContent(template.roleCategory);
    
    setCvFormData({
      photo: null,
      givenName: "",
      familyName: "",
      desiredJob: template.name,
      useAsHeadline: true,
      email: "",
      phone: "",
      address: "",
      postCode: "",
      city: "",
      dateOfBirth: "",
      placeOfBirth: "",
      drivingLicense: "",
      gender: "",
      nationality: "",
      civilStatus: "",
      website: "",
      linkedin: "",
      customField: "",
      professionalSummary: templateContent.summary || "",
      keySkills: templateContent.skills || [],
      experienceHighlights: templateContent.experience || [],
      education: templateContent.education || "",
      projects: templateContent.projects || []
    });
    
    setEditingCvName(template.name);
    setShowEditor(true);
  };

  // Handle back from editor
  const handleBackFromEditor = () => {
    setShowEditor(false);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCvFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle skills array
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setCvFormData(prev => ({
      ...prev,
      keySkills: skillsArray
    }));
  };

  // Handle experience array
  const handleExperienceChange = (e) => {
    const expArray = e.target.value.split('\n').filter(line => line.trim());
    setCvFormData(prev => ({
      ...prev,
      experienceHighlights: expArray
    }));
  };

  // Handle projects array
  const handleProjectsChange = (e) => {
    const projectsArray = e.target.value.split('\n').filter(line => line.trim());
    setCvFormData(prev => ({
      ...prev,
      projects: projectsArray
    }));
  };

  // Save CV
  const handleSaveCV = () => {
    alert(`CV "${editingCvName}" saved successfully!`);
    setShowEditor(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File Upload Handler
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setUploadedFileName(file.name);
    try {
      const text = await readFileAsText(file);
      setCvContent(text);
    } catch {
      setCvContent("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // AI-Powered CV Analysis
  const analyzeCV = async () => {
    if (!cvContent.trim()) {
      alert("Please upload or paste your CV content first.");
      return;
    }
    setIsAnalyzing(true);

    setTimeout(() => {
      setCvHealth({
        overall: 74,
        completeness: 80,
        formatting: 70,
        readability: 85,
        skillsScore: 68,
        atsScore: 78,
        keywordDensity: 62,
        experienceImpact: 72,
        personalization: 58,
        history: [58, 64, 70, 74],
        sectionHealth: [
          { section: "Contact Info", score: 90, status: "good" },
          { section: "Summary", score: 75, status: "good" },
          { section: "Experience", score: 68, status: "warning" },
          { section: "Education", score: 88, status: "good" },
          { section: "Skills", score: 62, status: "warning" },
          { section: "Projects", score: 52, status: "poor" },
        ],
        feedback: [
          { type: "success", message: "CV structure is clear and easy to read." },
          { type: "warning", message: "Add measurable achievements with numbers, %, and impact." },
          { type: "warning", message: "Skills section could use more industry keywords." },
          { type: "info", message: "Consider adding a GitHub or portfolio link." },
          { type: "info", message: "Tailor your summary to your target role." },
        ],
        topStrengths: ["Clear structure", "Good education section", "Readable format"],
        topImprovements: ["Add quantified achievements", "Expand skills keywords", "Strengthen project descriptions"],
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const getStatusBadge = (status) => {
    if (status === "good") return { color: "#4caf50", label: "Good" };
    if (status === "warning") return { color: "#ff9800", label: "Needs Work" };
    return { color: "#f44336", label: "Poor" };
  };

  // Cover Letter Generation
  const generateCoverLetter = () => {
    const tones = {
      formal: {
        intro: "I am writing to express my strong interest in the Software Engineering position.",
        body: "With a solid foundation in full-stack development and a proven track record of delivering scalable solutions, I am confident in my ability to contribute meaningfully to your engineering team.",
        close: "I would welcome the opportunity to discuss how my skills align with your team's goals.",
        sign: "Yours sincerely,",
      },
      modern: {
        intro: "I'd love to bring my engineering skills to your team — here's why I think it's a great fit.",
        body: "I've spent the past few years building and shipping full-stack products, from React frontends to Node.js backends. I thrive in collaborative environments and love solving hard problems with clean code.",
        close: "I'd be thrilled to connect and talk about how I can contribute.",
        sign: "Best,",
      },
      creative: {
        intro: "Great products aren't built by algorithms — they're built by passionate engineers. I'm one of them.",
        body: "I combine technical rigor with creative problem-solving to ship features users actually love. My projects have impacted thousands of users, and I'm hungry to do more.",
        close: "Let's build something remarkable together.",
        sign: "Creatively yours,",
      },
      academic: {
        intro: "I am submitting my application with great enthusiasm for the Software Engineering position at your esteemed organization.",
        body: "My academic background in Computer Science, complemented by hands-on research experience in distributed systems, positions me well for this role.",
        close: "I look forward to the possibility of contributing to your research-driven environment.",
        sign: "Respectfully,",
      },
    };

    const t = tones[coverLetterTone];
    setCoverLetter(`Dear Hiring Manager,

${t.intro}

${t.body}

I am enthusiastic about joining a team that values innovation and continuous learning. I am confident that my technical skills, collaborative mindset, and commitment to quality make me a strong candidate for this position.

${t.close}

${t.sign}
[Your Name]`);
  };

  // Export & Sharing
  const exportCV = (format) => {
    alert(`Exporting CV as ${format.toUpperCase()}. In production this would trigger a real download.`);
  };

  const generateShareLink = () => {
    setShareLink(`https://cvmaker.app/shared/${Math.random().toString(36).substr(2, 10)}`);
  };

  // Render Template Card
  const renderTemplateCard = (template) => {
    return (
      <div
        key={template.id}
        data-template-id={template.id}
        className={`cvmaker-template-card ${selectedTemplate === template.id ? "cvmaker-selected" : ""}`}
        onClick={() => setSelectedTemplate(template.id)}
      >
        <div
          className="cvmaker-template-preview"
          style={{ background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)` }}
        >
          <div style={{ fontSize: "44px" }}>{template.icon}</div>
          <div className="cvmaker-ats-badge">ATS {template.atsScore}%</div>
        </div>
        <div className="cvmaker-template-details">
          <div className="cvmaker-template-industry">{template.industry}</div>
          <h4>{template.name}</h4>
          <p>{template.description}</p>
          <div className="cvmaker-template-tags">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="cvmaker-tag">{tag}</span>
            ))}
          </div>
          <button 
            className="cvmaker-explore-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleExploreTemplate(template);
            }}
          >
            ✏️ Edit & Customize CV
          </button>
        </div>
        {selectedTemplate === template.id && (
          <div className="cvmaker-selected-check">✓ Selected</div>
        )}
      </div>
    );
  };

  // Render CV Editor
  const renderCVEditor = () => {
    return (
      <div className="cvmaker-editor-container">
        <div className="cvmaker-editor-header">
          <button className="cvmaker-editor-back-btn" onClick={handleBackFromEditor}>
            ← Back to Templates
          </button>
          <div className="cvmaker-editor-title">
            <input
              type="text"
              value={editingCvName}
              onChange={(e) => setEditingCvName(e.target.value)}
              className="cvmaker-editor-name-input"
            />
            <span className="cvmaker-editor-badge">Curriculum vitae</span>
          </div>
          <div className="cvmaker-editor-actions">
            <button className="cvmaker-editor-save-btn" onClick={handleSaveCV}>
              💾 Save CV
            </button>
          </div>
        </div>

        <div className="cvmaker-editor-content">
          <div className="cvmaker-editor-sidebar">
            <div className="cvmaker-editor-sidebar-header">
              <h3>Personal details</h3>
              <button className="cvmaker-upload-existing-btn">📁 Upload existing CV</button>
            </div>
            
            <div className="cvmaker-editor-form">
              <div className="cvmaker-form-group cvmaker-photo-group">
                <label>Photo</label>
                <div className="cvmaker-photo-upload">
                  {cvFormData.photo ? (
                    <img src={cvFormData.photo} alt="Preview" className="cvmaker-photo-preview" />
                  ) : (
                    <div className="cvmaker-photo-placeholder">📷</div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => {
                    if (e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setCvFormData(prev => ({ ...prev, photo: ev.target.result }));
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                </div>
              </div>

              <div className="cvmaker-form-row">
                <div className="cvmaker-form-group">
                  <label>Given name *</label>
                  <input type="text" name="givenName" value={cvFormData.givenName} onChange={handleFormChange} placeholder="First name" />
                </div>
                <div className="cvmaker-form-group">
                  <label>Family name *</label>
                  <input type="text" name="familyName" value={cvFormData.familyName} onChange={handleFormChange} placeholder="Last name" />
                </div>
              </div>

              <div className="cvmaker-form-group">
                <label>Desired job position</label>
                <input type="text" name="desiredJob" value={cvFormData.desiredJob} onChange={handleFormChange} placeholder="e.g., Software Engineer Intern" />
                <label className="cvmaker-checkbox-label">
                  <input type="checkbox" name="useAsHeadline" checked={cvFormData.useAsHeadline} onChange={handleFormChange} />
                  Use as headline
                </label>
              </div>

              <div className="cvmaker-form-group">
                <label>Email address *</label>
                <input type="email" name="email" value={cvFormData.email} onChange={handleFormChange} placeholder="your.email@example.com" />
              </div>

              <div className="cvmaker-form-group">
                <label>Phone number *</label>
                <input type="tel" name="phone" value={cvFormData.phone} onChange={handleFormChange} placeholder="+1 234 567 8900" />
              </div>

              <div className="cvmaker-form-group">
                <label>Address</label>
                <input type="text" name="address" value={cvFormData.address} onChange={handleFormChange} placeholder="Street address" />
              </div>

              <div className="cvmaker-form-row">
                <div className="cvmaker-form-group">
                  <label>Post code</label>
                  <input type="text" name="postCode" value={cvFormData.postCode} onChange={handleFormChange} placeholder="Postal code" />
                </div>
                <div className="cvmaker-form-group">
                  <label>City</label>
                  <input type="text" name="city" value={cvFormData.city} onChange={handleFormChange} placeholder="City" />
                </div>
              </div>

              <details className="cvmaker-optional-details">
                <summary>+ Additional fields</summary>
                <div className="cvmaker-optional-fields">
                  <div className="cvmaker-form-group">
                    <label>Date of birth</label>
                    <input type="date" name="dateOfBirth" value={cvFormData.dateOfBirth} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Place of birth</label>
                    <input type="text" name="placeOfBirth" value={cvFormData.placeOfBirth} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Driving licence</label>
                    <input type="text" name="drivingLicense" value={cvFormData.drivingLicense} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Gender</label>
                    <input type="text" name="gender" value={cvFormData.gender} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Nationality</label>
                    <input type="text" name="nationality" value={cvFormData.nationality} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Civil status</label>
                    <input type="text" name="civilStatus" value={cvFormData.civilStatus} onChange={handleFormChange} />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Website</label>
                    <input type="url" name="website" value={cvFormData.website} onChange={handleFormChange} placeholder="https://..." />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>LinkedIn</label>
                    <input type="url" name="linkedin" value={cvFormData.linkedin} onChange={handleFormChange} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="cvmaker-form-group">
                    <label>Custom field</label>
                    <input type="text" name="customField" value={cvFormData.customField} onChange={handleFormChange} placeholder="Any additional info" />
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="cvmaker-editor-main">
            <div className="cvmaker-editor-section">
              <h3>Professional Summary</h3>
              <textarea
                className="cvmaker-editor-textarea"
                rows="4"
                value={cvFormData.professionalSummary}
                onChange={(e) => setCvFormData(prev => ({ ...prev, professionalSummary: e.target.value }))}
                placeholder="Write a compelling summary of your professional background and goals..."
              />
            </div>

            <div className="cvmaker-editor-section">
              <h3>Key Skills</h3>
              <textarea
                className="cvmaker-editor-textarea"
                rows="3"
                value={cvFormData.keySkills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="Enter skills separated by commas (e.g., React, Python, Project Management)"
              />
              <div className="cvmaker-skills-tags">
                {cvFormData.keySkills.map((skill, idx) => (
                  <span key={idx} className="cvmaker-skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="cvmaker-editor-section">
              <h3>Experience Highlights</h3>
              <textarea
                className="cvmaker-editor-textarea"
                rows="5"
                value={cvFormData.experienceHighlights.join('\n')}
                onChange={handleExperienceChange}
                placeholder="Enter each achievement on a new line..."
              />
            </div>

            <div className="cvmaker-editor-section">
              <h3>Education</h3>
              <textarea
                className="cvmaker-editor-textarea"
                rows="3"
                value={cvFormData.education}
                onChange={(e) => setCvFormData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Your educational background..."
              />
            </div>

            <div className="cvmaker-editor-section">
              <h3>Projects / Portfolio</h3>
              <textarea
                className="cvmaker-editor-textarea"
                rows="4"
                value={cvFormData.projects.join('\n')}
                onChange={handleProjectsChange}
                placeholder="Enter each project on a new line..."
              />
            </div>

            <div className="cvmaker-editor-preview-tip">
              💡 Tip: Your CV will be ATS-optimized with the information above. Add measurable achievements for better results!
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Feature Panels
  const renderActiveFeature = () => {
    if (showEditor) {
      return renderCVEditor();
    }

    switch (activeFeature) {
      case "templates":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>CV Templates</h3>
              <span className="cvmaker-panel-subtitle">Industry-specific, ATS-optimized designs</span>
            </div>

            <div className="cvmaker-role-filter-container" ref={roleDropdownRef}>
              <div className="cvmaker-role-filter-header">
                <span className="cvmaker-filter-label-role">🎯 Filter by Intern Role:</span>
                <div className="cvmaker-search-dropdown">
                  <div className="cvmaker-search-input-wrapper">
                    <input
                      type="text"
                      className="cvmaker-role-search-input"
                      placeholder="Select an intern role..."
                      value={roleSearchTerm}
                      onChange={(e) => {
                        setRoleSearchTerm(e.target.value);
                        setShowRoleDropdown(true);
                        if (e.target.value === "") {
                          setSelectedRoleId(null);
                        }
                      }}
                      onFocus={() => setShowRoleDropdown(true)}
                    />
                    {roleSearchTerm && (
                      <button 
                        className="cvmaker-clear-filter-btn"
                        onClick={clearRoleFilter}
                      >
                        ✕
                      </button>
                    )}
                    <button 
                      className="cvmaker-dropdown-toggle"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    >
                      ⌵
                    </button>
                  </div>
                  {showRoleDropdown && filteredRoles.length > 0 && (
                    <div className="cvmaker-role-dropdown">
                      {filteredRoles.map((role) => (
                        <div
                          key={role.id}
                          className={`cvmaker-role-option ${selectedRoleId === role.id ? "cvmaker-role-option-selected" : ""}`}
                          onClick={() => handleRoleSelect(role.id)}
                        >
                          <span>{role.label}</span>
                          {selectedRoleId === role.id && <span className="cvmaker-option-check">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {selectedRoleId && (
                <div className="cvmaker-active-filter">
                  <span className="cvmaker-filter-badge">
                    Showing templates for: {internRoles.find(r => r.id === selectedRoleId)?.label}
                    <button className="cvmaker-remove-filter" onClick={clearRoleFilter}>×</button>
                  </span>
                </div>
              )}
            </div>

            <div className="cvmaker-template-filter">
              <span className="cvmaker-filter-label">🎯 Smart Recommendation:</span>
              <span className="cvmaker-filter-tag">{getCurrentRecommendation()}</span>
            </div>

            <div className="cvmaker-ai-info">
              <span className="cvmaker-ai-info-icon">🤖</span>
              <span>Click "Edit & Customize CV" on any card to create a personalized CV</span>
            </div>

            <div className="cvmaker-templates-grid">
              {filteredTemplates.map(template => renderTemplateCard(template))}
            </div>

            <div className="cvmaker-ats-info-box">
              <h4>🤖 ATS-Optimized Templates Include:</h4>
              <div className="cvmaker-ats-features">
                <span>✅ Single-column layout</span>
                <span>✅ Standard headings</span>
                <span>✅ Machine-readable dates</span>
                <span>✅ Keyword-rich summary</span>
                <span>✅ Bullet point consistency</span>
              </div>
            </div>
          </div>
        );

      case "scoring":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Smart CV Scoring</h3>
              <span className="cvmaker-panel-subtitle">AI-powered analysis with real-time feedback</span>
            </div>

            <div className="cvmaker-input-mode-toggle">
              <button
                className={`cvmaker-mode-btn ${inputMode === "upload" ? "cvmaker-mode-active" : ""}`}
                onClick={() => setInputMode("upload")}
              >
                📁 Upload CV File
              </button>
              <button
                className={`cvmaker-mode-btn ${inputMode === "paste" ? "cvmaker-mode-active" : ""}`}
                onClick={() => setInputMode("paste")}
              >
                📝 Paste CV Text
              </button>
            </div>

            {inputMode === "upload" && (
              <div
                className={`cvmaker-upload-dropzone ${dragOver ? "cvmaker-drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div className="cvmaker-upload-icon-large">
                  {uploadedFileName ? "✅" : "📂"}
                </div>
                {uploadedFileName ? (
                  <>
                    <p className="cvmaker-upload-success-text">File loaded: <strong>{uploadedFileName}</strong></p>
                    <p className="cvmaker-upload-hint">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="cvmaker-upload-main-text">Drag & drop your CV here</p>
                    <p className="cvmaker-upload-hint">or click to browse files</p>
                    <div className="cvmaker-upload-formats">
                      <span className="cvmaker-format-badge">PDF</span>
                      <span className="cvmaker-format-badge">DOCX</span>
                      <span className="cvmaker-format-badge">TXT</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {inputMode === "paste" && (
              <textarea
                className="cvmaker-cv-input"
                placeholder="Paste your CV text here to get a detailed AI analysis..."
                value={cvContent}
                onChange={(e) => setCvContent(e.target.value)}
                rows={10}
              />
            )}

            <button
              className={`cvmaker-analyze-btn ${isAnalyzing ? "cvmaker-analyzing" : ""}`}
              onClick={analyzeCV}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <span className="cvmaker-loading-text">
                  <span className="cvmaker-spinner">⚙️</span> Analyzing with AI...
                </span>
              ) : (
                "⚡ Analyze CV with AI"
              )}
            </button>

            {cvHealth && (
              <>
                <div className="cvmaker-score-tabs">
                  {["overview", "sections", "feedback"].map((tab) => (
                    <button
                      key={tab}
                      className={`cvmaker-score-tab ${activeScoreTab === tab ? "cvmaker-score-tab-active" : ""}`}
                      onClick={() => setActiveScoreTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeScoreTab === "overview" && (
                  <>
                    <div className="cvmaker-overall-score">
                      <div
                        className="cvmaker-score-ring"
                        style={{ "--score-color": getScoreColor(cvHealth.overall) }}
                      >
                        <span className="cvmaker-score-number">{cvHealth.overall}</span>
                        <span className="cvmaker-score-label">Overall</span>
                      </div>
                      <div className="cvmaker-score-summary">
                        <div className="cvmaker-strengths-box">
                          <h5>💪 Top Strengths</h5>
                          {cvHealth.topStrengths.map((s, i) => (
                            <div key={i} className="cvmaker-strength-item">✅ {s}</div>
                          ))}
                        </div>
                        <div className="cvmaker-improvements-box">
                          <h5>🎯 Top Improvements</h5>
                          {cvHealth.topImprovements.map((s, i) => (
                            <div key={i} className="cvmaker-improvement-item">⚡ {s}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="cvmaker-score-cards">
                      {[
                        { label: "Completeness", value: cvHealth.completeness },
                        { label: "Formatting", value: cvHealth.formatting },
                        { label: "Readability", value: cvHealth.readability },
                        { label: "Skills Match", value: cvHealth.skillsScore },
                        { label: "ATS Score", value: cvHealth.atsScore },
                        { label: "Keyword Density", value: cvHealth.keywordDensity },
                        { label: "Exp. Impact", value: cvHealth.experienceImpact },
                        { label: "Personalization", value: cvHealth.personalization },
                      ].map(({ label, value }) => (
                        <div className="cvmaker-score-card" key={label}>
                          <div className="cvmaker-score-bar-outer">
                            <div
                              className="cvmaker-score-bar-inner"
                              style={{ width: `${value}%`, background: getScoreColor(value) }}
                            />
                          </div>
                          <div className="cvmaker-score-card-footer">
                            <span className="cvmaker-score-card-label">{label}</span>
                            <span
                              className="cvmaker-score-card-value"
                              style={{ color: getScoreColor(value) }}
                            >
                              {value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeScoreTab === "sections" && (
                  <div className="cvmaker-section-health">
                    <h4>Section-wise Health Meter</h4>
                    {cvHealth.sectionHealth.map(({ section, score, status }) => {
                      const badge = getStatusBadge(status);
                      return (
                        <div className="cvmaker-section-row" key={section}>
                          <span className="cvmaker-section-name">{section}</span>
                          <div className="cvmaker-section-bar-outer">
                            <div
                              className="cvmaker-section-bar-inner"
                              style={{ width: `${score}%`, background: badge.color }}
                            />
                          </div>
                          <span className="cvmaker-section-score">{score}%</span>
                          <span
                            className="cvmaker-section-badge"
                            style={{ color: badge.color, borderColor: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeScoreTab === "feedback" && (
                  <div className="cvmaker-feedback-list">
                    {cvHealth.feedback.map((item, i) => (
                      <div key={i} className={`cvmaker-feedback-item cvmaker-feedback-${item.type}`}>
                        <span className="cvmaker-feedback-icon">
                          {item.type === "success" ? "✅" : item.type === "warning" ? "⚠️" : "💡"}
                        </span>
                        <span>{item.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case "coverletter":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Cover Letter Generator</h3>
              <span className="cvmaker-panel-subtitle">Dynamic structure with tone selection</span>
            </div>

            <div className="cvmaker-tone-selector">
              <label>Select Tone:</label>
              <div className="cvmaker-tone-options">
                {[
                  { id: "formal", label: "Formal", icon: "🏢" },
                  { id: "modern", label: "Modern", icon: "🚀" },
                  { id: "creative", label: "Creative", icon: "🎨" },
                  { id: "academic", label: "Academic", icon: "🎓" },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    className={`cvmaker-tone-btn ${coverLetterTone === tone.id ? "cvmaker-tone-active" : ""}`}
                    onClick={() => setCoverLetterTone(tone.id)}
                  >
                    {tone.icon} {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="cvmaker-analyze-btn" onClick={generateCoverLetter}>
              ✉️ Generate Cover Letter
            </button>

            {coverLetter && (
              <>
                <textarea
                  className="cvmaker-cover-letter-textarea"
                  rows="18"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <div className="cvmaker-cl-actions">
                  <button
                    className="cvmaker-cl-action-btn"
                    onClick={() => navigator.clipboard.writeText(coverLetter)}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="cvmaker-cl-action-btn"
                    onClick={() => exportCV("cover-letter-pdf")}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case "export":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header">
              <h3>Export & Sharing</h3>
              <span className="cvmaker-panel-subtitle">Multi-format export · Shareable links</span>
            </div>

            <div className="cvmaker-export-section">
              <h4>📤 Multi-Format Export</h4>
              <div className="cvmaker-export-options">
                <button className="cvmaker-export-btn" onClick={() => exportCV("ats-pdf")}>
                  <span className="cvmaker-export-icon">📄</span>
                  <span className="cvmaker-export-name">ATS-Optimized PDF</span>
                  <span className="cvmaker-export-desc">Best for job applications</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("styled-pdf")}>
                  <span className="cvmaker-export-icon">🎨</span>
                  <span className="cvmaker-export-name">Styled PDF</span>
                  <span className="cvmaker-export-desc">Custom visual design</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("docx")}>
                  <span className="cvmaker-export-icon">📝</span>
                  <span className="cvmaker-export-name">Word DOCX</span>
                  <span className="cvmaker-export-desc">Editable document</span>
                </button>
                <button className="cvmaker-export-btn" onClick={() => exportCV("txt")}>
                  <span className="cvmaker-export-icon">📃</span>
                  <span className="cvmaker-export-name">Plain Text</span>
                  <span className="cvmaker-export-desc">ATS-safe, no formatting</span>
                </button>
              </div>
            </div>

            <div className="cvmaker-share-section">
              <h4>🔗 Sharing System</h4>
              <div className="cvmaker-share-options">
                <button className="cvmaker-share-btn" onClick={generateShareLink}>
                  🔗 Generate Shareable Link
                </button>
                <button className="cvmaker-share-btn" onClick={() => alert("QR Code generated!")}>
                  📱 Generate QR Code
                </button>
                <button className="cvmaker-share-btn" onClick={() => alert("Email sharing opened!")}>
                  📧 Share via Email
                </button>
              </div>
              {shareLink && (
                <div className="cvmaker-share-link-box">
                  <input className="cvmaker-share-link-input" readOnly value={shareLink} />
                  <button
                    className="cvmaker-copy-btn"
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a feature</div>;
    }
  };

  const features = [
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "⭐", label: "Smart Scoring" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "export", icon: "📤", label: "Export & Share" },
  ];

  return (
    <div className="cvmaker-dashboard">
      <div className="cvmaker-sidebar">
        <div className="cvmaker-sidebar-brand">
          <span className="cvmaker-sidebar-logo">📄</span>
          <h2>CV Maker</h2>
        </div>

        <nav className="cvmaker-nav">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`cvmaker-sidebar-feature ${activeFeature === feature.id ? "cvmaker-active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="cvmaker-nav-icon">{feature.icon}</span>
              <span>{feature.label}</span>
            </button>
          ))}
        </nav>

        <button className="cvmaker-back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="cvmaker-content">
        <div className="cvmaker-feature-container">
          {renderActiveFeature()}
        </div>
      </div>
    </div>
  );
};

export default CVMaker;