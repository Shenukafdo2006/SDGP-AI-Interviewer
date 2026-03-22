import React, { useState, useEffect } from "react";
import "./Achievements.css";
import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

const defaultAchievements = [
  { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
  { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
  { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
  { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
  { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
  { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
];

const TOTAL_ACHIEVEMENTS = defaultAchievements.length;

function hexAlpha(hex, alpha) {
  const safeHex = hex && hex.startsWith("#") && hex.length >= 7 ? hex : "#6366f1";
  const r = parseInt(safeHex.slice(1, 3), 16);
  const g = parseInt(safeHex.slice(3, 5), 16);
  const b = parseInt(safeHex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getXpPct(unlockedCount) {
  return Math.min((unlockedCount / TOTAL_ACHIEVEMENTS) * 100, 100);
}

const Achievements = ({ onBack = () => {} }) => {
  const uid = localStorage.getItem("uid");

  const [achievements, setAchievements] = useState(defaultAchievements);
  const [bumpAch, setBumpAch] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAchievements(defaultAchievements);
    setLoading(true);

    if (!uid) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const ref = doc(db, "achievements", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const unlockedNames = data.unlockedNames || [];
          setAchievements(defaultAchievements.map(a => ({
            ...a,
            unlocked: unlockedNames.includes(a.name),
          })));
        } else {
          setAchievements(defaultAchievements.map(a => ({ ...a, unlocked: false })));
        }
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [uid]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const xpPct = getXpPct(unlockedCount);
  const level = unlockedCount;
  const allUnlocked = unlockedCount === TOTAL_ACHIEVEMENTS;

  const clickAchievement = async (ach) => {
    if (ach.unlocked) return;

    if (!uid) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const newUnlockedCount = unlockedCount + 1;
    const newLevel = newUnlockedCount;
    const prevLevel = unlockedCount;

    setAchievements((prev) =>
      prev.map((a) => (a.name === ach.name ? { ...a, unlocked: true } : a))
    );
    setBumpAch(true);
    setJustUnlocked(ach.name);
    setTimeout(() => setBumpAch(false), 500);
    setTimeout(() => setJustUnlocked(null), 450);

    if (newLevel > prevLevel) {
      setLevelUpAnim(true);
      setTimeout(() => setLevelUpAnim(false), 700);
    }

    setSaveStatus("saving");
    try {
      const ref = doc(db, "achievements", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          uid,
          unlockedNames: [ach.name],
          lastUnlocked: ach.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await updateDoc(ref, {
          unlockedNames: arrayUnion(ach.name),
          lastUnlocked: ach.name,
          updatedAt: new Date().toISOString(),
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

  const stats = [
    {
      icon: "🏆",
      label: "Achievements",
      value: `${unlockedCount}/${TOTAL_ACHIEVEMENTS}`,
      className: "achievements-card",
    },
    {
      icon: "⚡",
      label: "Level",
      value: level,
      className: "level-card",
    },
  ];

  if (loading) {
    return (
      <div className="ach-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ color: "#94a3b8", fontSize: 18 }}>Loading achievements...</div>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="ach-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ color: "#f87171", fontSize: 18 }}>⚠️ Please log in to view achievements.</div>
      </div>
    );
  }

  return (
    <div className="ach-page">
      <div className="ach-back-btn-wrap">
        <button className="ach-back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="ach-header">
        <h1>Your Achievements</h1>
        <p>{unlockedCount} of {TOTAL_ACHIEVEMENTS} unlocked</p>
      </div>

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
          ⚠️ {!uid ? "Please log in to save." : "Could not save — check your connection."}
        </div>
      )}

      <div className="ach-stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className={`ach-stat-card ${stat.className}`}>
            <span className="ach-stat-icon">{stat.icon}</span>
            <span className={`ach-stat-value${stat.label === "Achievements" && bumpAch ? " bump" : ""}${stat.label === "Level" && levelUpAnim ? " bump" : ""}`}>
              {stat.value}
            </span>
            <span className="ach-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="ach-xp-card">
        <div className="ach-xp-top">
          <div className="ach-xp-emoji">⚡</div>
          <div>
            <div className={`ach-xp-level${levelUpAnim ? " level-up" : ""}`}>
              Level {level}
            </div>
            <div className="ach-xp-title">
              {allUnlocked ? "🎉 Master Achiever" : "Career Achiever"}
            </div>
          </div>
        </div>
        <div className="ach-xp-bar-wrap">
          <div
            className="ach-xp-bar-fill"
            style={{
              width: `${xpPct}%`,
              transition: "width 0.6s ease",
              background: allUnlocked
                ? "linear-gradient(90deg, #34d399, #22c55e)"
                : undefined,
            }}
          />
        </div>
        <div className="ach-xp-numbers">
          <span>{unlockedCount} / {TOTAL_ACHIEVEMENTS} achievements</span>
          <span className="xp-highlight">
            {allUnlocked ? "🏅 All unlocked!" : `${TOTAL_ACHIEVEMENTS - unlockedCount} remaining`}
          </span>
        </div>
      </div>

      {levelUpAnim && (
        <div className="level-up-toast">
          ⚡ Level Up! You reached Level {level}
        </div>
      )}

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
