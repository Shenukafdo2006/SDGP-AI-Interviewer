
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
    <div className="skill-improvement-page" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 350 }}>
        <h2>Skill Progress</h2>
        {skills.map((skill, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 'bold' }}>{skill.name} <span style={{ fontWeight: 'normal', fontSize: 14 }}>({skill.level})</span></div>
            <div style={{ background: '#eee', borderRadius: 8, height: 12, margin: '6px 0', position: 'relative' }}>
              <div style={{ width: `${skill.progress}%`, background: '#4b0082', height: '100%', borderRadius: 8 }}></div>
              <span style={{ position: 'absolute', right: 8, top: -18, fontSize: 12 }}>{skill.progress}%</span>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>Next: {skill.next} <span style={{ float: 'right' }}>Target: {skill.target}%</span></div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 250 }}>
        <h2>Weekly Goals</h2>
        {goalProgress.map((goal, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 'bold' }}>{goal.category}</div>
            <div style={{ fontSize: 13 }}>{goal.goal}</div>
            <div style={{ background: '#eee', borderRadius: 8, height: 8, margin: '6px 0', position: 'relative' }}>
              <div style={{ width: `${(goal.current / goal.total) * 100}%`, background: '#000', height: '100%', borderRadius: 8 }}></div>
            </div>
            <div style={{ fontSize: 12 }}>{goal.current}/{goal.total}
              <button style={{ marginLeft: 10, fontSize: 11, padding: '2px 8px' }} onClick={() => handleGoalClick(idx)} disabled={goal.current >= goal.total}>Mark as done</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexBasis: '100%', marginTop: 30 }}>
        <h2>Personalized Recommendations</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={{ background: '#f8f0ff', borderRadius: 10, padding: 16, minWidth: 220, boxShadow: '0 2px 8px #eee' }}>
              <div style={{ fontWeight: 'bold', fontSize: 15 }}>{rec.title} <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{rec.level}</span></div>
              <div style={{ fontSize: 13, margin: '6px 0' }}>{rec.desc}</div>
              <button style={{ background: '#4b0082', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 13 }}>{rec.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillImprovement;
