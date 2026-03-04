import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

<<<<<<< Updated upstream
import DashBoard from './DashBoard'
import InterviewTraining from './InterviewTraining'
import LiveInterview from './LiveInterview'
import InterviewResults from './InterviewResults'
import Quiz from './Quiz'
import LearningResources from './LearningResources'
import CVMaker from './CVMaker'
import CVFiltering from './CVFiltering'
import Achievements from './Achievements'
import ActivityCalendar from './ActivityCalendar'
import LinkedInIntegration from './LinkedInIntegration'
import CareerSuggestions from './CareerSuggestions'
import SkillImprovement from './SkillImprovement'
import DailyMotivation from './DailyMotivation'

function App() {
  // Navigation state
  const [view, setView] = useState('dashboard')
  
  // Interview session state
  const [interviewSessionData, setInterviewSessionData] = useState(null)
  const [currentSessionId, setCurrentSessionId] = useState(null)
=======
// ✅ import auth pages
import Signup from "./signup.jsx";
import Login from "./login.jsx";

// ✅ import your pages
import DashBoard from "./DashBoard";
import InterviewTraining from "./InterviewTraining";
import LiveInterview from "./LiveInterview";
import Quiz from "./Quiz";
import LearningResources from "./LearningResources";
import CVMaker from "./CVMaker";
import CVFiltering from "./CVFiltering";
import Achievements from "./Achievements";
import ActivityCalendar from "./ActivityCalendar";
import LinkedInIntegration from "./LinkedInIntegration";
import CareerSuggestions from "./CareerSuggestions";
import SkillImprovement from "./SkillImprovement";
import DailyMotivation from "./DailyMotivation";

function App() {
  // ✅ Start from login first
  const [view, setView] = useState("login");

  // ✅ SIGNUP
  if (view === "signup") {
    return (
      <Signup
        onSignupSuccess={() => setView("dashboard")}
        onGoToLogin={() => setView("login")}
      />
    );
  }

  // ✅ LOGIN
  if (view === "login") {
    return (
      <Login
        onLoginSuccess={() => setView("dashboard")}
        onGoToSignup={() => setView("signup")}
      />
    );
  }
>>>>>>> Stashed changes

  // ✅ Training Page
  if (view === "training") {
    return (
      <InterviewTraining
<<<<<<< Updated upstream
        onBack={() => setView('dashboard')}
        onStartInterview={(sessionData) => {
          setInterviewSessionData(sessionData)
          setCurrentSessionId(sessionData.sessionId)
          setView('live-interview')
        }}
=======
        onBack={() => setView("dashboard")}
        onStartInterview={() => setView("live-interview")}
>>>>>>> Stashed changes
      />
    );
  }

<<<<<<< Updated upstream
  // 🔹 Live Interview
  if (view === 'live-interview' && interviewSessionData) {
    return (
      <LiveInterview
        sessionData={interviewSessionData}
        onBack={() => {
          setView('training')
          setInterviewSessionData(null)
        }}
        onComplete={(results) => {
          setView('interview-results')
        }}
      />
    )
  }

  // 🔹 Interview Results
  if (view === 'interview-results' && currentSessionId) {
    return (
      <InterviewResults
        sessionId={currentSessionId}
        onBack={() => setView('dashboard')}
        onRestartInterview={() => {
          setInterviewSessionData(null)
          setCurrentSessionId(null)
          setView('training')
        }}
      />
    )
=======
  // ✅ Live Interview
  if (view === "live-interview") {
    return <LiveInterview onBack={() => setView("training")} />;
>>>>>>> Stashed changes
  }

  if (view === "quiz") return <Quiz onBack={() => setView("dashboard")} />;
  if (view === "learning-resources")
    return <LearningResources onBack={() => setView("dashboard")} />;
  if (view === "cv-maker") return <CVMaker onBack={() => setView("dashboard")} />;
  if (view === "cv-filtering")
    return <CVFiltering onBack={() => setView("dashboard")} />;
  if (view === "achievements")
    return <Achievements onBack={() => setView("dashboard")} />;
  if (view === "activity-calendar")
    return <ActivityCalendar onBack={() => setView("dashboard")} />;
  if (view === "linkedin-integration")
    return <LinkedInIntegration onBack={() => setView("dashboard")} />;
  if (view === "career-suggestions")
    return <CareerSuggestions onBack={() => setView("dashboard")} />;
  if (view === "skill-improvement")
    return <SkillImprovement onBack={() => setView("dashboard")} />;
  if (view === "daily-motivation")
    return <DailyMotivation onBack={() => setView("dashboard")} />;

  // ✅ Dashboard (default after login)
  return <DashBoard setView={setView} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);