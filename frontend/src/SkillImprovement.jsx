import React, { useState, useEffect } from "react";
import "./skillimprovement.css";
import { getUserProgress, updateGoalProgress } from "./api/skillApi";

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
  const [weeklyGoals, setWeeklyGoals] = useState({
    coding: { current: 0, total: 5 },
    learning: { current: 0, total: 2 },
    interview: { current: 0, total: 1 },
    project: { current: 0, total: 1 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uid = localStorage.getItem('uid');

  // Fetch user progress on component mount
  useEffect(() => {
    if (uid) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [uid]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const data = await getUserProgress(uid);
      if (data.goals) {
        setWeeklyGoals(data.goals);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgressAPI = async (category, newCurrent) => {
    try {
      const data = await updateGoalProgress({
        uid,
        category,
        current: newCurrent
      });
      if (data.goals) {
        setWeeklyGoals(data.goals);
      }
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal progress');
    }
  };

  const handleGoalClick = (category) => {
    const currentGoal = weeklyGoals[category];
    if (currentGoal.current < currentGoal.total) {
      updateGoalProgressAPI(category, currentGoal.current + 1);
    }
  };

  const getPriorityClass = (level) => {
    if (level === "High") return "priority-high";
    if (level === "Medium") return "priority-medium";
    return "priority-low";
  };

  // Convert goals object to array for rendering
  const goalsArray = Object.entries(weeklyGoals).map(([category, data]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    goal: getGoalDescription(category),
    current: data.current,
    total: data.total
  }));

  function getGoalDescription(category) {
    const descriptions = {
      coding: "Complete LeetCode problems",
      learning: "Read technical articles",
      interview: "Practice mock interviews",
      project: "Build side project features"
    };
    return descriptions[category] || `${category} tasks`;
  }

  if (loading) {
    return (
      <div className="learning-desktop-container">
        <main className="resources-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading progress data...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-desktop-container">
        <main className="resources-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ color: '#ef4444' }}>{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="learning-desktop-container">
      <aside className="resources-sidebar">
        <button className="back-nav-btn" onClick={onBack}>← Back to Home</button>
        <div className="filter-group">
          <h4>Filter by Priority</h4>
          <label><input type="checkbox" /> High Priority</label>
          <label><input type="checkbox" /> Medium Priority</label>
          <label><input type="checkbox" /> Low Priority</label>
        </div>
        <div className="filter-group">
          <h4>Categories</h4>
          <span className="sidebar-tag">Coding</span>
          <span className="sidebar-tag">Interview</span>
          <span className="sidebar-tag">Projects</span>
        </div>
      </aside>

      <main className="resources-main">
        <header className="desktop-header">
          <div className="header-text">
            <h1>Skill Improvement</h1>
            <p>Track your progress and get personalized recommendations.</p>
          </div>
          <div className="header-stats">
            <div className="stat-box"><span>{goalsArray.filter(g => g.current === g.total).length}</span> Goals Completed</div>
            <div className="stat-box"><span>{recommendations.length}</span> Recommendations</div>
          </div>
        </header>

        <div className="skill-content">
          <section className="skill-section">
            <h2>Weekly Goals</h2>
            <div className="goal-container">
              {goalsArray.map((goal, idx) => {
                const percent = (goal.current / goal.total) * 100;
                return (
                  <div key={idx} className="goal-card">
                    <div className="goal-header">
                      <h4>{goal.category}</h4>
                      <span className="goal-status">{goal.current}/{goal.total} completed</span>
                    </div>
                    <p>{goal.goal}</p>

                    <div className="res-progress-wrap">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <div className="p-bar-bg">
                        <div className="p-bar-fill" style={{ width: `${percent}%`, background: percent === 100 ? '#10B981' : '#6366F1' }} />
                      </div>
                    </div>

                    <button
                      className="goal-action-btn"
                      onClick={() => handleGoalClick(goal.category.toLowerCase())}
                      disabled={goal.current >= goal.total}
                      style={{
                        background: goal.current >= goal.total ? '#10B981' : 'rgba(99, 102, 241, 0.1)',
                        borderColor: goal.current >= goal.total ? '#10B981' : '#6366F1',
                        color: goal.current >= goal.total ? '#fff' : '#6366F1'
                      }}
                    >
                      {goal.current >= goal.total ? '✓ Completed' : 'Mark as Done'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="skill-section">
            <h2>Personalized Recommendations</h2>
            <div className="recommendation-container">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`recommend-card ${getPriorityClass(rec.level)}`}>
                  <div className="recommend-header">
                    <h4>{rec.title}</h4>
                    <span className={`priority-badge ${rec.level.toLowerCase()}`}>{rec.level}</span>
                  </div>
                  <p>{rec.desc}</p>
                  <div className="recommend-action">
                    <span className="action-text">{rec.action}</span>
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recommend-btn"
                      style={{
                        borderColor: rec.level === 'High' ? '#ef4444' : rec.level === 'Medium' ? '#f59e0b' : '#10b981',
                        color: rec.level === 'High' ? '#ef4444' : rec.level === 'Medium' ? '#f59e0b' : '#10b981'
                      }}
                    >
                      Start Learning
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SkillImprovement;