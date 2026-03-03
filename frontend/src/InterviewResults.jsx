import "./InterviewTraining.css";
import { useState, useEffect } from "react";
import { getSessionData } from "./api/interviewApi";

function InterviewResults({ sessionId, onBack, onRestartInterview }) {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getSessionData(sessionId);
        setSessionData(data);
      } catch (err) {
        setError(err.message || "Failed to load results");
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="interview-page">
        <header className="header">
          <div className="menu-icon" onClick={onBack}>←</div>
          <div className="logo">🤖</div>
        </header>
        <div className="interview-container">
          <p className="subtitle">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interview-page">
        <header className="header">
          <div className="menu-icon" onClick={onBack}>←</div>
          <div className="logo">🤖</div>
        </header>
        <div className="interview-container">
          <p className="subtitle" style={{ color: "#ef4444" }}>Error: {error}</p>
          <button className="start-btn" onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  const avgScore = sessionData.averageScore || 0;
  const scoreColor = avgScore >= 8 ? "#34d399" : avgScore >= 6 ? "#fbbf24" : "#ef4444";

  return (
    <div className="interview-page">
      <header className="header">
        <div className="menu-icon" onClick={onBack}>←</div>
        <div className="logo">🎯</div>
      </header>

      <div className="interview-container">
        <h1 className="title">Interview Results</h1>
        <p className="subtitle">Great effort! Here's your performance summary</p>

        {/* Score Card */}
        <div className="card">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: scoreColor,
              marginBottom: "10px"
            }}>
              {avgScore}/10
            </div>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Average Score ({sessionData.totalQuestionsAnswered} questions)
            </p>
          </div>

          {/* Interview Info */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <div>
              <p style={{ color: "#666", fontSize: "12px" }}>Role</p>
              <p style={{ fontWeight: "600" }}>{sessionData.role || "N/A"}</p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "12px" }}>Level</p>
              <p style={{ fontWeight: "600" }}>{sessionData.level || "N/A"}</p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "12px" }}>Interview Type</p>
              <p style={{ fontWeight: "600" }}>{sessionData.interviewType || "N/A"}</p>
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "12px" }}>Status</p>
              <p style={{ fontWeight: "600", color: "#34d399" }}>Completed</p>
            </div>
          </div>

          {/* Questions & Answers */}
          <h3 style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "bold" }}>
            Question Breakdown
          </h3>
          
          {sessionData.answers && sessionData.answers.map((item, idx) => (
            <div key={idx} style={{
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: idx < sessionData.answers.length - 1 ? "1px solid #e5e7eb" : "none"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#666", fontSize: "12px", marginBottom: "5px" }}>Question {idx + 1}</p>
                  <p style={{ fontWeight: "600", marginBottom: "10px" }}>{item.question}</p>
                </div>
                <div style={{
                  backgroundColor: scoreColor,
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  marginLeft: "10px"
                }}>
                  {item.evaluation?.score || 0}/10
                </div>
              </div>

              <p style={{ color: "#666", fontSize: "13px", marginBottom: "10px" }}>Your Answer:</p>
              <p style={{
                backgroundColor: "#f3f4f6",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "13px",
                lineHeight: "1.5"
              }}>
                {item.answer || "(No answer provided)"}
              </p>

              {item.evaluation && (
                <div style={{ marginTop: "15px" }}>
                  {item.evaluation.strengths && item.evaluation.strengths.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                        ✓ Strengths
                      </p>
                      <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#666" }}>
                        {item.evaluation.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.evaluation.improvements && item.evaluation.improvements.length > 0 && (
                    <div>
                      <p style={{ color: "#f97316", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                        ⚠ Areas to Improve
                      </p>
                      <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#666" }}>
                        {item.evaluation.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.evaluation.feedback && (
                    <div style={{ marginTop: "10px", padding: "12px", backgroundColor: "#eff6ff", borderRadius: "6px", fontSize: "13px", color: "#1e3a8a" }}>
                      <strong>💡 Feedback:</strong> {item.evaluation.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Facial Analysis Summary */}
          {sessionData.facialAnalysis && sessionData.facialAnalysis.length > 0 && (
            <div style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "2px solid #e5e7eb"
            }}>
              <h3 style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "bold" }}>
                📊 Engagement Analysis
              </h3>
              <p style={{ color: "#666", fontSize: "13px" }}>
                Captured {sessionData.facialAnalysis.length} facial data points during your interview
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
            <button className="start-btn" onClick={onRestartInterview} style={{ flex: 1 }}>
              Try Another Interview
            </button>
            <button className="start-btn" onClick={onBack} style={{ flex: 1, backgroundColor: "#6b7280" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewResults;
