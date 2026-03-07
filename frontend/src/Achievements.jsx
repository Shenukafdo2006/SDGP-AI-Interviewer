import React, { useState, useEffect } from "react";
import "./Achievements.css";

const USER_ID = "user_123"; // Replace with your real Firebase Auth UID
const API = "http://localhost:5001";

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Achievements = () => {
  const [stats, setStats] = useState([
    { icon: "🏆", label: "Achievements", value: 0 },
    { icon: "🔥", label: "Day Streak", value: 0 },
    { icon: "⚡", label: "Level", value: 0 },
  ]);

  const [xp, setXp] = useState({
    level: 0,
    current: 0,
    total: 1000,
    title: "Career Achiever",
    icon: "⚡",
  });

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlocking, setUnlocking] = useState(null); // track which achievement is being unlocked

  // ── Load user data on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/user/${USER_ID}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setStats(data.stats);
        setXp(data.xp);
        setAchievements(data.achievements);
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError("Failed to load achievements. Is the server running?");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ── Unlock achievement — saves to DB ─────────────────────────────────────────
  const clickAchievement = async (ach) => {
    if (ach.unlocked || unlocking) return;

    try {
      setUnlocking(ach.name);

      const res = await fetch(
        `${API}/api/user/${USER_ID}/achievement/${encodeURIComponent(ach.name)}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();

      // Use server response as source of truth
      setStats(data.stats);
      setXp(data.xp);
      setAchievements(data.achievements);
    } catch (err) {
      console.error("Failed to unlock achievement:", err);
      alert(`Could not unlock achievement: ${err.message}`);
    } finally {
      setUnlocking(null);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const xpPct = xp.total > 0 ? (xp.current / xp.total) * 100 : 0;

  // ── Render states ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ach-page">
        <div className="ach-loading">Loading achievements…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ach-page">
        <div className="ach-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="ach-page">

      <div className="ach-header">
        <h1>Your Achievements</h1>
        <p>{unlockedCount} of {achievements.length} unlocked</p>
      </div>

      <div className="ach-stats-row">
        {stats.map((stat, i) => (
          <div key={i} className="ach-stat-card">
            <span className="ach-stat-icon">{stat.icon}</span>
            <span className="ach-stat-value">{stat.value}</span>
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
          <div
            className="ach-xp-bar-fill"
            style={{ width: `${xpPct}%`, transition: "width 0.6s ease" }}
          />
        </div>

        <div className="ach-xp-numbers">
          <span>{xp.current} XP earned</span>
          <span>{xp.total - xp.current} XP to next level</span>
        </div>
      </div>

      <div className="ach-section-title">Achievements</div>

      <div className="ach-grid">
        {achievements.map((ach, i) => (
          <div
            key={i}
            className={`ach-card ${ach.unlocked ? "unlocked" : "locked"} ${unlocking === ach.name ? "unlocking" : ""}`}
            style={{
              "--c-bg": hexAlpha(ach.color, 0.08),
              "--c-border": hexAlpha(ach.color, 0.35),
            }}
            onClick={() => clickAchievement(ach)}
          >
            <div className="ach-card-icon-wrap">{ach.icon}</div>
            <div className="ach-card-name">{ach.name}</div>
            <div className="ach-card-desc">{ach.desc}</div>
            {ach.xp && (
              <div className="ach-card-xp">+{ach.xp} XP</div>
            )}
            <button
              className="ach-unlock-btn"
              disabled={ach.unlocked || !!unlocking}
            >
              {unlocking === ach.name
                ? "Saving…"
                : ach.unlocked
                ? "Unlocked ✓"
                : "Unlock"}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Achievements;