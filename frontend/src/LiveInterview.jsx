import React, { useEffect, useRef, useState } from "react";
import { submitAnswer, analyzeFacialExpression } from "./api/interviewApi";

function LiveInterview({ sessionData, onBack, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(sessionData?.question || "");
  const [currentIndex, setCurrentIndex] = useState(sessionData?.index || 0);
  const [error, setError] = useState(null);
  const [facialData, setFacialData] = useState(null);
  const recognitionRef = useRef(null);
  const frameCaptureSwitchRef = useRef(null);

  // Camera setup
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setError("Unable to access camera: " + err.message);
        console.error("Camera error:", err);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Speech-to-text setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // Capture video frame for facial analysis
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      return canvasRef.current.toDataURL("image/jpeg", 0.8).split(",")[1]; // base64
    }
    return null;
  };

  // Analyze facial expression
  const analyzeFacial = async () => {
    try {
      const frameBase64 = captureFrame();
      if (!frameBase64) {
        console.warn("Could not capture frame");
        return;
      }

      const analysis = await analyzeFacialExpression({
        frameBase64,
        question: currentQuestion,
      });

      setFacialData(analysis.analysis);
    } catch (err) {
      console.error("Facial analysis error:", err);
      // Don't show error to user - facial analysis is optional
    }
  };

  // Periodically capture facial data while listening
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      analyzeFacial();
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      setError("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitAnswer({
        sessionId: sessionData.sessionId,
        answer: transcript,
        facialData: facialData,
      });

      if (response.status === "completed") {
        // Interview completed
        onComplete(response);
      } else {
        // Move to next question
        setCurrentQuestion(response.question);
        setCurrentIndex(response.index);
        setTranscript("");
        setFacialData(null);
      }
    } catch (err) {
      setError(err.message || "Failed to submit answer");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="live-interview-page">
      <header className="header">
        <div
          className="menu-icon"
          onClick={onBack}
          style={{ cursor: "pointer" }}
        >
          ←
        </div>
        <div className="logo">🎙️</div>
      </header>

      <div className="interview-main">
        <div className="video-section">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: 400,
              borderRadius: 8,
              border: "2px solid #333",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Facial Analysis Display */}
          {facialData && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#f0f9ff",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#064e3b"
            }}>
              <p><strong>👁️ Engagement:</strong> {facialData.engagement_level}/10</p>
              <p><strong>😊 Expression:</strong> {facialData.expression}</p>
              <p><strong>👀 Eye Contact:</strong> {facialData.eye_contact}</p>
            </div>
          )}
        </div>

        <div className="subtitle-section">
          {/* Progress */}
          <div style={{ marginBottom: "20px", fontSize: "12px", color: "#666" }}>
            Question {currentIndex + 1} of 5
          </div>

          {/* Question */}
          <div className="question-subtitle">
            <strong>Question:</strong>
            <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
              {currentQuestion}
            </p>
          </div>

          {/* Transcript */}
          <div className="user-subtitle">
            <strong>Your Answer:</strong>
            <p style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "#f3f4f6",
              borderRadius: "6px",
              minHeight: "80px",
              fontSize: "14px",
              color: transcript ? "#333" : "#999"
            }}>
              {transcript || "(Your speech will appear here...)"}
            </p>
          </div>

          {/* Controls */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={startListening}
              disabled={isListening || isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: isListening ? "#ef4444" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isListening ? "not-allowed" : "pointer",
                opacity: isListening ? 0.6 : 1
              }}
            >
              {isListening ? "🔴 Recording..." : "🎤 Start Speaking"}
            </button>

            <button
              onClick={stopListening}
              disabled={!isListening || isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: !isListening ? "not-allowed" : "pointer",
                opacity: !isListening ? 0.6 : 1
              }}
            >
              ⏹️ Stop
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !transcript.trim()}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "10px 20px",
                backgroundColor: "#34d399",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: isSubmitting || !transcript.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !transcript.trim() ? 0.6 : 1
              }}
            >
              {isSubmitting ? "⏳ Submitting..." : "✓ Submit Answer"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "13px"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Info */}
          <div style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#f0fdf4",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#166534"
          }}>
            💡 <strong>Tips:</strong> Speak clearly, provide detailed answers with examples. Your facial engagement is being tracked.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveInterview;
