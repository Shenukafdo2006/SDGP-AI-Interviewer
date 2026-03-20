import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Signup from "./signup.jsx";
import Login from "./login.jsx";

import DashBoard from "./DashBoard";
import InterviewTraining from "./InterviewTraining";
import LiveInterview from "./LiveInterview";
import InterviewResults from "./InterviewResults";
import Quiz from "./Quiz";
import LearningResources from "./LearningResources";
import CVMaker from "./CVMaker";
import CVFiltering from "./CVFiltering";
import Achievements from "./Achievements";
import ActivityCalendar from "./ActivityCalendar";
import CareerSuggestions from "./CareerSuggestions";
import SkillImprovement from "./SkillImprovement";
import DailyMotivation from "./DailyMotivation";

function App() {

  const [view, setView] = useState(null); // null = still checking auth

  // Interview session state
  const [interviewSessionData, setInterviewSessionData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid"); // persists forever

    if (uid) {
      setView("dashboard");
    } else {
      // New tab OR not logged in → always show login
      setView("login");
    }
  }, []);

  // Use navigate() instead of setView() — saves page to sessionStorage
  const navigate = (newView) => {
    sessionStorage.setItem("view", newView);
    setView(newView);
  };

  // Still checking → brief loading screen
  if (view === null) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        fontFamily: "sans-serif",
        fontSize: "14px",
        opacity: 0.5,
      }}>
        Loading...
      </div>
    );
  }

  // Signup Page
  if (view === "signup") {
    return (
      <Signup
        onSignupSuccess={() => navigate("login")}
        onGoToLogin={() => navigate("login")}
      />
    );
  }

  // Login Page
  if (view === "login") {
    return (
      <Login
        onLoginSuccess={() => navigate("dashboard")}
        onGoToSignup={() => navigate("signup")}
      />
    );
  }

  // Training Page
  if (view === "training") {
    return (
      <InterviewTraining
        onBack={() => navigate("dashboard")}
        onStartInterview={(sessionData) => {
          setInterviewSessionData(sessionData);
          setCurrentSessionId(sessionData?.sessionId || null);
          navigate("live-interview");
        }}
      />
    );
  }

  // Live Interview
  if (view === "live-interview" && interviewSessionData) {
    return (
      <LiveInterview
        sessionData={interviewSessionData}
        onBack={() => {
          navigate("training");
          setInterviewSessionData(null);
        }}
        onComplete={() => {
          navigate("interview-results");
        }}
      />
    );
  }

  // Interview Results
  if (view === "interview-results" && currentSessionId) {
    return (
      <InterviewResults
        sessionId={currentSessionId}
        onBack={() => {
          navigate("dashboard");
          setInterviewSessionData(null);
          setCurrentSessionId(null);
        }}
        onRestartInterview={() => {
          setInterviewSessionData(null);
          setCurrentSessionId(null);
          navigate("training");
        }}
      />
    );
  }

  if (view === "quiz") {
    return <Quiz onBack={() => navigate("dashboard")} />;
  }

  if (view === "learning-resources") {
    return <LearningResources onBack={() => navigate("dashboard")} />;
  }

  if (view === "cv-maker") {
    return <CVMaker onBack={() => navigate("dashboard")} />;
  }

  if (view === "cv-filtering") {
    return <CVFiltering onBack={() => navigate("dashboard")} />;
  }

  if (view === "achievements") {
    return <Achievements onBack={() => navigate("dashboard")} />;
  }

  if (view === "activity-calendar") {
    return <ActivityCalendar onBack={() => navigate("dashboard")} />;
  }

  if (view === "career-suggestions") {
    return <CareerSuggestions onBack={() => navigate("dashboard")} />;
  }

  if (view === "skill-improvement") {
    return <SkillImprovement onBack={() => navigate("dashboard")} />;
  }

  if (view === "daily-motivation") {
    return <DailyMotivation onBack={() => navigate("dashboard")} />;
  }

  // Default dashboard
  return <DashBoard setView={navigate} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
