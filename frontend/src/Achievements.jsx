import React, { useState } from "react";
import "./Achievements.css";
import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

function generateUserId() {
  return "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

const defaultAchievements = [
  { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
  { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
  { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
  { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
  { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
  { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
];

// XP required per level is always 100
const XP_PER_LEVEL = 100;

const initialXp = {
  level: 0,
  current: 0,
  total: XP_PER_LEVEL,
  title: "Career Achiever",
  icon: "⚡",
};

function hexAlpha(hex, alpha) {
  const safeHex = hex && hex.startsWith("#") && hex.length >= 7 ? hex : "#6366f1";
  const r = parseInt(safeHex.slice(1, 3), 16);
  const g = parseInt(safeHex.slice(3, 5), 16);
  const b = parseInt(safeHex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const Achievements = () => {
  const [userId]       = useState(() => generateUserId());
  const [achievements, setAchievements] = useState(defaultAchievements);
  const [xp,           setXp]           = useState(initialXp);
  const [bumpAch,      setBumpAch]      = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const [saveStatus,   setSaveStatus]   = useState(null);
  const [levelUpAnim,  setLevelUpAnim]  = useState(false);

  const clickAchievement = async (ach) => {
    if (ach.unlocked) return;

    // ── XP Logic ──────────────────────────────────────────────────────────
    // Each achievement fills the bar to 100% then resets and levels up.
    // We animate: first fill bar to 100%, then after short delay reset to 0
    // and increment level.

    const newLevel = xp.level + 1;

    // Step 1: animate bar filling to 100%
    setXp((prev) => ({ ...prev, current: XP_PER_LEVEL }));

    // Step 2: after fill animation, level up and reset bar
    setTimeout(() => {
      setXp({
        level:   newLevel,
        current: 0,
        total:   XP_PER_LEVEL,
        title:   "Career Achiever",
        icon:    "⚡",
      });
      setLevelUpAnim(true);
      setTimeout(() => setLevelUpAnim(false), 700);
    }, 700); // matches CSS transition duration

    // ── UI updates ────────────────────────────────────────────────────────
    setAchievements((prev) =>
      prev.map((a) => (a.name === ach.name ? { ...a, unlocked: true } : a))
    );
    setBumpAch(true);
    setJustUnlocked(ach.name);
    setTimeout(() => setBumpAch(false),     500);
    setTimeout(() => setJustUnlocked(null), 450);

    // ── Save to Firebase ──────────────────────────────────────────────────
    setSaveStatus("saving");
    try {
      const ref  = doc(db, "achievements", userId);
      const snap = await getDoc(ref);

      const xpSnapshot = { level: newLevel, current: 0, total: XP_PER_LEVEL };

      if (!snap.exists()) {
        await setDoc(ref, {
          userId,
          unlockedNames: [ach.name],
          lastUnlocked:  ach.name,
          xp:            xpSnapshot,
          createdAt:     new Date().toISOString(),
          updatedAt:     new Date().toISOString(),
        });
      } else {
        await updateDoc(ref, {
          unlockedNames: arrayUnion(ach.name),
          lastUnlocked:  ach.name,
          xp:            xpSnapshot,
          updatedAt:     new Date().toISOString(),
        });
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error("Firebase save error:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const xpPct         = Math.min((xp.current / xp.total) * 100, 100);

  const stats = [
    { icon: "🏆", label: "Achievements", value: unlockedCount },
    { icon: "🔥", label: "Day Streak",   value: 0 },
    { icon: "⚡",  label: "Level",       value: xp.level },
  ];

  return (
    <div className="ach-page">
      <div className="ach-header">
        <h1>Your Achievements</h1>
        <p>{unlockedCount} of {achievements.length} unlocked</p>
      </div>

      {/* Save status */}
      {saveStatus === "saving" && (
        <div style={{ textAlign: "center", color: "#60a5fa", marginBottom: 12, fontSize: 12 }}>
          💾 Saving achievement...
        </div>
      )}
      {saveStatus === "saved" && (
        <div style={{ textAlign: "center", color: "#34d399", marginBottom: 12, fontSize: 12 }}>
          ✅ Saved to Firebase!
        </div>
      )}
      {saveStatus === "error" && (
        <div style={{ textAlign: "center", color: "#f87171", marginBottom: 12, fontSize: 12 }}>
          ⚠️ Could not save — check your connection.
        </div>
      )}

      {/* Stats row */}
      <div className="ach-stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="ach-stat-card">
            <span className="ach-stat-icon">{stat.icon}</span>
            <span className={`ach-stat-value${stat.label === "Achievements" && bumpAch ? " bump" : ""}${stat.label === "Level" && levelUpAnim ? " bump" : ""}`}>
              {stat.value}
            </span>
            <span className="ach-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* XP card */}
      <div className="ach-xp-card">
        <div className="ach-xp-top">
          <div className="ach-xp-emoji">{xp.icon}</div>
          <div>
            <div className={`ach-xp-level${levelUpAnim ? " level-up" : ""}`}>
              Level {xp.level}
            </div>
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

      {/* Level up flash */}
      {levelUpAnim && (
        <div className="level-up-toast">
          ⚡ Level Up! You reached Level {xp.level}
        </div>
      )}

      {/* Achievements grid */}
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