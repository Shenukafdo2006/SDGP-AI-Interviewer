
import { StrictMode, useState } from "react";
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

  // Start from login page
  const [view, setView] = useState("login");

  // Interview session state
  const [interviewSessionData, setInterviewSessionData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);


  // Signup Page
  if (view === "signup") {
    return (
      <Signup
        onSignupSuccess={() => setView("login")}
        onGoToLogin={() => setView("login")}
      />
    );
  }

  // Login Page
  if (view === "login") {
    return (
      <Login
        onLoginSuccess={() => setView("dashboard")}
        onGoToSignup={() => setView("signup")}
      />
    );
  }

  // Training Page
  if (view === "training") {
    return (
      <InterviewTraining
        onBack={() => setView("dashboard")}
        onStartInterview={(sessionData) => {
          setInterviewSessionData(sessionData);
          setCurrentSessionId(sessionData?.sessionId || null);
          setView("live-interview");
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
          setView("training");
          setInterviewSessionData(null);
        }}
        onComplete={() => {
          setView("interview-results");
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
          setView("dashboard");
          setInterviewSessionData(null);
          setCurrentSessionId(null);
        }}
        onRestartInterview={() => {
          setInterviewSessionData(null);
          setCurrentSessionId(null);
          setView("training");
        }}
      />
    );
  }

  if (view === "quiz") {
    return <Quiz onBack={() => setView("dashboard")} />;
  }

  if (view === "learning-resources") {
    return <LearningResources onBack={() => setView("dashboard")} />;
  }

  if (view === "cv-maker") {
    return <CVMaker onBack={() => setView("dashboard")} />;
  }

  if (view === "cv-filtering") {
    return <CVFiltering onBack={() => setView("dashboard")} />;
  }

  if (view === "achievements") {
    return <Achievements onBack={() => setView("dashboard")} />;
  }

  if (view === "activity-calendar") {
    return <ActivityCalendar onBack={() => setView("dashboard")} />;
  }


  if (view === "career-suggestions") {
    return <CareerSuggestions onBack={() => setView("dashboard")} />;
  }

  if (view === "skill-improvement") {
    return <SkillImprovement onBack={() => setView("dashboard")} />;
  }

  if (view === "daily-motivation") {
    return <DailyMotivation onBack={() => setView("dashboard")} />;
  }

  // Default dashboard
  return <DashBoard setView={setView} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

