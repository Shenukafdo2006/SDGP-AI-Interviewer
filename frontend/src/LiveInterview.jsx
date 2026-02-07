import React, { useEffect, useRef, useState } from "react";

// Basic mock questions for demo
const QUESTIONS = [
  "Tell me about yourself.",
  "What are your strengths?",
  "Describe a challenge you faced at work.",
];

function LiveInterview({ onBack }) {
  const videoRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Camera setup
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Speech-to-text setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      // Optionally show interim transcript
    };
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div className="live-interview-page">
      <header className="header">
        <div className="menu-icon" onClick={onBack} style={{ cursor: onBack ? "pointer" : "default" }}>←</div>
        <div className="logo">🤖</div>
      </header>
      <div className="interview-main">
        <div className="video-section">
          <video ref={videoRef} autoPlay playsInline style={{ width: 400, borderRadius: 8, border: '2px solid #333' }} />
        </div>
        <div className="subtitle-section">
          <div className="question-subtitle">
            <strong>Question:</strong> {QUESTIONS[questionIdx]}
          </div>
          <div className="user-subtitle">
            <strong>You:</strong> {transcript}
          </div>
          <div style={{ marginTop: 16 }}>
            <button onClick={startListening} disabled={listening}>Start Speaking</button>
            <button onClick={stopListening} disabled={!listening}>Stop</button>
            <button onClick={() => setQuestionIdx((i) => (i + 1) % QUESTIONS.length)}>Next Question</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveInterview;
