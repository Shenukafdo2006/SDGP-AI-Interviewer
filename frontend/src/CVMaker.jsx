import React, { useState, useRef, useEffect } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvContent, setCvContent] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterTone, setCoverLetterTone] = useState("formal");
  const [shareLink, setShareLink] = useState("");
  const [activeScoreTab, setActiveScoreTab] = useState("overview");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeFormattingTab, setActiveFormattingTab] = useState("write");
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  
  // Design customization states
  const [designSettings, setDesignSettings] = useState({
    fontFamily: "Inter",
    fontSize: "medium",
    primaryColor: "#4f46e5",
    layout: "modern",
    spacing: "normal"
  });

  // State for the CV Editor (Edit Mode)
  const [showEditor, setShowEditor] = useState(false);
  const [editingCvName, setEditingCvName] = useState("Untitled CV");

  // Education entries
  const [educationEntries, setEducationEntries] = useState([
    { school: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false, description: "" }
  ]);

  // Employment entries
  const [employmentEntries, setEmploymentEntries] = useState([
    { jobTitle: "", company: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false, description: "" }
  ]);

  // Skills with levels
  const [skillsEntries, setSkillsEntries] = useState([
    { skill: "", level: "" }
  ]);

  // Languages with levels
  const [languagesEntries, setLanguagesEntries] = useState([
    { language: "", level: "" }
  ]);

  // Additional sections
  const [additionalSections, setAdditionalSections] = useState({
    profile: "",
    courses: [],
    internships: [],
    extracurricular: [],
    references: [],
    qualities: [],
    certificates: [],
    achievements: [],
    signature: "",
    footer: "",
    customSections: []
  });

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
        summary: "Passionate Intern software engineer with strong problem-solving skills. Eager to contribute to innovative projects and grow within a dynamic team environment.",
        skills: ["JavaScript", "React.js", "Node.js", "Python", "SQL", "Git", "REST APIs", "Agile Methodology"],
        education: "Bachelor of Software Engineering | University of Technology | 2024 - Present | GPA: 3.8/4.0",
        experience: [
          "• Developed and deployed 5+ full-stack applications using React and Node.js",
          "• Improved application performance by 35% through code optimization",
          "• Collaborated with cross-functional teams to deliver features on schedule"
        ],
        projects: [
          "E-Commerce Platform: Built a full-stack e-commerce site with React, Node.js, and MongoDB",
          "Task Management App: Developed a task management tool with real-time updates using WebSockets"
        ]
      },
      "intern-web-developer": {
        summary: "Creative web developer specializing in responsive design and modern frontend frameworks. Passionate about creating seamless user experiences and optimizing web performance.",
        skills: ["HTML5/CSS3", "JavaScript/ES6", "React.js", "Vue.js", "Tailwind CSS", "WordPress", "Web Performance", "SEO"],
        education: "Bachelor of Computer Science | University of Technology | 2023-2027",
        experience: [
          "• Built 10+ responsive websites with 98% Lighthouse scores",
          "• Implemented SEO strategies increasing organic traffic by 45%",
          "• Created reusable component libraries reducing development time by 30%"
        ],
        projects: [
          "Portfolio Website: Designed and developed a responsive portfolio with 99% accessibility score",
          "E-Learning Platform: Created an interactive learning platform with video integration"
        ]
      },
      "intern-ui-ux-designer": {
        summary: "User-centered designer focused on creating intuitive and beautiful digital experiences. Skilled in translating user research into actionable design solutions that drive engagement.",
        skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Interaction Design"],
        education: "Bachelor of Design in Interaction Design | Design Institute | 2021-2025",
        experience: [
          "• Redesigned mobile app resulting in 40% increase in user engagement",
          "• Conducted 25+ user interviews to inform design decisions",
          "• Created comprehensive design system used by 3 product teams"
        ],
        projects: [
          "Mobile Banking App: Designed end-to-end user flows for a banking app",
          "Healthcare Dashboard: Created an accessible dashboard for medical professionals"
        ]
      },
      "intern-project-manager": {
        summary: "Results-driven project manager skilled in leading cross-functional teams and delivering projects on time and within budget. Adept at stakeholder management and agile methodologies.",
        skills: ["Agile/Scrum", "JIRA", "Stakeholder Management", "Risk Assessment", "Budget Planning", "Team Leadership", "Communication", "Strategic Planning"],
        education: "Bachelor of Business Administration | Business School | 2023-2027",
        experience: [
          "• Managed 5 projects simultaneously with 95% on-time delivery rate",
          "• Reduced project costs by 20% through efficient resource allocation",
          "• Implemented agile practices increasing team velocity by 40%"
        ],
        projects: [
          "Digital Transformation: Led a 6-month project to migrate legacy systems",
          "Product Launch: Coordinated cross-functional launch of 3 new features"
        ]
      },
      "intern-data-scientist": {
        summary: "Data scientist with strong analytical skills and experience in machine learning and statistical analysis. Passionate about extracting actionable insights from complex datasets.",
        skills: ["Python", "SQL", "Machine Learning", "TensorFlow", "Data Visualization", "Statistical Analysis", "Pandas", "Tableau"],
        education: "Bachelor of Data Science | University of Technology | 2022-2026",
        experience: [
          "• Built predictive models achieving 92% accuracy",
          "• Analyzed 1M+ records to identify key business insights",
          "• Created interactive dashboards reducing reporting time by 60%"
        ],
        projects: [
          "Customer Segmentation: Implemented K-means clustering to segment 500K customers",
          "Stock Price Prediction: Developed LSTM model achieving 88% accuracy"
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

  // Education handlers
  const addEducation = () => {
    setEducationEntries([...educationEntries, { school: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false, description: "" }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...educationEntries];
    updated[index][field] = value;
    setEducationEntries(updated);
  };

  const removeEducation = (index) => {
    setEducationEntries(educationEntries.filter((_, i) => i !== index));
  };

  // Employment handlers
  const addEmployment = () => {
    setEmploymentEntries([...employmentEntries, { jobTitle: "", company: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false, description: "" }]);
  };

  const updateEmployment = (index, field, value) => {
    const updated = [...employmentEntries];
    updated[index][field] = value;
    setEmploymentEntries(updated);
  };

  const removeEmployment = (index) => {
    setEmploymentEntries(employmentEntries.filter((_, i) => i !== index));
  };

  // Skills handlers
  const addSkill = () => {
    setSkillsEntries([...skillsEntries, { skill: "", level: "" }]);
  };

  const updateSkill = (index, field, value) => {
    const updated = [...skillsEntries];
    updated[index][field] = value;
    setSkillsEntries(updated);
  };

  const removeSkill = (index) => {
    setSkillsEntries(skillsEntries.filter((_, i) => i !== index));
  };

  // Languages handlers
  const addLanguage = () => {
    setLanguagesEntries([...languagesEntries, { language: "", level: "" }]);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languagesEntries];
    updated[index][field] = value;
    setLanguagesEntries(updated);
  };

  const removeLanguage = (index) => {
    setLanguagesEntries(languagesEntries.filter((_, i) => i !== index));
  };

  // Additional sections handlers
  const addToArray = (section, value) => {
    setAdditionalSections(prev => ({
      ...prev,
      [section]: [...prev[section], value]
    }));
  };

  const updateArrayItem = (section, index, value) => {
    setAdditionalSections(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (section, index) => {
    setAdditionalSections(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Save CV
  const handleSaveCV = () => {
    alert(`CV "${editingCvName}" saved successfully!`);
    setShowEditor(false);
  };

  // Rich text formatting functions
  const applyFormatting = (type) => {
    const textarea = document.querySelector('.cvmaker-preview-content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = cvFormData.professionalSummary.substring(start, end);
    
    if (selected) {
      let formatted = selected;
      if (type === 'bold') formatted = `<strong>${selected}</strong>`;
      if (type === 'italic') formatted = `<em>${selected}</em>`;
      if (type === 'underline') formatted = `<u>${selected}</u>`;
      
      const newText = cvFormData.professionalSummary.substring(0, start) + formatted + cvFormData.professionalSummary.substring(end);
      setCvFormData(prev => ({ ...prev, professionalSummary: newText }));
    }
  };

  // Apply font size class
  const getFontSizeClass = () => {
    switch(designSettings.fontSize) {
      case "small": return "cvmaker-font-small";
      case "large": return "cvmaker-font-large";
      default: return "cvmaker-font-medium";
    }
  };

  // Apply spacing class
  const getSpacingClass = () => {
    switch(designSettings.spacing) {
      case "compact": return "cvmaker-spacing-compact";
      case "loose": return "cvmaker-spacing-loose";
      default: return "cvmaker-spacing-normal";
    }
  };

  // Generate formatted CV HTML for preview and download with design settings
  const generateCVHTML = () => {
    const fullName = `${cvFormData.givenName} ${cvFormData.familyName}`.trim() || "Your Name";
    const headline = cvFormData.useAsHeadline && cvFormData.desiredJob ? cvFormData.desiredJob : "";
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Generate education HTML
    const educationHTML = educationEntries.filter(e => e.school).map(edu => `
      <div class="cv-education-item">
        <div class="cv-education-title"><strong>${edu.school}</strong> ${edu.city ? `| ${edu.city}` : ''}</div>
        <div class="cv-education-date">${edu.startMonth ? `${edu.startMonth} ` : ''}${edu.startYear} - ${edu.present ? 'Present' : `${edu.endMonth ? `${edu.endMonth} ` : ''}${edu.endYear}`}</div>
        <div class="cv-education-description">${edu.description}</div>
      </div>
    `).join('');
    
    // Generate employment HTML
    const employmentHTML = employmentEntries.filter(e => e.jobTitle).map(emp => `
      <div class="cv-employment-item">
        <div class="cv-employment-title"><strong>${emp.jobTitle}</strong> at ${emp.company} ${emp.city ? `| ${emp.city}` : ''}</div>
        <div class="cv-employment-date">${emp.startMonth ? `${emp.startMonth} ` : ''}${emp.startYear} - ${emp.present ? 'Present' : `${emp.endMonth ? `${emp.endMonth} ` : ''}${emp.endYear}`}</div>
        <div class="cv-employment-description">${emp.description}</div>
      </div>
    `).join('');
    
    // Generate skills HTML
    const skillsHTML = skillsEntries.filter(s => s.skill).map(skill => `
      <div class="cv-skill-item">
        <span class="cv-skill-name">${skill.skill}</span>
        ${skill.level ? `<span class="cv-skill-level">(${skill.level})</span>` : ''}
      </div>
    `).join('');
    
    // Generate languages HTML
    const languagesHTML = languagesEntries.filter(l => l.language).map(lang => `
      <div class="cv-language-item">
        <span class="cv-language-name">${lang.language}</span>
        ${lang.level ? `<span class="cv-language-level">(${lang.level})</span>` : ''}
      </div>
    `).join('');
    
    // Generate additional sections HTML
    const profileHTML = additionalSections.profile ? `<div class="cv-section"><div class="cv-section-title">Profile</div><div class="cv-summary-text">${additionalSections.profile}</div></div>` : '';
    const coursesHTML = additionalSections.courses.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Courses</div><ul>${additionalSections.courses.map(c => `<li>${c}</li>`).join('')}</ul></div>` : '';
    const internshipsHTML = additionalSections.internships.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Internships</div><ul>${additionalSections.internships.map(i => `<li>${i}</li>`).join('')}</ul></div>` : '';
    const extracurricularHTML = additionalSections.extracurricular.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Extracurricular Activities</div><ul>${additionalSections.extracurricular.map(e => `<li>${e}</li>`).join('')}</ul></div>` : '';
    const referencesHTML = additionalSections.references.length > 0 ? `<div class="cv-section"><div class="cv-section-title">References</div><ul>${additionalSections.references.map(r => `<li>${r}</li>`).join('')}</ul></div>` : '';
    const qualitiesHTML = additionalSections.qualities.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Qualities</div><ul>${additionalSections.qualities.map(q => `<li>${q}</li>`).join('')}</ul></div>` : '';
    const certificatesHTML = additionalSections.certificates.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Certificates</div><ul>${additionalSections.certificates.map(c => `<li>${c}</li>`).join('')}</ul></div>` : '';
    const achievementsHTML = additionalSections.achievements.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Achievements</div><ul>${additionalSections.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : '';
    const signatureHTML = additionalSections.signature ? `<div class="cv-section"><div class="cv-section-title">Signature</div><div class="cv-summary-text">${additionalSections.signature}</div></div>` : '';
    const footerHTML = additionalSections.footer ? `<div class="cv-footer">${additionalSections.footer}</div>` : '';
    
    // Layout styles based on design settings
    const layoutStyles = designSettings.layout === "minimal" ? `
      .cv-header { background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); }
      .cv-section-title { color: ${designSettings.primaryColor}; }
      .cv-skill-badge { background: ${designSettings.primaryColor}; }
    ` : designSettings.layout === "creative" ? `
      .cv-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0 0 50px 50px; }
      .cv-section-title { color: ${designSettings.primaryColor}; border-bottom: 3px solid ${designSettings.primaryColor}; }
      .cv-skill-badge { background: linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}cc); }
    ` : `
      .cv-header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
      .cv-section-title { color: ${designSettings.primaryColor}; }
      .cv-skill-badge { background: linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}dd); }
    `;
    
    // Font size styles
    const fontSizeStyles = designSettings.fontSize === "small" ? `
      body { font-size: 12px; }
      .cv-name-section h1 { font-size: 1.8rem; }
      .cv-section-title { font-size: 0.9rem; }
    ` : designSettings.fontSize === "large" ? `
      body { font-size: 16px; }
      .cv-name-section h1 { font-size: 2.8rem; }
      .cv-section-title { font-size: 1.1rem; }
    ` : `
      body { font-size: 14px; }
      .cv-name-section h1 { font-size: 2.2rem; }
      .cv-section-title { font-size: 1rem; }
    `;
    
    // Spacing styles
    const spacingStyles = designSettings.spacing === "compact" ? `
      .cv-section { margin-bottom: 20px; }
      .cv-body { padding: 25px; gap: 25px; }
      .cv-header { padding: 25px; }
      .cv-contact-bar { padding: 12px 25px; }
    ` : designSettings.spacing === "loose" ? `
      .cv-section { margin-bottom: 40px; }
      .cv-body { padding: 50px; gap: 50px; }
      .cv-header { padding: 50px; }
      .cv-contact-bar { padding: 20px 50px; }
    ` : `
      .cv-section { margin-bottom: 30px; }
      .cv-body { padding: 40px; gap: 40px; }
      .cv-header { padding: 40px; }
      .cv-contact-bar { padding: 16px 40px; }
    `;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${editingCvName} - CV</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: '${designSettings.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            padding: 40px;
          }
          .cv-container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
          .cv-header { padding: 40px; color: white; }
          .cv-header-content { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
          .cv-avatar { width: 120px; height: 120px; background: linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}cc); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 600; color: white; }
          .cv-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
          .cv-name-section h1 { font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; }
          .cv-name-section .headline { font-size: 1rem; opacity: 0.8; color: #cbd5e1; }
          .cv-contact-bar { background: #f1f5f9; display: flex; flex-wrap: wrap; gap: 24px; border-bottom: 1px solid #e2e8f0; }
          .cv-contact-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #334155; }
          .cv-body { display: grid; grid-template-columns: 1fr 2fr; }
          .cv-left { border-right: 2px solid #e2e8f0; padding-right: 30px; }
          .cv-right { padding-left: 10px; }
          .cv-section { margin-bottom: 32px; }
          .cv-section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
          .cv-skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .cv-skill-badge { color: white; padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; }
          .cv-skill-item, .cv-language-item { margin-bottom: 8px; }
          .cv-skill-name, .cv-language-name { font-weight: 600; color: #1e293b; }
          .cv-skill-level, .cv-language-level { color: #64748b; font-size: 0.8rem; margin-left: 8px; }
          .cv-info-item { margin-bottom: 12px; }
          .cv-info-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
          .cv-info-value { font-size: 0.9rem; color: #1e293b; }
          .cv-summary-text { color: #334155; line-height: 1.6; font-size: 0.9rem; }
          .cv-education-item, .cv-employment-item { margin-bottom: 20px; }
          .cv-education-title, .cv-employment-title { font-weight: 600; color: #1e293b; margin-bottom: 4px; }
          .cv-education-date, .cv-employment-date { font-size: 0.8rem; color: #64748b; margin-bottom: 8px; }
          .cv-education-description, .cv-employment-description { color: #334155; font-size: 0.85rem; line-height: 1.5; }
          .cv-footer { text-align: center; padding: 20px; background: #f1f5f9; font-size: 0.8rem; color: #64748b; }
          ${layoutStyles}
          ${fontSizeStyles}
          ${spacingStyles}
          @media print {
            body { padding: 0; background: white; }
            .cv-container { box-shadow: none; border-radius: 0; }
            .cv-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          @media (max-width: 768px) {
            body { padding: 20px; }
            .cv-body { grid-template-columns: 1fr; gap: 20px; }
            .cv-left { border-right: none; padding-right: 0; }
            .cv-right { padding-left: 0; }
            .cv-header-content { flex-direction: column; text-align: center; }
            .cv-contact-bar { flex-direction: column; gap: 10px; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=${designSettings.fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="cv-container">
          <div class="cv-header">
            <div class="cv-header-content">
              <div class="cv-avatar">${cvFormData.photo ? `<img src="${cvFormData.photo}" alt="Profile">` : initials}</div>
              <div class="cv-name-section"><h1>${fullName}</h1>${headline ? `<div class="headline">${headline}</div>` : ''}</div>
            </div>
          </div>
          <div class="cv-contact-bar">
            ${cvFormData.email ? `<div class="cv-contact-item">📧 ${cvFormData.email}</div>` : ''}
            ${cvFormData.phone ? `<div class="cv-contact-item">📱 ${cvFormData.phone}</div>` : ''}
            ${cvFormData.address ? `<div class="cv-contact-item">📍 ${cvFormData.address}${cvFormData.city ? `, ${cvFormData.city}` : ''}</div>` : ''}
            ${cvFormData.website ? `<div class="cv-contact-item">🌐 ${cvFormData.website}</div>` : ''}
            ${cvFormData.linkedin ? `<div class="cv-contact-item">🔗 ${cvFormData.linkedin}</div>` : ''}
          </div>
          <div class="cv-body">
            <div class="cv-left">
              ${cvFormData.keySkills.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Technical Skills</div><div class="cv-skills-list">${cvFormData.keySkills.map(s => `<span class="cv-skill-badge">${s}</span>`).join('')}</div></div>` : ''}
              ${skillsHTML ? `<div class="cv-section"><div class="cv-section-title">Skills</div>${skillsHTML}</div>` : ''}
              ${languagesHTML ? `<div class="cv-section"><div class="cv-section-title">Languages</div>${languagesHTML}</div>` : ''}
              <div class="cv-section"><div class="cv-section-title">Personal Details</div>
                ${cvFormData.dateOfBirth ? `<div class="cv-info-item"><div class="cv-info-label">Date of Birth</div><div class="cv-info-value">${cvFormData.dateOfBirth}</div></div>` : ''}
                ${cvFormData.nationality ? `<div class="cv-info-item"><div class="cv-info-label">Nationality</div><div class="cv-info-value">${cvFormData.nationality}</div></div>` : ''}
                ${cvFormData.drivingLicense ? `<div class="cv-info-item"><div class="cv-info-label">Driving License</div><div class="cv-info-value">${cvFormData.drivingLicense}</div></div>` : ''}
              </div>
              ${profileHTML}${coursesHTML}${internshipsHTML}${extracurricularHTML}${referencesHTML}${qualitiesHTML}${certificatesHTML}${achievementsHTML}
            </div>
            <div class="cv-right">
              ${cvFormData.professionalSummary ? `<div class="cv-section"><div class="cv-section-title">Professional Summary</div><div class="cv-summary-text">${cvFormData.professionalSummary}</div></div>` : ''}
              ${educationHTML ? `<div class="cv-section"><div class="cv-section-title">Education</div>${educationHTML}</div>` : ''}
              ${employmentHTML ? `<div class="cv-section"><div class="cv-section-title">Employment</div>${employmentHTML}</div>` : ''}
              ${cvFormData.experienceHighlights.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Experience Highlights</div>${cvFormData.experienceHighlights.map(exp => `<div class="cv-experience-text">${exp}</div>`).join('')}</div>` : ''}
              ${cvFormData.projects.length > 0 ? `<div class="cv-section"><div class="cv-section-title">Projects</div>${cvFormData.projects.map(p => `<div class="cv-project-text">${p}</div>`).join('')}</div>` : ''}
              ${signatureHTML}
            </div>
          </div>
          ${footerHTML}
        </div>
      </body>
      </html>
    `;
  };

  // Download as PDF
  const downloadAsPDF = () => {
    setIsDownloading(true);
    const cvHTML = generateCVHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>${editingCvName} - CV</title>
      <style>@media print{body{margin:0;padding:0;}.no-print{display:none;}}</style></head>
      <body>${cvHTML}<div class="no-print" style="position:fixed;bottom:20px;right:20px;background:#4f46e5;color:white;padding:10px 20px;border-radius:8px;">Press Ctrl+P to save as PDF</div>
      <script>setTimeout(()=>{window.print();setTimeout(()=>window.close(),1000);},500);<\/script></body></html>
    `);
    printWindow.document.close();
    setTimeout(() => setIsDownloading(false), 2000);
  };

  // Download as DOCX
  const downloadAsDOCX = () => {
    setIsDownloading(true);
    const cvHTML = generateCVHTML();
    const blob = new Blob([cvHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editingCvName.replace(/\s+/g, '_')}_CV.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  // Close dropdown
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
  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });

  const handleFileSelect = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setUploadedFileName(file.name);
    try {
      const text = await readFileAsText(file);
      setCvContent(text);
    } catch { setCvContent(""); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // AI-Powered CV Analysis - Empty function
  const analyzeCV = async () => {
    if (!cvContent.trim()) {
      alert("Please upload or paste your CV content first.");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
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
        sign: "Yours sincerely," 
      },
      academic: { 
        intro: "I am submitting my application with great enthusiasm for the Software Engineering position at your esteemed organization.", 
        body: "My academic background in Computer Science, complemented by hands-on research experience in distributed systems, positions me well for this role. I have contributed to open-source projects and published research in performance optimization.", 
        close: "I look forward to the possibility of contributing to your research-driven environment.", 
        sign: "Respectfully," 
      },
    };
    const t = tones[coverLetterTone];
    setCoverLetter(`Dear Hiring Manager,\n\n${t.intro}\n\n${t.body}\n\nI am enthusiastic about joining a team that values innovation and continuous learning. I am confident that my technical skills, collaborative mindset, and commitment to quality make me a strong candidate for this position.\n\n${t.close}\n\n${t.sign}\n[Your Name]`);
  };

  const exportCV = (format) => alert(`Exporting CV as ${format.toUpperCase()}`);
  const generateShareLink = () => setShareLink(`https://cvmaker.app/shared/${Math.random().toString(36).substr(2, 10)}`);

  // Render Template Card
  const renderTemplateCard = (template) => (
    <div key={template.id} className={`cvmaker-template-card ${selectedTemplate === template.id ? "cvmaker-selected" : ""}`} onClick={() => setSelectedTemplate(template.id)}>
      <div className="cvmaker-template-preview" style={{ background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)` }}>
        <div style={{ fontSize: "44px" }}>{template.icon}</div>
        <div className="cvmaker-ats-badge">ATS {template.atsScore}%</div>
      </div>
      <div className="cvmaker-template-details">
        <div className="cvmaker-template-industry">{template.industry}</div>
        <h4>{template.name}</h4>
        <p>{template.description}</p>
        <div className="cvmaker-template-tags">{template.tags.slice(0, 3).map(tag => <span key={tag} className="cvmaker-tag">{tag}</span>)}</div>
        <button className="cvmaker-explore-btn" onClick={(e) => { e.stopPropagation(); handleExploreTemplate(template); }}>✏️ Edit & Customize CV</button>
      </div>
      {selectedTemplate === template.id && <div className="cvmaker-selected-check">✓ Selected</div>}
    </div>
  );

  // Render Design Panel
  const renderDesignPanel = () => {
    const fonts = ["Inter", "Arial", "Helvetica", "Georgia", "Times New Roman", "Roboto", "Open Sans"];
    const fontSizes = [
      { value: "small", label: "Small", icon: "A⁻" },
      { value: "medium", label: "Medium", icon: "A" },
      { value: "large", label: "Large", icon: "A⁺" }
    ];
    const layouts = [
      { value: "modern", label: "Modern", icon: "✨" },
      { value: "minimal", label: "Minimal", icon: "○" },
      { value: "creative", label: "Creative", icon: "🎨" }
    ];
    const spacings = [
      { value: "compact", label: "Compact", icon: "▯" },
      { value: "normal", label: "Normal", icon: "□" },
      { value: "loose", label: "Loose", icon: "▢" }
    ];

    return (
      <div className="cvmaker-design-panel">
        <div className="cvmaker-design-section">
          <h4>Typography</h4>
          <div className="cvmaker-design-group">
            <label>Font Family</label>
            <select 
              value={designSettings.fontFamily} 
              onChange={(e) => setDesignSettings({...designSettings, fontFamily: e.target.value})}
              className="cvmaker-design-select"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div className="cvmaker-design-group">
            <label>Font Size</label>
            <div className="cvmaker-design-buttons">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  className={`cvmaker-design-btn ${designSettings.fontSize === size.value ? "active" : ""}`}
                  onClick={() => setDesignSettings({...designSettings, fontSize: size.value})}
                >
                  <span className="cvmaker-design-btn-icon">{size.icon}</span>
                  <span>{size.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cvmaker-design-section">
          <h4>Colors</h4>
          <div className="cvmaker-design-group">
            <label>Primary Color</label>
            <div className="cvmaker-color-picker">
              <input
                type="color"
                value={designSettings.primaryColor}
                onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                className="cvmaker-color-input"
              />
              <span className="cvmaker-color-value">{designSettings.primaryColor}</span>
            </div>
          </div>
        </div>

        <div className="cvmaker-design-section">
          <h4>Layout</h4>
          <div className="cvmaker-design-group">
            <label>Style</label>
            <div className="cvmaker-design-buttons">
              {layouts.map(layout => (
                <button
                  key={layout.value}
                  className={`cvmaker-design-btn ${designSettings.layout === layout.value ? "active" : ""}`}
                  onClick={() => setDesignSettings({...designSettings, layout: layout.value})}
                >
                  <span className="cvmaker-design-btn-icon">{layout.icon}</span>
                  <span>{layout.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="cvmaker-design-group">
            <label>Spacing</label>
            <div className="cvmaker-design-buttons">
              {spacings.map(spacing => (
                <button
                  key={spacing.value}
                  className={`cvmaker-design-btn ${designSettings.spacing === spacing.value ? "active" : ""}`}
                  onClick={() => setDesignSettings({...designSettings, spacing: spacing.value})}
                >
                  <span className="cvmaker-design-btn-icon">{spacing.icon}</span>
                  <span>{spacing.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cvmaker-design-preview">
          <h4>Live Preview</h4>
          <div className="cvmaker-design-preview-card" style={{ fontFamily: designSettings.fontFamily }}>
            <div className="cvmaker-preview-name" style={{ color: designSettings.primaryColor }}>
              {cvFormData.givenName || "John"} {cvFormData.familyName || "Doe"}
            </div>
            <div className="cvmaker-preview-title">{cvFormData.desiredJob || "Software Engineer"}</div>
            <div className="cvmaker-preview-badge" style={{ background: designSettings.primaryColor }}>
              Sample Text
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render CV Editor (Full editor with all sections)
  const renderCVEditor = () => {
    const sections = [
      { id: "personal", label: "Personal Details", icon: "👤" },
      { id: "education", label: "Education", icon: "🎓" },
      { id: "employment", label: "Employment", icon: "💼" },
      { id: "skills", label: "Skills", icon: "⚡" },
      { id: "languages", label: "Languages", icon: "🌐" },
      { id: "additional", label: "Additional Sections", icon: "📎" },
    ];

    return (
      <div className="cvmaker-editor-container">
        <div className="cvmaker-editor-header">
          <button className="cvmaker-editor-back-btn" onClick={handleBackFromEditor}>← Back to Templates</button>
          <div className="cvmaker-editor-title">
            <input type="text" value={editingCvName} onChange={(e) => setEditingCvName(e.target.value)} className="cvmaker-editor-name-input" />
            <span className="cvmaker-editor-badge cvmaker-clickable-badge" onClick={() => setShowPreviewModal(true)}>Curriculum vitae</span>
          </div>
          <div className="cvmaker-editor-actions">
            <button className="cvmaker-editor-save-btn" onClick={handleSaveCV}>💾 Save CV</button>
          </div>
        </div>

        <div className="cvmaker-editor-toolbar">
          <div className="cvmaker-toolbar-tabs">
            <button className={`cvmaker-toolbar-tab ${activeFormattingTab === "write" ? "active" : ""}`} onClick={() => setActiveFormattingTab("write")}>Write</button>
            <button className={`cvmaker-toolbar-tab ${activeFormattingTab === "design" ? "active" : ""}`} onClick={() => setActiveFormattingTab("design")}>Design</button>
            <button className={`cvmaker-toolbar-tab ${activeFormattingTab === "preview" ? "active" : ""}`} onClick={() => setActiveFormattingTab("preview")}>Preview</button>
          </div>
          {activeFormattingTab === "write" && (
            <div className="cvmaker-formatting-tools">
              <button className="cvmaker-format-btn" onClick={() => applyFormatting('bold')}><strong>B</strong></button>
              <button className="cvmaker-format-btn" onClick={() => applyFormatting('italic')}><em>I</em></button>
              <button className="cvmaker-format-btn" onClick={() => applyFormatting('underline')}><u>U</u></button>
            </div>
          )}
          {activeFormattingTab === "design" && renderDesignPanel()}
        </div>

        <div className="cvmaker-section-tabs">
          {sections.map(section => (
            <button key={section.id} className={`cvmaker-section-tab ${activeSection === section.id ? "active" : ""}`} onClick={() => setActiveSection(section.id)}>
              <span className="cvmaker-section-tab-icon">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="cvmaker-editor-content">
          {/* Personal Details Section */}
          {activeSection === "personal" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-editor-sidebar-full">
                <div className="cvmaker-editor-sidebar-header"><h3>Personal details</h3></div>
                <div className="cvmaker-editor-form">
                  <div className="cvmaker-form-group cvmaker-photo-group">
                    <label>Photo</label>
                    <div className="cvmaker-photo-upload">
                      {cvFormData.photo ? <img src={cvFormData.photo} alt="Preview" className="cvmaker-photo-preview" /> : <div className="cvmaker-photo-placeholder">📷</div>}
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files[0]) { const reader = new FileReader(); reader.onload = (ev) => setCvFormData(prev => ({ ...prev, photo: ev.target.result })); reader.readAsDataURL(e.target.files[0]); } }} />
                    </div>
                  </div>
                  <div className="cvmaker-form-row">
                    <div className="cvmaker-form-group"><label>Given name *</label><input type="text" name="givenName" value={cvFormData.givenName} onChange={handleFormChange} placeholder="First name" /></div>
                    <div className="cvmaker-form-group"><label>Family name *</label><input type="text" name="familyName" value={cvFormData.familyName} onChange={handleFormChange} placeholder="Last name" /></div>
                  </div>
                  <div className="cvmaker-form-group"><label>Desired job position</label><input type="text" name="desiredJob" value={cvFormData.desiredJob} onChange={handleFormChange} /><label className="cvmaker-checkbox-label"><input type="checkbox" name="useAsHeadline" checked={cvFormData.useAsHeadline} onChange={handleFormChange} /> Use as headline</label></div>
                  <div className="cvmaker-form-group"><label>Email address *</label><input type="email" name="email" value={cvFormData.email} onChange={handleFormChange} /></div>
                  <div className="cvmaker-form-group"><label>Phone number *</label><input type="tel" name="phone" value={cvFormData.phone} onChange={handleFormChange} /></div>
                  <div className="cvmaker-form-group"><label>Address</label><input type="text" name="address" value={cvFormData.address} onChange={handleFormChange} /></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Post code</label><input type="text" name="postCode" value={cvFormData.postCode} onChange={handleFormChange} /></div><div className="cvmaker-form-group"><label>City</label><input type="text" name="city" value={cvFormData.city} onChange={handleFormChange} /></div></div>
                  <details className="cvmaker-optional-details"><summary>+ Additional fields</summary><div className="cvmaker-optional-fields">
                    <div className="cvmaker-form-group"><label>Date of birth</label><input type="date" name="dateOfBirth" value={cvFormData.dateOfBirth} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Place of birth</label><input type="text" name="placeOfBirth" value={cvFormData.placeOfBirth} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Driving licence</label><input type="text" name="drivingLicense" value={cvFormData.drivingLicense} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Gender</label><input type="text" name="gender" value={cvFormData.gender} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Nationality</label><input type="text" name="nationality" value={cvFormData.nationality} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Civil status</label><input type="text" name="civilStatus" value={cvFormData.civilStatus} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Website</label><input type="url" name="website" value={cvFormData.website} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>LinkedIn</label><input type="url" name="linkedin" value={cvFormData.linkedin} onChange={handleFormChange} /></div>
                    <div className="cvmaker-form-group"><label>Custom field</label><input type="text" name="customField" value={cvFormData.customField} onChange={handleFormChange} /></div>
                  </div></details>
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-section-header"><h3>Education</h3><button className="cvmaker-add-btn" onClick={addEducation}>+ Add education</button></div>
              {educationEntries.map((edu, idx) => (
                <div key={idx} className="cvmaker-entry-card">
                  <div className="cvmaker-entry-header"><span>Education #{idx + 1}</span><button className="cvmaker-remove-btn" onClick={() => removeEducation(idx)}>✕</button></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>School / University</label><input type="text" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} /></div><div className="cvmaker-form-group"><label>City</label><input type="text" value={edu.city} onChange={(e) => updateEducation(idx, 'city', e.target.value)} /></div></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Start Month</label><input type="text" placeholder="Month" value={edu.startMonth} onChange={(e) => updateEducation(idx, 'startMonth', e.target.value)} /></div><div className="cvmaker-form-group"><label>Start Year</label><input type="text" placeholder="Year" value={edu.startYear} onChange={(e) => updateEducation(idx, 'startYear', e.target.value)} /></div></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>End Month</label><input type="text" placeholder="Month" value={edu.endMonth} onChange={(e) => updateEducation(idx, 'endMonth', e.target.value)} disabled={edu.present} /></div><div className="cvmaker-form-group"><label>End Year</label><input type="text" placeholder="Year" value={edu.endYear} onChange={(e) => updateEducation(idx, 'endYear', e.target.value)} disabled={edu.present} /></div></div>
                  <div className="cvmaker-form-group"><label><input type="checkbox" checked={edu.present} onChange={(e) => updateEducation(idx, 'present', e.target.checked)} /> Present</label></div>
                  <div className="cvmaker-form-group"><label>Description</label><textarea rows="3" value={edu.description} onChange={(e) => updateEducation(idx, 'description', e.target.value)} placeholder="Start typing here..." /></div>
                </div>
              ))}
            </div>
          )}

          {/* Employment Section */}
          {activeSection === "employment" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-section-header"><h3>Employment</h3><button className="cvmaker-add-btn" onClick={addEmployment}>+ Add employment</button></div>
              {employmentEntries.map((emp, idx) => (
                <div key={idx} className="cvmaker-entry-card">
                  <div className="cvmaker-entry-header"><span>Employment #{idx + 1}</span><button className="cvmaker-remove-btn" onClick={() => removeEmployment(idx)}>✕</button></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Job Title</label><input type="text" value={emp.jobTitle} onChange={(e) => updateEmployment(idx, 'jobTitle', e.target.value)} /></div><div className="cvmaker-form-group"><label>Company</label><input type="text" value={emp.company} onChange={(e) => updateEmployment(idx, 'company', e.target.value)} /></div></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>City</label><input type="text" value={emp.city} onChange={(e) => updateEmployment(idx, 'city', e.target.value)} /></div></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Start Month</label><input type="text" placeholder="Month" value={emp.startMonth} onChange={(e) => updateEmployment(idx, 'startMonth', e.target.value)} /></div><div className="cvmaker-form-group"><label>Start Year</label><input type="text" placeholder="Year" value={emp.startYear} onChange={(e) => updateEmployment(idx, 'startYear', e.target.value)} /></div></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>End Month</label><input type="text" placeholder="Month" value={emp.endMonth} onChange={(e) => updateEmployment(idx, 'endMonth', e.target.value)} disabled={emp.present} /></div><div className="cvmaker-form-group"><label>End Year</label><input type="text" placeholder="Year" value={emp.endYear} onChange={(e) => updateEmployment(idx, 'endYear', e.target.value)} disabled={emp.present} /></div></div>
                  <div className="cvmaker-form-group"><label><input type="checkbox" checked={emp.present} onChange={(e) => updateEmployment(idx, 'present', e.target.checked)} /> Present</label></div>
                  <div className="cvmaker-form-group"><label>Description</label><textarea rows="3" value={emp.description} onChange={(e) => updateEmployment(idx, 'description', e.target.value)} /></div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-section-header"><h3>Skills</h3><button className="cvmaker-add-btn" onClick={addSkill}>+ Add skill</button></div>
              {skillsEntries.map((skill, idx) => (
                <div key={idx} className="cvmaker-entry-card-small">
                  <div className="cvmaker-entry-header"><span>Skill #{idx + 1}</span><button className="cvmaker-remove-btn" onClick={() => removeSkill(idx)}>✕</button></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Skill</label><input type="text" value={skill.skill} onChange={(e) => updateSkill(idx, 'skill', e.target.value)} placeholder="e.g., Communication" /></div><div className="cvmaker-form-group"><label>Level</label><select value={skill.level} onChange={(e) => updateSkill(idx, 'level', e.target.value)}><option value="">Make a choice</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option><option value="Expert">Expert</option></select></div></div>
                </div>
              ))}
              <div className="cvmaker-ai-suggestions"><span>🤖 AI Suggestions:</span> Communication • Teamwork • Problem-solving • Time management • Adaptability</div>
            </div>
          )}

          {/* Languages Section */}
          {activeSection === "languages" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-section-header"><h3>Languages</h3><button className="cvmaker-add-btn" onClick={addLanguage}>+ Add language</button></div>
              {languagesEntries.map((lang, idx) => (
                <div key={idx} className="cvmaker-entry-card-small">
                  <div className="cvmaker-entry-header"><span>Language #{idx + 1}</span><button className="cvmaker-remove-btn" onClick={() => removeLanguage(idx)}>✕</button></div>
                  <div className="cvmaker-form-row"><div className="cvmaker-form-group"><label>Language</label><input type="text" value={lang.language} onChange={(e) => updateLanguage(idx, 'language', e.target.value)} placeholder="e.g., English" /></div><div className="cvmaker-form-group"><label>Level</label><select value={lang.level} onChange={(e) => updateLanguage(idx, 'level', e.target.value)}><option value="">Make a choice</option><option value="Basic">Basic</option><option value="Conversational">Conversational</option><option value="Professional">Professional</option><option value="Native">Native</option></select></div></div>
                </div>
              ))}
              <div className="cvmaker-ai-suggestions"><span>🤖 AI Suggestions:</span> English • Spanish • Mandarin Chinese • French • German</div>
            </div>
          )}

          {/* Additional Sections */}
          {activeSection === "additional" && (
            <div className="cvmaker-editor-main-full">
              <div className="cvmaker-additional-sections">
                <div className="cvmaker-section-group"><h4>Profile</h4><textarea rows="3" value={additionalSections.profile} onChange={(e) => setAdditionalSections(prev => ({ ...prev, profile: e.target.value }))} placeholder="Write a short profile about yourself..." /></div>
                
                <div className="cvmaker-section-group"><h4>Courses</h4>{additionalSections.courses.map((course, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={course} onChange={(e) => updateArrayItem('courses', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('courses', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('courses', '')}>+ Add course</button></div>
                
                <div className="cvmaker-section-group"><h4>Internships</h4>{additionalSections.internships.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('internships', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('internships', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('internships', '')}>+ Add internship</button></div>
                
                <div className="cvmaker-section-group"><h4>Extracurricular Activities</h4>{additionalSections.extracurricular.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('extracurricular', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('extracurricular', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('extracurricular', '')}>+ Add activity</button></div>
                
                <div className="cvmaker-section-group"><h4>References</h4>{additionalSections.references.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('references', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('references', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('references', '')}>+ Add reference</button></div>
                
                <div className="cvmaker-section-group"><h4>Qualities</h4>{additionalSections.qualities.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('qualities', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('qualities', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('qualities', '')}>+ Add quality</button></div>
                
                <div className="cvmaker-section-group"><h4>Certificates</h4>{additionalSections.certificates.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('certificates', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('certificates', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('certificates', '')}>+ Add certificate</button></div>
                
                <div className="cvmaker-section-group"><h4>Achievements</h4>{additionalSections.achievements.map((item, idx) => (<div key={idx} className="cvmaker-list-item"><input type="text" value={item} onChange={(e) => updateArrayItem('achievements', idx, e.target.value)} /><button className="cvmaker-remove-small" onClick={() => removeArrayItem('achievements', idx)}>✕</button></div>))}<button className="cvmaker-add-small" onClick={() => addToArray('achievements', '')}>+ Add achievement</button></div>
                
                <div className="cvmaker-section-group"><h4>Signature</h4><textarea rows="2" value={additionalSections.signature} onChange={(e) => setAdditionalSections(prev => ({ ...prev, signature: e.target.value }))} placeholder="Your signature or closing statement..." /></div>
                
                <div className="cvmaker-section-group"><h4>Footer</h4><textarea rows="2" value={additionalSections.footer} onChange={(e) => setAdditionalSections(prev => ({ ...prev, footer: e.target.value }))} placeholder="Footer text..." /></div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="cvmaker-modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="cvmaker-modal" onClick={(e) => e.stopPropagation()}>
              <div className="cvmaker-modal-header"><h3>CV Preview: {editingCvName}</h3><button className="cvmaker-modal-close" onClick={() => setShowPreviewModal(false)}>✕</button></div>
              <div className="cvmaker-modal-body"><iframe srcDoc={generateCVHTML()} title="CV Preview" className="cvmaker-preview-iframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" /></div>
              <div className="cvmaker-modal-footer"><button className="cvmaker-download-btn" onClick={downloadAsPDF} disabled={isDownloading}>{isDownloading ? '⏳ Processing...' : '📄 Download PDF'}</button><button className="cvmaker-download-btn cvmaker-docx-btn" onClick={downloadAsDOCX} disabled={isDownloading}>{isDownloading ? '⏳ Processing...' : '📝 Download DOCX'}</button><button className="cvmaker-modal-close-btn" onClick={() => setShowPreviewModal(false)}>Close</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Feature Panels
  const renderActiveFeature = () => {
    if (showEditor) return renderCVEditor();

    switch (activeFeature) {
      case "templates":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header"><h3>CV Templates</h3><span className="cvmaker-panel-subtitle">Industry-specific, ATS-optimized designs</span></div>
            <div className="cvmaker-role-filter-container" ref={roleDropdownRef}>
              <div className="cvmaker-role-filter-header"><span className="cvmaker-filter-label-role">🎯 Filter by Intern Role:</span>
                <div className="cvmaker-search-dropdown">
                  <div className="cvmaker-search-input-wrapper"><input type="text" className="cvmaker-role-search-input" placeholder="Select an intern role..." value={roleSearchTerm} onChange={(e) => { setRoleSearchTerm(e.target.value); setShowRoleDropdown(true); if (e.target.value === "") setSelectedRoleId(null); }} onFocus={() => setShowRoleDropdown(true)} />{roleSearchTerm && <button className="cvmaker-clear-filter-btn" onClick={clearRoleFilter}>✕</button>}<button className="cvmaker-dropdown-toggle" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>⌵</button></div>
                  {showRoleDropdown && filteredRoles.length > 0 && (<div className="cvmaker-role-dropdown">{filteredRoles.map((role) => (<div key={role.id} className={`cvmaker-role-option ${selectedRoleId === role.id ? "cvmaker-role-option-selected" : ""}`} onClick={() => handleRoleSelect(role.id)}><span>{role.label}</span>{selectedRoleId === role.id && <span className="cvmaker-option-check">✓</span>}</div>))}</div>)}
                </div>
              </div>
              {selectedRoleId && (<div className="cvmaker-active-filter"><span className="cvmaker-filter-badge">Showing templates for: {internRoles.find(r => r.id === selectedRoleId)?.label}<button className="cvmaker-remove-filter" onClick={clearRoleFilter}>×</button></span></div>)}
            </div>
            <div className="cvmaker-template-filter"><span className="cvmaker-filter-label">🎯 Smart Recommendation:</span><span className="cvmaker-filter-tag">{getCurrentRecommendation()}</span></div>
            <div className="cvmaker-ai-info"><span className="cvmaker-ai-info-icon">🤖</span><span>Click "Edit & Customize CV" on any card to create a personalized CV</span></div>
            <div className="cvmaker-templates-grid">{filteredTemplates.map(template => renderTemplateCard(template))}</div>
            <div className="cvmaker-ats-info-box"><h4>🤖 ATS-Optimized Templates Include:</h4><div className="cvmaker-ats-features"><span>✅ Single-column layout</span><span>✅ Standard headings</span><span>✅ Machine-readable dates</span><span>✅ Keyword-rich summary</span><span>✅ Bullet point consistency</span></div></div>
          </div>
        );

      case "scoring":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header"><h3>Smart CV Scoring</h3><span className="cvmaker-panel-subtitle">AI-powered analysis with real-time feedback</span></div>
            <div className="cvmaker-input-mode-toggle"><button className={`cvmaker-mode-btn ${inputMode === "upload" ? "cvmaker-mode-active" : ""}`} onClick={() => setInputMode("upload")}>📁 Upload CV File</button><button className={`cvmaker-mode-btn ${inputMode === "paste" ? "cvmaker-mode-active" : ""}`} onClick={() => setInputMode("paste")}>📝 Paste CV Text</button></div>
            {inputMode === "upload" && (<div className={`cvmaker-upload-dropzone ${dragOver ? "cvmaker-drag-over" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}><input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files[0])} /><div className="cvmaker-upload-icon-large">{uploadedFileName ? "✅" : "📂"}</div>{uploadedFileName ? (<><p className="cvmaker-upload-success-text">File loaded: <strong>{uploadedFileName}</strong></p><p className="cvmaker-upload-hint">Click to change file</p></>) : (<><p className="cvmaker-upload-main-text">Drag & drop your CV here</p><p className="cvmaker-upload-hint">or click to browse files</p><div className="cvmaker-upload-formats"><span className="cvmaker-format-badge">PDF</span><span className="cvmaker-format-badge">DOCX</span><span className="cvmaker-format-badge">TXT</span></div></>)}</div>)}
            {inputMode === "paste" && (<textarea className="cvmaker-cv-input" placeholder="Paste your CV text here to get a detailed AI analysis..." value={cvContent} onChange={(e) => setCvContent(e.target.value)} rows={10} />)}
            <button className={`cvmaker-analyze-btn ${isAnalyzing ? "cvmaker-analyzing" : ""}`} onClick={analyzeCV} disabled={isAnalyzing}>{isAnalyzing ? (<span className="cvmaker-loading-text"><span className="cvmaker-spinner">⚙️</span> Analyzing with AI...</span>) : "⚡ Analyze CV with AI"}</button>
            
            <div className="cvmaker-score-tabs">
              {["overview", "sections", "feedback"].map((tab) => (
                <button key={tab} className={`cvmaker-score-tab ${activeScoreTab === tab ? "cvmaker-score-tab-active" : ""}`} onClick={() => setActiveScoreTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            {activeScoreTab === "overview" && (
              <div className="cvmaker-empty-state">
                <div className="cvmaker-empty-icon">📊</div>
                <h4>No Analysis Data</h4>
                <p>Click "Analyze CV with AI" to see your CV analysis results.</p>
              </div>
            )}
            
            {activeScoreTab === "sections" && (
              <div className="cvmaker-empty-state">
                <div className="cvmaker-empty-icon">📋</div>
                <h4>No Section Data</h4>
                <p>Click "Analyze CV with AI" to see section-wise analysis.</p>
              </div>
            )}
            
            {activeScoreTab === "feedback" && (
              <div className="cvmaker-empty-state">
                <div className="cvmaker-empty-icon">💡</div>
                <h4>No Feedback Available</h4>
                <p>Click "Analyze CV with AI" to get AI-powered feedback.</p>
              </div>
            )}
          </div>
        );

      case "coverletter":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header"><h3>Cover Letter Generator</h3><span className="cvmaker-panel-subtitle">Dynamic structure with tone selection</span></div>
            <div className="cvmaker-tone-selector"><label>Select Tone:</label>
              <div className="cvmaker-tone-options">
                <button className={`cvmaker-tone-btn ${coverLetterTone === "formal" ? "cvmaker-tone-active" : ""}`} onClick={() => setCoverLetterTone("formal")}>🏢 Formal</button>
                <button className={`cvmaker-tone-btn ${coverLetterTone === "academic" ? "cvmaker-tone-active" : ""}`} onClick={() => setCoverLetterTone("academic")}>🎓 Academic</button>
              </div>
            </div>
            <button className="cvmaker-analyze-btn" onClick={generateCoverLetter}>✉️ Generate Cover Letter</button>
            {coverLetter && (
              <>
                <textarea className="cvmaker-cover-letter-textarea" rows="18" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <div className="cvmaker-cl-actions">
                  <button className="cvmaker-cl-action-btn" onClick={() => navigator.clipboard.writeText(coverLetter)}>📋 Copy</button>
                  <button className="cvmaker-cl-action-btn" onClick={() => exportCV("cover-letter-pdf")}>📄 Export PDF</button>
                </div>
              </>
            )}
          </div>
        );

      case "export":
        return (
          <div className="cvmaker-feature-panel">
            <div className="cvmaker-panel-header"><h3>Export & Sharing</h3><span className="cvmaker-panel-subtitle">Multi-format export · Shareable links</span></div>
            <div className="cvmaker-export-section"><h4>📤 Multi-Format Export</h4><div className="cvmaker-export-options"><button className="cvmaker-export-btn" onClick={() => exportCV("ats-pdf")}><span className="cvmaker-export-icon">📄</span><span className="cvmaker-export-name">ATS-Optimized PDF</span><span className="cvmaker-export-desc">Best for job applications</span></button><button className="cvmaker-export-btn" onClick={() => exportCV("styled-pdf")}><span className="cvmaker-export-icon">🎨</span><span className="cvmaker-export-name">Styled PDF</span><span className="cvmaker-export-desc">Custom visual design</span></button><button className="cvmaker-export-btn" onClick={() => exportCV("docx")}><span className="cvmaker-export-icon">📝</span><span className="cvmaker-export-name">Word DOCX</span><span className="cvmaker-export-desc">Editable document</span></button><button className="cvmaker-export-btn" onClick={() => exportCV("txt")}><span className="cvmaker-export-icon">📃</span><span className="cvmaker-export-name">Plain Text</span><span className="cvmaker-export-desc">ATS-safe, no formatting</span></button></div></div>
            <div className="cvmaker-share-section"><h4>🔗 Sharing System</h4><div className="cvmaker-share-options"><button className="cvmaker-share-btn" onClick={generateShareLink}>🔗 Generate Shareable Link</button><button className="cvmaker-share-btn" onClick={() => alert("QR Code generated!")}>📱 Generate QR Code</button><button className="cvmaker-share-btn" onClick={() => alert("Email sharing opened!")}>📧 Share via Email</button></div>{shareLink && (<div className="cvmaker-share-link-box"><input className="cvmaker-share-link-input" readOnly value={shareLink} /><button className="cvmaker-copy-btn" onClick={() => navigator.clipboard.writeText(shareLink)}>Copy</button></div>)}</div>
          </div>
        );

      default: return <div>Select a feature</div>;
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
        <div className="cvmaker-sidebar-brand"><span className="cvmaker-sidebar-logo">📄</span><h2>CV Maker</h2></div>
        <nav className="cvmaker-nav">{features.map((feature) => (<button key={feature.id} className={`cvmaker-sidebar-feature ${activeFeature === feature.id ? "cvmaker-active" : ""}`} onClick={() => setActiveFeature(feature.id)}><span className="cvmaker-nav-icon">{feature.icon}</span><span>{feature.label}</span></button>))}</nav>
        <button className="cvmaker-back-btn" onClick={onBack}>← Back</button>
      </div>
      <div className="cvmaker-content"><div className="cvmaker-feature-container">{renderActiveFeature()}</div></div>
    </div>
  );
};

export default CVMaker;