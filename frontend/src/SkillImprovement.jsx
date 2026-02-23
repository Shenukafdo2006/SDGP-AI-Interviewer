
import React, { useState } from 'react';

const skills = [
  { name: 'React', level: 'Intermediate', progress: 75, target: 90, next: 'Master React Hooks' },
  { name: 'TypeScript', level: 'Beginner', progress: 60, target: 85, next: 'Advanced Type Patterns' },
  { name: 'System Design', level: 'Beginner', progress: 40, target: 80, next: 'Scalability Fundamentals' },
  { name: 'Algorithm & DS', level: 'Intermediate', progress: 55, target: 90, next: 'Dynamic Programming' },
];

const weeklyGoals = [
  { category: 'Coding', goal: 'Complete 5 LeetCode problems', current: 3, total: 5 },
  { category: 'Learning', goal: 'Read 2 technical articles', current: 2, total: 2 },
  { category: 'Interview', goal: 'Practice 1 mock interview', current: 0, total: 1 },
  { category: 'Project', goal: 'Build a side project feature', current: 1, total: 1 },
];

const recommendations = [
  { title: 'Practice System Design', desc: 'Critical skill gap for senior roles', action: 'Take "System Design Course"', level: 'High' },
  { title: 'Improve Algorithm Skills', desc: 'Below target for FAANG interviews', action: 'Solve 2 problems daily', level: 'Medium' },
  { title: 'Learn Cloud Technologies', desc: 'High demand in job market', action: 'Start AWS Fundamentals', level: 'Medium' },
];

const SkillImprovement = () => {
  const [goalProgress, setGoalProgress] = useState(weeklyGoals);

  // Handler to simulate progress update
  const handleGoalClick = (idx) => {
    setGoalProgress(goalProgress.map((g, i) => i === idx && g.current < g.total ? { ...g, current: g.current + 1 } : g));
  };

  return (
    <div className="skill-page">
      <h2 className="section-title">Skill Progress</h2>

<div className="skill-container">
  {skills.map((skill, idx) => (
    <div key={idx} className="skill-card">

      <div className="skill-header">
        <strong>{skill.name}</strong>
        <span className="skill-level">{skill.level}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${skill.progress}%` }}
        ></div>
      </div>

      <div className="skill-footer">
        <span className="next-step">Next: {skill.next}</span>
        <span>Target: {skill.target}%</span>
      </div>

    </div>
  ))}
</div>
      <h2 className="section-title">Weekly Goals</h2>

<div className="goal-container">
  {goalProgress.map((goal, idx) => (
    <div key={idx} className="goal-card">

      <strong>{goal.category}</strong>
      <p>{goal.goal}</p>

      <div className="progress-bar small">
        <div
          className="progress-fill dark"
          style={{ width: `${(goal.current / goal.total) * 100}%` }}
        ></div>
      </div>

      <div className="goal-footer">
        <span>{goal.current}/{goal.total}</span>

        <button
          onClick={() => handleGoalClick(idx)}
          disabled={goal.current >= goal.total}
        >
          Mark as done
        </button>
      </div>

    </div>
  ))}
</div>
     <h2 className="section-title">Personalized Recommendations</h2>
<div className="recommendation-container">
  {recommendations.map((rec, idx) => (
    <div key={idx} className={`recommend-card priority-${rec.level.toLowerCase()}`}>
      <div className="recommend-header">
        <strong>{rec.title}</strong>
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
