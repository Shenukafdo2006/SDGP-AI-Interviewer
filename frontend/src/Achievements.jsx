import React from "react";
import "./Achievements.css";



const stats = [
  { icon: "🏆", label: "Achievements", value: 4 },
  { icon: "🔥", label: "Day Streak", value: 15 },
  { icon: "⚡", label: "Level", value: 10 },
];

const xp = {
  icon: "🏆",
  level: 10,
  current: 800,
  total: 1000,
  title: "Career Achiever",
};

const achievements = [
  {
    name: "First Interview",
    desc: "Completed your first mock interview",
    unlocked: true,
    date: "2024-10-15",
    color: "#a020f0",
    icon: "🔒",
  },
  {
    name: "Quiz Master",
    desc: "Scored 100% on 5 quizzes",
    unlocked: true,
    date: "2024-10-22",
    color: "#ffa500",
    icon: "🏆",
  },
  {
    name: "Week Warrior",
    desc: "Maintained a 7-day learning streak",
    unlocked: true,
    date: "2024-10-28",
    color: "#ff0066",
    icon: "🔥",
  },
  {
    name: "CV Creator",
    desc: "Created and downloaded your CV",
    unlocked: true,
    date: "2024-11-01",
    color: "#a020f0",
    icon: "📄",
  },
  {
    name: "Knowledge Seeker",
    desc: "Read 20 learning resources",
    unlocked: false,
    progress: { current: 12, total: 20 },
    color: "#3b82f6",
    icon: "⚡",
  },
  {
    name: "Perfect Score",
    desc: "Get 90%+ on 10 interviews",
    unlocked: false,
    progress: { current: 3, total: 10 },
    color: "#22c55e",
    icon: "⭕",
  },
];

const Achievements = () => {
  return (
    <div className="achievements-page">
      {/* Stats */}
      <div className="stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* XP */}
      <div className="xp-card">
        <div className="xp-icon">{xp.icon}</div>
        <div className="xp-level">Level {xp.level}</div>
        <div className="xp-title">{xp.title}</div>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${(xp.current / xp.total) * 100}%` }}
          />
          <span className="xp-text">
            {xp.current}/{xp.total} XP
          </span>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-grid">
        {achievements.map((ach, idx) => {
          const progressPercent =
            ach.progress &&
            (ach.progress.current / ach.progress.total) * 100;

          return (
            <div
              key={idx}
              className={`achievement-card ${
                ach.unlocked ? "unlocked" : "locked"
              }`}
              style={{
                borderColor: ach.unlocked ? ach.color : "#e5e7eb",
              }}
            >
              <div
                className="achievement-icon"
                style={{ background: ach.color }}
              >
                {ach.icon}
              </div>

              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-desc">{ach.desc}</div>

              {ach.unlocked ? (
                <div className="badge unlocked-badge">
                  Unlocked {ach.date}
                </div>
              ) : (
                <>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="badge locked-badge">
                    {ach.progress.current}/{ach.progress.total}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
