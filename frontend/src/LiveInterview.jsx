import React, { useEffect, useRef, useState } from "react";
import { submitAnswer, analyzeFacialExpression } from "./api/interviewApi";

function LiveInterview({ sessionData, onBack, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const facialLoopRef = useRef(null);
  const facialBusyRef = useRef(false);
  const facialSamplesRef = useRef([]);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(sessionData?.question || "");
  const [currentIndex, setCurrentIndex] = useState(sessionData?.index || 0);
  const [error, setError] = useState(null);
  const [facialData, setFacialData] = useState(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastSpokenFeedback, setLastSpokenFeedback] = useState("");
  const interviewMode = sessionData?.interviewMode || "video";
  const isVideoInterview = interviewMode === "video";
  const preferredVoiceRef = useRef(null);

  const getPreferredVoice = () => {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const enUsDefault = voices.find((voice) => voice.lang === "en-US" && voice.default);
    if (enUsDefault) return enUsDefault;
    return voices.find((voice) => voice.default)
      || voices.find((voice) => voice.lang === "en-US")
      || voices.find((voice) => voice.lang.startsWith("en"))
      || voices[0];
  };

  useEffect(() => {
    if (!isVideoInterview) return undefined;

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
  }, [isVideoInterview]);

  const createRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("Microphone access is blocked. Please allow microphone permission in your browser settings.");
        return;
      }
      if (event.error === "service-not-allowed") {
        setError("Speech recognition service is unavailable in this browser/context. Try Chrome on HTTPS or localhost.");
        return;
      }
      setError(`Speech error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    return recognition;
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!window.speechSynthesis) return undefined;

    const updatePreferredVoice = () => {
      preferredVoiceRef.current = getPreferredVoice();
    };

    updatePreferredVoice();
    window.speechSynthesis.onvoiceschanged = updatePreferredVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!voiceEnabled || !currentQuestion) return;
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(`Question ${currentIndex + 1}. ${currentQuestion}`);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion, currentIndex, voiceEnabled]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (facialLoopRef.current) {
        clearInterval(facialLoopRef.current);
      }
    };
  }, []);

  const captureFrame = () => {
    if (!isVideoInterview) return null;
    if (videoRef.current && canvasRef.current) {
      if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) return null;
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      return canvasRef.current.toDataURL("image/jpeg", 0.7).split(",")[1];
    }
    return null;
  };

  const analyzeFacial = async () => {
    if (!isVideoInterview) return;
    if (facialBusyRef.current) return;
    facialBusyRef.current = true;

    try {
      const frameBase64 = captureFrame();
      if (!frameBase64) return;

      const analysis = await analyzeFacialExpression({
        frameBase64,
        question: currentQuestion,
      });

      const sample = {
        ...(analysis.analysis || {}),
        capturedAt: new Date().toISOString(),
      };
      setFacialData(sample);
      facialSamplesRef.current.push(sample);
      setAnalysisCount(facialSamplesRef.current.length);
    } catch (err) {
      console.error("Facial analysis error:", err.message || err);
    } finally {
      facialBusyRef.current = false;
    }
  };

  useEffect(() => {
    if (!isVideoInterview) return undefined;

    if (facialLoopRef.current) clearInterval(facialLoopRef.current);
    facialLoopRef.current = setInterval(() => {
      analyzeFacial();
    }, 3500);

    analyzeFacial();
    return () => {
      if (facialLoopRef.current) clearInterval(facialLoopRef.current);
    };
  }, [currentQuestion, isVideoInterview]);

  const speakFeedback = (text) => {
    if (!voiceEnabled || !text || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = async () => {
    if (isListening) return;

    setError(null);

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition();
      }
      if (!recognitionRef.current) return;

      if (
        window.isSecureContext === false &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        setError("Speech recognition requires HTTPS (or localhost).");
        return;
      }

      if (navigator.permissions?.query) {
        try {
          const permission = await navigator.permissions.query({ name: "microphone" });
          if (permission.state === "denied") {
            setError("Microphone permission denied. Please allow microphone access and try again.");
            return;
          }
        } catch {
          // Permission query is not supported in some browsers.
        }
      }

      recognitionRef.current.start();
    } catch (err) {
      const errorName = err?.name || err?.error || "";
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setError("Microphone permission denied. Please allow microphone access and try again.");
      } else if (errorName === "InvalidStateError") {
        // Recognition may already be starting/running.
      } else {
        setError(err?.message || "Unable to access microphone");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmitAnswer = async () => {
    const answerText = `${transcript}${interimTranscript}`.trim();
    if (!answerText) {
      setError("Please provide an answer before submitting");
      return;
    }

    stopListening();
    if (isVideoInterview) {
      await analyzeFacial();
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitAnswer({
        sessionId: sessionData.sessionId,
        answer: answerText,
        facialData: isVideoInterview
          ? (facialSamplesRef.current.length > 0
            ? facialSamplesRef.current
            : facialData)
          : null,
      });

      if (response.status === "completed") {
        speakFeedback("Interview completed. Great job.");
        onComplete(response);
      } else {
        const feedback = response?.lastEvaluation?.feedback || "";
        if (feedback) {
          setLastSpokenFeedback(feedback);
          speakFeedback(`Feedback for your previous answer: ${feedback}`);
        }

        setCurrentQuestion(response.question);
        setCurrentIndex(response.index);
        setTranscript("");
        setInterimTranscript("");
        setFacialData(null);
        facialSamplesRef.current = [];
        setAnalysisCount(0);
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
          {isVideoInterview ? (
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
          ) : (
            <div
              style={{
                width: 400,
                minHeight: 230,
                borderRadius: 8,
                border: "2px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9fafb",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Voice Interview Mode
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Facial Analysis Display */}
          {isVideoInterview && facialData && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "#f0f9ff",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#064e3b",
              }}
            >
              <p><strong>👁️ Engagement:</strong> {facialData.engagement_level}/10</p>
              <p><strong>😊 Expression:</strong> {facialData.expression}</p>
              <p><strong>👀 Eye Contact:</strong> {facialData.eye_contact}</p>
              <p><strong>📸 Samples:</strong> {analysisCount}</p>
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

          {lastSpokenFeedback && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                backgroundColor: "#eff6ff",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#1e3a8a",
              }}
            >
              <strong>Last Voice Feedback:</strong> {lastSpokenFeedback}
            </div>
          )}

          {/* Transcript */}
          <div className="user-subtitle">
            <strong>Your Answer:</strong>
            <p
              style={{
                marginTop: "10px",
                padding: "12px",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
                minHeight: "80px",
                fontSize: "14px",
                color: transcript || interimTranscript ? "#333" : "#999",
              }}
            >
              {transcript || interimTranscript
                ? `${transcript}${interimTranscript}`
                : "(Your speech will appear here...)"}
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
              onClick={() => setVoiceEnabled((prev) => !prev)}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: voiceEnabled ? "#8b5cf6" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {voiceEnabled ? "🔊 Voice On" : "🔈 Voice Off"}
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !`${transcript}${interimTranscript}`.trim()}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "10px 20px",
                backgroundColor: "#34d399",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: isSubmitting || !`${transcript}${interimTranscript}`.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !`${transcript}${interimTranscript}`.trim() ? 0.6 : 1,
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
            {isVideoInterview ? (
              <>💡 <strong>Tips:</strong> Speak clearly, provide detailed answers with examples. Your facial engagement is being tracked.</>
            ) : (
              <>💡 <strong>Tips:</strong> Speak clearly, provide detailed answers with examples. This is a voice-only interview.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveInterview;
