import React, { useState, useEffect } from "react";
import "./skillimprovement.css";

const skills = [
  { name: "React", level: "Intermediate", progress: 75, target: 90, next: "Master React Hooks" },
  { name: "TypeScript", level: "Beginner", progress: 60, target: 85, next: "Advanced Type Patterns" },
  { name: "System Design", level: "Beginner", progress: 40, target: 80, next: "Scalability Fundamentals" },
  { name: "Algorithm & DS", level: "Intermediate", progress: 55, target: 90, next: "Dynamic Programming" },
];

const weeklyGoalsData = [
  { category: "Coding", goal: "Complete 5 LeetCode problems", current: 3, total: 5 },
  { category: "Learning", goal: "Read 2 technical articles", current: 2, total: 2 },
  { category: "Interview", goal: "Practice 1 mock interview", current: 0, total: 1 },
  { category: "Project", goal: "Build a side project feature", current: 1, total: 1 },
];

const recommendations = [
  { title: "Practice System Design", desc: "Critical skill gap for senior roles", action: "Take System Design Course", level: "High" },
  { title: "Improve Algorithm Skills", desc: "Below target for FAANG interviews", action: "Solve 2 problems daily", level: "Medium" },
  { title: "Learn Cloud Technologies", desc: "High demand in job market", action: "Start AWS Fundamentals", level: "Medium" },
];

const SkillImprovement = ({onBack}) => {

  const [animatedSkills, setAnimatedSkills] = useState(
    skills.map(skill => ({ ...skill, animatedProgress: 0 }))
  );

  const [weeklyGoals, setWeeklyGoals] = useState(weeklyGoalsData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSkills(
        skills.map(skill => ({ ...skill, animatedProgress: skill.progress }))
      );
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

      <h2 className="section-title">Skill Progress</h2>

      <div className="skill-container">
        {animatedSkills.map((skill, idx) => (
          <div key={idx} className="skill-card">
            <div className="skill-header">
              <h4>{skill.name}</h4>
              <span className="skill-level">{skill.level}</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${skill.animatedProgress}%` }}
              ></div>
            </div>

            <div className="skill-footer">
              <span>{skill.animatedProgress}%</span>
              <span>Target: {skill.target}%</span>
            </div>

            <p className="next-step">Next: {skill.next}</p>
          </div>
        ))}
      </div>

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
            <button>{rec.action}</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SkillImprovement;