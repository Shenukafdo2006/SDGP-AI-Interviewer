import "./InterviewTraining.css";

function InterviewTraining({ onBack }) {
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
          <select>
            <option>Software Engineer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Scientist</option>
          </select>

          {/* Interview Type */}
          <label>Interview Type</label>
          <div className="type-grid">
            <button className="type active">⚙️ Technical</button>
            <button className="type">🧠 Behavioural</button>
            <button className="type">💬 Soft Skills</button>
            <button className="type">🔀 Mixed</button>
          </div>

          {/* Experience Level */}
          <label>Experience Level</label>
          <select>
            <option>Entry Level (0–1 Years)</option>
            <option>Junior Level (1–3 Years)</option>
            <option>Mid Level (2–5 Years)</option>
            <option>Senior Level (5+ Years)</option>
          </select>

          {/* Button */}
          <button className="start-btn">
            Start Interview
          </button>
        </div>

      </div>
    </div>
  );
}

export default InterviewTraining;