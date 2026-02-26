import React, { useState, useEffect } from "react";
import "./Achievements.css";

const userId = "user123";

const defaultStats = [
  { icon: "🏆", label: "Achievements", value: 0 },
  { icon: "🔥", label: "Day Streak", value: 0 },
  { icon: "⚡", label: "Level", value: 1 },
];

const defaultXp = {
  level: 1,
  current: 0,
  total: 1000,
  title: "Career Starter",
  icon: "⚡",
};

const Achievements = () => {
  const [stats, setStats] = useState(defaultStats);
  const [xp, setXp] = useState(defaultXp);
  const [achievements, setAchievements] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();

      setStats(data.stats || defaultStats);
      setXp(data.xp || defaultXp);
      setAchievements(data.achievements || []);
      setCourses(data.courses || []); // new
    } catch (err) {
      console.error("Error fetching user data:", err);
      setStats(defaultStats);
      setXp(defaultXp);
      setAchievements([]);
      setCourses([]);
    }
  };

  // Unlock course or mark complete
  const handleCourseProgress = async (course) => {
    if (course.completed) return;

    const progress = course.progress
      ? { current: course.progress.total, total: course.progress.total }
      : null;

    try {
      await fetch(
        `http://localhost:5000/api/user/${userId}/course/${course.name}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true, progress }),
        }
      );
      fetchUserData();
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  const handleUnlockAchievement = async (ach) => {
    if (ach.unlocked) return;

    const progress = ach.progress
      ? { current: ach.progress.total, total: ach.progress.total }
      : null;

    try {
      await fetch(
        `http://localhost:5000/api/user/${userId}/achievement/${ach.name}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unlocked: true, progress }),
        }
      );
      fetchUserData();
    } catch (err) {
      console.error("Error updating achievement:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

      {/* Courses */}
      <div className="courses-grid">
        {courses.map((course, idx) => {
          const progressPercent =
            course.progress &&
            (course.progress.current / course.progress.total) * 100;

          return (
            <div
              key={idx}
              className={`course-card ${
                course.completed ? "completed" : "in-progress"
              }`}
              onClick={() => handleCourseProgress(course)}
              style={{
                borderColor: course.completed ? "#22c55e" : "#e5e7eb",
              }}
            >
              <div className="course-name">{course.name}</div>
              <div className="course-desc">{course.desc}</div>

              {course.completed ? (
                <div className="badge completed-badge">Completed</div>
              ) : (
                <>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="badge locked-badge">
                    {course.progress?.current}/{course.progress?.total}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="achievements-grid">
        {achievements.map((ach, idx) => {
          const progressPercent =
            ach.progress && (ach.progress.current / ach.progress.total) * 100;

          return (
            <div
              key={idx}
              className={`achievement-card ${
                ach.unlocked ? "unlocked" : "locked"
              }`}
              onClick={() => handleUnlockAchievement(ach)}
              style={{ borderColor: ach.unlocked ? ach.color : "#e5e7eb" }}
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
                  {ach.progress && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                  <div className="badge locked-badge">
                    {ach.progress?.current}/{ach.progress?.total}
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