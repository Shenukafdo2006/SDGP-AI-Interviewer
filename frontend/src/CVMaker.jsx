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
    { id: "modern", name: "Modern", icon: "✨" },
    { id: "professional", name: "Professional", icon: "👔" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "minimal", name: "Minimal", icon: "📄" },
  ];

  const features = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "templates", icon: "📋", label: "Templates" },
    { id: "scoring", icon: "⭐", label: "CV Scoring" },
    { id: "jobmatch", icon: "🎯", label: "Job Match" },
    { id: "ai", icon: "🤖", label: "AI Suggestions" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter" },
    { id: "ats", icon: "✅", label: "ATS Test" },
  ];

  // =====================
  // Feature Logic
  // =====================
  const analyzeCV = () => {
    setCvHealth({
      overall: 78,
      feedback: ["Add metrics", "Improve action verbs"],
    });
  };

  const matchJobDescription = () => {
    setMatchScore({
      percentage: 72,
      matched: ["React", "JavaScript"],
      missing: ["Docker"],
    });
  };

  const generateAISuggestions = () => {
    setAiSuggestions([
      {
        section: "Summary",
        original: "I am a developer",
        suggested: "Results-driven software developer",
      },
    ]);
  };

  const generateCoverLetter = () => {
    setCoverLetter(`Dear Hiring Manager,

I am excited to apply for this role.

Sincerely,
[Your Name]`);
  };

  // ✅ ATS TEST
  const runATSTest = () => {
    setAtsScore({
      score: 85,
      compatibility: "Excellent",
      issues: [
        { type: "warning", message: "Avoid tables" },
        { type: "success", message: "Standard headings used" },
      ],
      tips: [
        "Use standard headings",
        "Avoid tables",
        "Use bullet points",
        "Add keywords",
        "Save as PDF or DOCX",
      ],
    });
  };

  // =====================
  // Render Feature
  // =====================
  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "dashboard":
        return <h3>📊 Welcome to CV Maker Pro</h3>;

      case "templates":
        return (
          <>
            <h3>📋 Templates</h3>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={selectedTemplate === t.id ? "active" : ""}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </>
        );

      case "scoring":
        return (
          <>
            <textarea
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
              placeholder="Paste CV here"
            />
            <button onClick={analyzeCV}>Analyze</button>
            {cvHealth && <p>Score: {cvHealth.overall}%</p>}
          </>
        );

      case "jobmatch":
        return (
          <>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description"
            />
            <button onClick={matchJobDescription}>Match</button>
            {matchScore && <p>Match: {matchScore.percentage}%</p>}
          </>
        );

      case "ai":
        return (
          <>
            <button onClick={generateAISuggestions}>Generate AI Suggestions</button>
            {aiSuggestions.map((s, i) => (
              <p key={i}>
                <strong>{s.section}:</strong> {s.suggested}
              </p>
            ))}
          </>
        );

      case "coverletter":
        return (
          <>
            <button onClick={generateCoverLetter}>Generate</button>
            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          </>
        );

      case "ats":
        return (
          <>
            <h3>✅ ATS Compatibility Test</h3>
            <button onClick={runATSTest}>Run ATS Test</button>

            {atsScore && (
              <>
                <h4>{atsScore.score}% — {atsScore.compatibility}</h4>

                {atsScore.issues.map((i, idx) => (
                  <p key={idx}>{i.message}</p>
                ))}

                <ul>
                  {atsScore.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // =====================
  // JSX
  // =====================
  return (
    <div className="cvmaker-dashboard">
      <aside className="cvmaker-sidebar">
        <h2>🎯 CV Maker Pro</h2>
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFeature(f.id)}
            className={activeFeature === f.id ? "active" : ""}
          >
            {f.icon} {f.label}
          </button>
        ))}
        <button onClick={onBack}>← Back</button>
      </aside>

      <main className="cvmaker-content">
        {renderActiveFeature()}
      </main>
    </div>
  );
};

export default CVMaker;
