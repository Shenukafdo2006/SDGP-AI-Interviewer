import React, { useState } from "react";
import "./DailyMotivation.css";

const DailyMotivation = () => {
  // ---------------- INTENTIONS ----------------
  const [intentions, setIntentions] = useState([
    "Practice gratitude for 5 minutes",
    "Move my body for 30 minutes",
    "Connect with someone I care about",
  ]);
  const [newIntention, setNewIntention] = useState("");

  const addIntention = () => {
    if (newIntention.trim() !== "") {
      setIntentions([...intentions, newIntention]);
      setNewIntention("");
    }
  };

  // ---------------- HABITS ----------------
  const [habits, setHabits] = useState([
    { name: "Meditation", streak: 12, completed: false },
    { name: "Reading", streak: 8, completed: true },
    { name: "Exercise", streak: 5, completed: false },
  ]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, streak: 0, completed: false }]);
      setNewHabit("");
    }
  };

  const toggleHabit = (index) => {
    const updated = [...habits];
    updated[index].completed = !updated[index].completed;
    if (!updated[index].completed) updated[index].streak--;
    else updated[index].streak++;
    setHabits(updated);
  };

  // ---------------- VISION ----------------
  const [vision, setVision] = useState("");

  return (
    <div className="motivation-container">
      <div className="header">
        <div className="rise-text">RISE AND SHINE ✨</div>
        <h1>Your Daily Motivation</h1>
        <p>Monday, February 23, 2026</p>
      </div>

      {/* DAILY INTENTIONS */}
      <div className="card intentions-card">
        <h3>🎯 Daily Intentions</h3>

        {intentions.map((item, index) => (
          <div className="intention-item" key={index}>
            <span>○ {item}</span>
            <span className="delete">×</span>
          </div>
        ))}

        <div className="add-row">
          <input
            type="text"
            placeholder="Add a new intention..."
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
          />
          <button onClick={addIntention}>Add</button>
        </div>
      </div>

      {/* BUILD HABITS */}
      <div className="card habits-card">
        <h3>🔥 Build Daily Habits</h3>

        <div className="habit-grid">
          {habits.map((habit, index) => (
            <div key={index} className="habit-item">
              <div className="habit-top">
                <span>{habit.name}</span>
                <span className="streak">🔥 {habit.streak}</span>
              </div>

              <div className="progress-bar">
                <div
                  className={`progress ${habit.completed ? "active" : ""}`}
                ></div>
              </div>

              <button onClick={() => toggleHabit(index)}>
                {habit.completed ? "✓ Completed Today" : "Mark Done"}
              </button>
            </div>
          ))}
        </div>

        <div className="add-row">
          <input
            type="text"
            placeholder="Add a new habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={addHabit}>Add</button>
        </div>
      </div>

      {/* VISION BOARD */}
      <div className="card vision-card">
        <h3>💭 Your Vision</h3>
        <p>What’s one thing you want to accomplish this month?</p>

        <textarea
          placeholder="Write your vision here..."
          value={vision}
          onChange={(e) => setVision(e.target.value)}
        />

        <button className="save-btn">Save Vision</button>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card gold">
          <h2>7</h2>
          <p>Day Streak 🔥</p>
        </div>

        <div className="stat-card purple">
          <h2>0</h2>
          <p>Goals Done ✅</p>
        </div>

        <div className="stat-card blue">
          <h2>1</h2>
          <p>Quotes Read 📖</p>
        </div>
      </div>

      <div className="footer-text">✨ Make today amazing ✨</div>
    </div>
  );
};

export default DailyMotivation;