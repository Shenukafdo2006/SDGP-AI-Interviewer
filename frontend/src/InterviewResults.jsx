import "./InterviewTraining.css";
import { useState, useEffect } from "react";
import { getSessionData, getSessionFeedback } from "./api/interviewApi";

const getScoreLabel = (score) => {
  if (score >= 8.5) return "Strong Performance";
  if (score >= 7) return "Good Progress";
  if (score >= 5.5) return "Developing";
  return "Needs Focused Practice";
};

const getPersonalizedSummary = (sessionData) => {
  const answers = sessionData?.answers || [];
  const avgScore = sessionData?.averageScore || 0;
  const firstScore = answers[0]?.evaluation?.score || avgScore;
  const lastScore = answers[answers.length - 1]?.evaluation?.score || avgScore;
  const trend = lastScore - firstScore;
  const trendMessage =
    trend >= 1
      ? "You improved as the interview progressed."
      : trend <= -1
        ? "Your answers started strong, but consistency dropped later."
        : "Your performance stayed relatively consistent across questions.";

  const lowScoring = answers.filter((item) => (item.evaluation?.score || 0) < 6).length;
  const strongScoring = answers.filter((item) => (item.evaluation?.score || 0) >= 8).length;
  const averageAnswerLength = answers.length
    ? Math.round(
      answers.reduce((sum, item) => sum + ((item.answer || "").trim().split(/\s+/).filter(Boolean).length || 0), 0) /
          answers.length
    )
    : 0;

  return [
    `For your ${sessionData.level || ""} ${sessionData.role || "target role"} interview, your average score was ${avgScore}/10 (${getScoreLabel(avgScore)}).`,
    trendMessage,
    strongScoring > 0
      ? `You delivered ${strongScoring} high-scoring answer${strongScoring > 1 ? "s" : ""} (8+/10), which shows clear capability in key areas.`
      : "You have room to push more answers into the high-scoring range with stronger examples.",
    lowScoring > 0
      ? `${lowScoring} answer${lowScoring > 1 ? "s" : ""} scored below 6/10, so focus on clarity, structure, and direct examples under pressure.`
      : "No answer dropped below 6/10, which indicates solid baseline consistency.",
    averageAnswerLength > 0
      ? `Your average response length was about ${averageAnswerLength} words; aim for concise but evidence-based answers.`
      : "Add fuller responses with clear examples to improve depth.",
  ];
};

const aggregateEvaluationPatterns = (answers = []) => {
  const strengthsMap = new Map();
  const improvementsMap = new Map();

  answers.forEach((item) => {
    const strengths = item.evaluation?.strengths || [];
    const improvements = item.evaluation?.improvements || [];
    strengths.forEach((entry) => {
      const key = String(entry || "").trim();
      if (!key) return;
      strengthsMap.set(key, (strengthsMap.get(key) || 0) + 1);
    });
    improvements.forEach((entry) => {
      const key = String(entry || "").trim();
      if (!key) return;
      improvementsMap.set(key, (improvementsMap.get(key) || 0) + 1);
    });
  });

  const topStrengths = [...strengthsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([text, count]) => ({ text, count }));

  const topImprovements = [...improvementsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([text, count]) => ({ text, count }));

  return { topStrengths, topImprovements };
};

function InterviewResults({ sessionId, onBack, onRestartInterview }) {
  const [sessionData, setSessionData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setFeedbackError(null);
        const data = await getSessionData(sessionId);
        setSessionData(data);

        if (data?.status === "completed") {
          try {
            const feedbackResponse = await getSessionFeedback(sessionId);
            setFeedbackData(feedbackResponse?.feedback || null);
          } catch (feedbackFetchError) {
            setFeedbackData(null);
            setFeedbackError(feedbackFetchError.message || "Could not load AI feedback");
          }
        } else {
          setFeedbackData(null);
        }
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
  const personalizedSummary = getPersonalizedSummary(sessionData);
  const { topStrengths, topImprovements } = aggregateEvaluationPatterns(sessionData.answers || []);
  const aiFeedback = feedbackData || {};

  return (
    <div className="interview-page">
      <header className="header">
        <div className="menu-icon" onClick={onBack}>←</div>
        <div className="logo">🎯</div>
      </header>

      <div className="interview-container">
        <h1 className="title">Interview Results</h1>
        <p className="subtitle">{getScoreLabel(avgScore)} - detailed and personalized feedback</p>

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

          {/* Personalized Performance Summary */}
          <div style={{
            marginBottom: "20px",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ marginBottom: "10px", fontSize: "15px", fontWeight: "bold" }}>
              Personalized Performance Summary
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#475569", lineHeight: "1.7" }}>
              {personalizedSummary.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
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

          {/* Pattern Analysis */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{ backgroundColor: "#f0fdf4", borderRadius: "8px", padding: "12px" }}>
              <p style={{ color: "#15803d", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>
                Repeated Strengths
              </p>
              {topStrengths.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#166534", lineHeight: "1.6" }}>
                  {topStrengths.map((item, idx) => (
                    <li key={idx}>{item.text} {item.count > 1 ? `(seen ${item.count}x)` : ""}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#166534" }}>Keep practicing to build stronger recurring strengths.</p>
              )}
            </div>

            <div style={{ backgroundColor: "#fff7ed", borderRadius: "8px", padding: "12px" }}>
              <p style={{ color: "#c2410c", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>
                Repeated Improvement Areas
              </p>
              {topImprovements.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#9a3412", lineHeight: "1.6" }}>
                  {topImprovements.map((item, idx) => (
                    <li key={idx}>{item.text} {item.count > 1 ? `(seen ${item.count}x)` : ""}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#9a3412" }}>No repeated weak areas detected in this round.</p>
              )}
            </div>
          </div>

          {/* AI Session Feedback */}
          <div style={{
            marginBottom: "24px",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#eff6ff",
          }}>
            <h3 style={{ marginBottom: "10px", fontSize: "15px", fontWeight: "bold", color: "#1d4ed8" }}>
              AI Coach Feedback
            </h3>
            {aiFeedback?.summary ? (
              <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#1e3a8a", lineHeight: "1.6" }}>
                {aiFeedback.summary}
              </p>
            ) : (
              <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#1e3a8a", lineHeight: "1.6" }}>
                Detailed AI coach feedback is unavailable right now, but your personalized breakdown above is generated from your actual answer and score patterns.
              </p>
            )}

            {feedbackError && (
              <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#b91c1c" }}>
                {feedbackError}
              </p>
            )}

            {Array.isArray(aiFeedback?.action_items) && aiFeedback.action_items.length > 0 && (
              <>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", fontWeight: "700", color: "#1e40af" }}>
                  Recommended Action Items
                </p>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#1e3a8a", lineHeight: "1.6" }}>
                  {aiFeedback.action_items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}
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
