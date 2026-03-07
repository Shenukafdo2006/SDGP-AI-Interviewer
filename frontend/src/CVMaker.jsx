
import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {

  const [activeFeature, setActiveFeature] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [cvContent, setCvContent] = useState("");
  const [cvHealth, setCvHealth] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const templates = [
    { id: "modern", name: "Modern", icon: "✨", color: "#667eea", description: "Clean modern layout" },
    { id: "professional", name: "Professional", icon: "👔", color: "#2c3e50", description: "Corporate style CV" },
    { id: "creative", name: "Creative", icon: "🎨", color: "#764ba2", description: "Creative portfolio design" },
    { id: "minimal", name: "Minimal", icon: "📄", color: "#4caf50", description: "Simple ATS friendly layout" }
  ];

  const analyzeCV = () => {
    const score = {
      overall: 78,
      completeness: 85,
      formatting: 72,
      readability: 88,
      skillsScore: 70,
      feedback: [
        { type: "success", message: "Professional summary looks good." },
        { type: "warning", message: "Add more measurable achievements." },
        { type: "info", message: "Consider adding GitHub projects." }
      ]
    };

    setCvHealth(score);
  };

  const generateCoverLetter = () => {

    const template = `Dear Hiring Manager,

I am writing to express my interest in the Software Engineering Intern position. 

As a computer science student with experience in React, Node.js, and SQL, I enjoy building full-stack applications and solving real-world problems.

My recent projects include web applications that improved performance and user experience. I am excited to contribute my technical skills and passion for learning to your organization.

Thank you for considering my application.

Sincerely,
[Your Name]
`;

    setCoverLetter(template);
  };

  const exportCV = (format) => {
    alert("Exporting CV as " + format.toUpperCase());
  };

  const renderActiveFeature = () => {

    switch (activeFeature) {

      case "templates":
        return (
          <div className="cvmaker-feature-panel">
            <h3>CV Templates</h3>

            <div className="cvmaker-templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cvmaker-template-card ${selectedTemplate === template.id ? "cvmaker-selected" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="cvmaker-template-preview">
                    <div style={{ fontSize: "40px", color: template.color }}>
                      {template.icon}
                    </div>
                  </div>

                  <div className="cvmaker-template-details">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        );

      case "scoring":
        return (
          <div className="cvmaker-feature-panel">

            <h3>Smart CV Scoring</h3>

            <textarea
              className="cvmaker-cv-input"
              placeholder="Paste your CV here..."
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
            />

            <button className="cvmaker-analyze-btn" onClick={analyzeCV}>
              Analyze CV
            </button>

            {cvHealth && (
              <div className="cvmaker-score-cards">

                <div className="cvmaker-score-card">
                  <h4>Overall</h4>
                  <p>{cvHealth.overall}%</p>
                </div>

                <div className="cvmaker-score-card">
                  <h4>Completeness</h4>
                  <p>{cvHealth.completeness}%</p>
                </div>

                <div className="cvmaker-score-card">
                  <h4>Formatting</h4>
                  <p>{cvHealth.formatting}%</p>
                </div>

                <div className="cvmaker-score-card">
                  <h4>Readability</h4>
                  <p>{cvHealth.readability}%</p>
                </div>

              </div>
            )}

          </div>
        );

      case "coverletter":
        return (
          <div className="cvmaker-feature-panel">

            <h3>Cover Letter Generator</h3>

            <button className="cvmaker-analyze-btn" onClick={generateCoverLetter}>
              Generate Cover Letter
            </button>

            {coverLetter && (
              <textarea
                className="cvmaker-cover-letter-textarea"
                rows="15"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            )}

          </div>
        );

      case "export":
        return (
          <div className="cvmaker-feature-panel">

            <h3>Export CV</h3>

            <div className="cvmaker-export-options">

              <button onClick={() => exportCV("pdf")}>Download PDF</button>
              <button onClick={() => exportCV("docx")}>Download DOCX</button>
              <button onClick={() => exportCV("txt")}>Download TXT</button>

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
    { id: "export", icon: "📤", label: "Export" }
  ];

  return (

    <div className="cvmaker-dashboard">

      <div className="cvmaker-sidebar">

        <h2>CV Maker</h2>

        {features.map((feature) => (
          <button
            key={feature.id}
            className={`cvmaker-sidebar-feature ${activeFeature === feature.id ? "cvmaker-active" : ""}`}
            onClick={() => setActiveFeature(feature.id)}
          >
            {feature.icon} {feature.label}
          </button>
        ))}

        <button className="cvmaker-back-btn" onClick={onBack}>
          Back
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

