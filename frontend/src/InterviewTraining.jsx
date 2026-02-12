import "./InterviewTraining.css";
import { useState } from "react";
import { startInterview } from "./api/interviewApi";

function InterviewTraining({ onBack, onStartInterview }) {
  const [interviewType, setInterviewType] = useState("Technical");
  const [role, setRole] = useState("Software Engineer");
  const [level, setLevel] = useState("Entry Level (0-1 Years)");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  const handleStartInterview = async () => {
    setIsStarting(true);
    setError(null);

    try {
      const data = await startInterview({ role, level });
      onStartInterview({
        sessionId: data.sessionId,
        question: data.question,
        index: data.index,
        total: data.total,
        role,
        level,
        interviewType,
      });
    } catch (err) {
      setError(err.message || "Unable to start interview");
    } finally {
      setIsStarting(false);
    }
  };
  return (
    <div className="interview-page">
      {/* Header */}
      <header className="header">
        <div
          className="menu-icon"
          onClick={onBack}
          style={{ cursor: onBack ? "pointer" : "default" }}
        >
          ←
        </div>
        <div className="logo">🤖</div>
      </header>

      {/* CENTERED CONTENT WRAPPER */}
      <div className="interview-container">
        {/* Title */}
        <h1 className="title">Interview Training</h1>
        <p className="subtitle">
          Prepare for your next interview with AI-powered practice sessions
        </p>
        {/* Card */}
        <div className="card">
          <h2>Configure Interview</h2>
          <p className="description">
            Customize your practice session to match your target role
          </p>
          {/* Job Role */}
          <label>Job Role</label>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Software Engineer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Scientist</option>
          </select>
          {/* Interview Type */}
          <label>Interview Type</label>
          <div className="type-grid">
            <button
              className={`type ${interviewType === "Technical" ? "active" : ""}`}
              onClick={() => setInterviewType("Technical")}
            >
              ⚙️ Technical
            </button>
            <button
              className={`type ${interviewType === "Behavioural" ? "active" : ""}`}
              onClick={() => setInterviewType("Behavioural")}
            >
              🧠 Behavioural
            </button>
            <button
              className={`type ${interviewType === "Soft Skills" ? "active" : ""}`}
              onClick={() => setInterviewType("Soft Skills")}
            >
              💬 Soft Skills
            </button>
            <button
              className={`type ${interviewType === "Mixed" ? "active" : ""}`}
              onClick={() => setInterviewType("Mixed")}
            >
              🔀 Mixed
            </button>
          </div>
          {/* Experience Level */}
          <label>Experience Level</label>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option>Entry Level (0-1 Years)</option>
            <option>Junior Level (1-3 Years)</option>
            <option>Mid Level (2-5 Years)</option>
            <option>Senior Level (5+ Years)</option>
          </select>
          {/* Button */}
          <button className="start-btn" onClick={handleStartInterview} disabled={isStarting}>
            {isStarting ? "Starting..." : "Start Interview"}
          </button>
          {error && <p className="subtitle">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default InterviewTraining;