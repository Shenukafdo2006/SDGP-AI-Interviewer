import React, { useState, useEffect } from "react";
import "./skillimprovement.css";

const weeklyGoalsData = [
  { category: "Coding", goal: "Complete 5 LeetCode problems", current: 3, total: 5 },
  { category: "Learning", goal: "Read 2 technical articles", current: 2, total: 2 },
  { category: "Interview", goal: "Practice 1 mock interview", current: 0, total: 1 },
  { category: "Project", goal: "Build a side project feature", current: 1, total: 1 },
];

const recommendations = [
  { 
    title: "Strengthen Type Script",
    desc: "Improve type safety and scalability",
    action: "Practice Generics & Interfaces",
    level: "Low",
    link: "https://www.codecademy.com/learn/learn-intermediate-type-script-generics?utm_source=chatgpt.com"
  },
  { 
    title: "Mock Interview Practice",
    desc: "Boost confidence for real interviews",
    action: "Schedule Mock Session",
    level: "Low",
    link: "https://www.pramp.com/"
  },
  { 
    title: "Algorithm Skills",
    desc: "Below target for FAANG interviews",
    action: "Solve 2 problems daily",
    level: "Medium",
    link: "https://www.hackerrank.com/domains/algorithms"
  },
  { 
    title: "Learn Cloud Technologies",
    desc: "High demand in job market",
    action: "Start AWS Fundamentals",
    level: "Medium",
    link: "https://aws.amazon.com/training/"
  },
  { 
    title: "Practice System Design",
    desc: "Critical skill gap for senior roles",
    action: "Take System Design Course",
    level: "High",
    link: "https://www.educative.io/courses/grokking-the-system-design-interview"
  },
  { 
    title: "Build Real-world Projects",
    desc: "Projects improve portfolio visibility",
    action: "Create Full-stack App",
    level: "High",
    link: "https://www.freecodecamp.org/learn"
  },
];

const SkillImprovement = ({onBack}) => {

  const [weeklyGoals, setWeeklyGoals] = useState(weeklyGoalsData);

  const handleGoalClick = (idx) => {
    setWeeklyGoals(
      weeklyGoals.map((goal, i) =>
        i === idx && goal.current < goal.total
          ? { ...goal, current: goal.current + 1 }
          : goal
      )
    );
  };

  const getPriorityClass = (level) => {
    if (level === "High") return "priority-high";
    if (level === "Medium") return "priority-medium";
    return "priority-low";
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="skill-page">

      <button 
        className="back-btn" 
        onClick={onBack}
      >
        ← Back Dashboard
      </button>

      <h2 className="section-title">Weekly Goals</h2>

      <div className="goal-container">
        {weeklyGoals.map((goal, idx) => {
          const percent = (goal.current / goal.total) * 100;
          return (
            <div key={idx} className="goal-card">
              <h4>{goal.category}</h4>
              <p>{goal.goal}</p>

              <div className="progress-bar small">
                <div
                  className="progress-fill dark"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <div className="goal-footer">
                <span>{goal.current}/{goal.total}</span>
                <button
                  onClick={() => handleGoalClick(idx)}
                  disabled={goal.current >= goal.total}
                >
                  Mark Done
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="section-title">Personalized Recommendations</h2>

      <div className="recommendation-container">
        {recommendations.map((rec, idx) => (
          <div key={idx} className={`recommend-card ${getPriorityClass(rec.level)}`}>
            <div className="recommend-header">
              <h4>{rec.title}</h4>
              <span>{rec.level}</span>
            </div>
            <p>{rec.desc}</p>
            <a href={rec.link} target="_blank" rel="noopener noreferrer">
              <button>{rec.action}</button>
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SkillImprovement;