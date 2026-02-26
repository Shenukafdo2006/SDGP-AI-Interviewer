import React, { useState, useEffect } from "react";
import "./Achievements.css";

const API = "http://localhost:5000";

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
  { name: "First Interview",  desc: "Completed your first mock interview", color: "#a855f7", icon: "🎤", xp: 50,  unlocked: false },
  { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#f59e0b", icon: "🏆", xp: 70,  unlocked: false },
  { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#ef4444", icon: "🔥", xp: 60,  unlocked: false },
  { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#8b5cf6", icon: "📄", xp: 40,  unlocked: false },
  { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#3b82f6", icon: "📚", xp: 80,  unlocked: false },
  { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#22c55e", icon: "⭐", xp: 90,  unlocked: false },
];

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Achievements = () => {
  const [stats,        setStats]        = useState(initialStats);
  const [xp,           setXp]           = useState(initialXp);
  const [achievements, setAchievements] = useState(defaultAchievements);
  const [courses,      setCourses]      = useState([]);
  const [bumpAch,      setBumpAch]      = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const userId = "user123";

  useEffect(() => {
    fetch(`${API}/api/user/${userId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setStats(data.stats               || initialStats);
        setXp(data.xp                     || initialXp);
        setAchievements(data.achievements || defaultAchievements);
        setCourses(data.courses           || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not connect to server. Showing local data.");
        setLoading(false);
      });
  }, []);

  const clickAchievement = async (ach) => {
    if (ach.unlocked) return;

    setAchievements((prev) =>
      prev.map((a) => (a.name === ach.name ? { ...a, unlocked: true } : a))
    );
    setStats((prev) =>
      prev.map((s) =>
        s.label === "Achievements" ? { ...s, value: s.value + 1 } : s
      )
    );
    setXp((prev) => {
      let c = prev.current + ach.xp, l = prev.level, t = prev.total;
      if (c >= t) { l++; c -= t; t += 500; }
      return { ...prev, current: c, level: l, total: t };
    });
    setBumpAch(true);
    setTimeout(() => setBumpAch(false), 500);

    try {
      const res = await fetch(
        `${API}/api/user/${userId}/achievement/${encodeURIComponent(ach.name)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unlocked: true }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.xp)    setXp(data.xp);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error(err);
      setAchievements((prev) =>
        prev.map((a) => (a.name === ach.name ? { ...a, unlocked: false } : a))
      );
      setStats((prev) =>
        prev.map((s) =>
          s.label === "Achievements" ? { ...s, value: Math.max(0, s.value - 1) } : s
        )
      );
    }
  };

  const clickCourse = async (course) => {
    if (course.unlocked) return;

    setCourses((prev) =>
      prev.map((c) => (c.name === course.name ? { ...c, unlocked: true } : c))
    );
    setXp((prev) => {
      let c = prev.current + (course.xp || 50), l = prev.level, t = prev.total;
      if (c >= t) { l++; c -= t; t += 500; }
      return { ...prev, current: c, level: l, total: t };
    });

    try {
      const res = await fetch(
        `${API}/api/user/${userId}/course/${encodeURIComponent(course.name)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unlocked: true }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.course) {
        setCourses((prev) =>
          prev.map((c) =>
            c.name === course.name ? { ...c, ...data.course, unlocked: true } : c
          )
        );
      }
      if (data.xp)    setXp(data.xp);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error(err);
      setCourses((prev) =>
        prev.map((c) => (c.name === course.name ? { ...c, unlocked: false } : c))
      );
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="ach-page">
      {error && <div className="ach-error-banner">⚠️ {error}</div>}

      {loading ? (
        <div className="ach-loading">Loading achievements…</div>
      ) : (
        <>
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
            <div className="ach-xp-icon">{xp.icon}</div>
            <div className="ach-xp-level">Level {xp.level}</div>
            <div className="ach-xp-title">{xp.title}</div>
            <div className="ach-xp-bar">
              <div
                className="ach-xp-fill"
                style={{ width: `${Math.min((xp.current / xp.total) * 100, 100)}%` }}
              />
              <span className="ach-xp-text">{xp.current} / {xp.total} XP</span>
            </div>
          </div>

          <h2 className="ach-section-title">Achievements ({unlockedCount}/{achievements.length})</h2>
          <div className="ach-grid">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`ach-card ${ach.unlocked ? "unlocked" : "locked"}`}
                style={{ "--c": ach.color, "--c-bg": hexAlpha(ach.color, 0.22) }}
                onClick={() => clickAchievement(ach)}
                title={ach.unlocked ? "✓ Achieved!" : "Click to unlock"}
              >
                <div className="ach-card-icon">{ach.icon}</div>
                <div className="ach-card-name">{ach.name}</div>
                <div className="ach-card-desc">{ach.desc}</div>
                <div className="ach-card-xp">+{ach.xp} XP</div>
              </div>
            ))}
          </div>

          {courses.length > 0 && (
            <>
              <h2 className="ach-section-title">Courses</h2>
              <div className="ach-grid">
                {courses.map((course, idx) => (
                  <div
                    key={idx}
                    className={`ach-card ${course.unlocked ? "unlocked" : "locked"}`}
                    style={{ "--c": course.color || "#6366f1", "--c-bg": hexAlpha(course.color || "#6366f1", 0.22) }}
                    onClick={() => clickCourse(course)}
                    title={course.unlocked ? "✓ Unlocked!" : "Click to unlock"}
                  >
                    <div className="ach-card-icon">{course.icon}</div>
                    <div className="ach-card-name">{course.name}</div>
                    <div className="ach-card-desc">{course.desc}</div>
                    <div className="ach-card-xp">+{course.xp || 50} XP</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Achievements;