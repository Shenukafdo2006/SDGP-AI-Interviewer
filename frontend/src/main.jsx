import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import DashBoard from './DashBoard'
import InterviewTraining from './InterviewTraining'
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
  const [view, setView] = useState('dashboard')

  if (view === 'training') {
    return <InterviewTraining onBack={() => setView('dashboard')} />
  }

  if (view === 'quiz') return <Quiz />
  if (view === 'learning-resources') return <LearningResources />
  if (view === 'cv-maker') return <CVMaker />
  if (view === 'cv-filtering') return <CVFiltering />
  if (view === 'achievements') return <Achievements />
  if (view === 'activity-calendar') return <ActivityCalendar />
  if (view === 'linkedin-integration') return <LinkedInIntegration />
  if (view === 'career-suggestions') return <CareerSuggestions />
  if (view === 'skill-improvement') return <SkillImprovement />
  if (view === 'daily-motivation') return <DailyMotivation />

  return <DashBoard setView={setView} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)