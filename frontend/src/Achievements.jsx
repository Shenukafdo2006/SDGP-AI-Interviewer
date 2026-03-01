import React, { useState } from "react";
import "./Achievements.css";

const initialStats = [
  { icon: "🏆", label: "Achievements", value: 0 },
  { icon: "🔥", label: "Day Streak",   value: 0 },
  { icon: "⚡",  label: "Level",       value: 0 },
];

const initialXp = {
  level: 0,
  current: 0,
  total: 1000,
  title: "Career Achiever",
  icon: "⚡",
};

const defaultAchievements = [
  { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
  { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
  { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
  { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
  { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
  { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
];

function hexAlpha(hex, alpha) {
  const safeHex = hex && hex.startsWith("#") && hex.length >= 7 ? hex : "#6366f1";
  const r = parseInt(safeHex.slice(1, 3), 16);
  const g = parseInt(safeHex.slice(3, 5), 16);
  const b = parseInt(safeHex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Achievements = () => {
  const [stats,        setStats]        = useState(initialStats);
  const [xp,           setXp]           = useState(initialXp);
  const [achievements, setAchievements] = useState(defaultAchievements);
  const [bumpAch,      setBumpAch]      = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(null);

  const clickAchievement = (ach) => {
    if (ach.unlocked) return;

    setAchievements((prev) => prev.map((a) => a.name === ach.name ? { ...a, unlocked: true } : a));
    setStats((prev) => prev.map((s) => s.label === "Achievements" ? { ...s, value: s.value + 1 } : s));
    setXp((prev) => {
      let { current, level, total, ...rest } = prev;
      current += ach.xp;
      while (current >= total) { current -= total; level += 1; total += 500; }
      return { ...rest, current, level, total };
    });
    setBumpAch(true);
    setJustUnlocked(ach.name);
    setTimeout(() => setBumpAch(false), 500);
    setTimeout(() => setJustUnlocked(null), 450);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const xpPct = Math.min((xp.current / xp.total) * 100, 100);

  return (
    <div className="ach-page">
      <div className="ach-header">
        <h1>Your Achievements</h1>
        <p>{unlockedCount} of {achievements.length} unlocked</p>
      </div>

      <div className="ach-stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="ach-stat-card">
            <span className="ach-stat-icon">{stat.icon}</span>
            <span className={`ach-stat-value${stat.label === "Achievements" && bumpAch ? " bump" : ""}`}>
              {stat.value}
            </span>
            <span className="ach-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="ach-xp-card">
        <div className="ach-xp-top">
          <div className="ach-xp-emoji">{xp.icon}</div>
          <div>
            <div className="ach-xp-level">Level {xp.level}</div>
            <div className="ach-xp-title">{xp.title}</div>
          </div>
        </div>
        <div className="ach-xp-bar-wrap">
          <div className="ach-xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="ach-xp-numbers">
          <span>{xp.current} XP earned</span>
          <span className="xp-highlight">{xp.total - xp.current} XP to next level</span>
        </div>
      </div>

      <div className="ach-section-title">Achievements</div>
      <div className="ach-grid">
        {achievements.map((ach, idx) => (
          <div
            key={idx}
            className={`ach-card ${ach.unlocked ? "unlocked" : "locked"} ${justUnlocked === ach.name ? "just-unlocked" : ""}`}
            style={{
              "--c-bg":      hexAlpha(ach.color, 0.08),
              "--c-border":  hexAlpha(ach.color, 0.35),
              "--c-glow":    hexAlpha(ach.color, 0.14),
              "--c-icon-bg": hexAlpha(ach.color, 0.2),
              "--c-btn-bg":  `linear-gradient(135deg, ${hexAlpha(ach.color, 0.85)}, ${ach.color})`,
            }}
            onClick={() => clickAchievement(ach)}
          >
            <div className="ach-card-icon-wrap">{ach.icon}</div>
            <div className="ach-card-name">{ach.name}</div>
            <div className="ach-card-desc">{ach.desc}</div>
            <div className="ach-card-xp" style={{ color: ach.unlocked ? ach.color : "#334155" }}>
              +{ach.xp} XP
            </div>
            <button
              className={`ach-unlock-btn ${ach.unlocked ? "btn-unlocked" : "btn-locked"}`}
              onClick={(e) => { e.stopPropagation(); clickAchievement(ach); }}
              disabled={ach.unlocked}
            >
              {ach.unlocked ? <><span>✦</span> Unlocked</> : <><span>🔒</span> Locked</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;