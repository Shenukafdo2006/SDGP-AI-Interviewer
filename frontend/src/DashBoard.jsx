import "./DashBoard.css";
import { useState } from "react";
import InterviewTraining from "./InterviewTraining";

function DashBoard() {
  const [view, setView] = useState("dashboard");

  if (view === "training") {
    return <InterviewTraining onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="menu">☰</div>
        <div className="brand">
          <div className="logo-circle">REVOLVE</div>
        </div>
        <div className="menu-placeholder" />
      </header>

      <main className="container">
        <section className="hero card">
          <div className="hero-text">
            <h1>Welcome Back, User!</h1>
            <p className="next">Next: Technical Round - SDE Role</p>
          </div>
          <div className="hero-action">
            <button className="cta" onClick={() => setView("training")}>Continue Learning</button>
          </div>
        </section>

        <section className="grid">
          <div className="info card">
            <div className="icon">📈</div>
            <div className="meta">
              <h3>Progress</h3>
              <p className="sub">78% Complete</p>
            </div>
          </div>

          <div className="info card">
            <div className="icon">⭐</div>
            <div className="meta">
              <h3>Achievements</h3>
              <p className="sub">12 Badges</p>
            </div>
          </div>

          <div className="info card">
            <div className="icon">💡</div>
            <div className="meta">
              <h3>Strengths</h3>
              <p className="sub">Data Structures</p>
            </div>
          </div>

          <div className="info card">
            <div className="icon">🎯</div>
            <div className="meta">
              <h3>Focus Areas</h3>
              <p className="sub">System Design</p>
            </div>
          </div>
        </section>

        <section className="quick-actions card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <a className="action bar blue" href="#" onClick={(e)=>{e.preventDefault(); setView("training")}}>Start Mock Interview</a>
            <a className="action bar pink" href="#">Take Skills Quiz</a>
            <a className="action bar green" href="#">Upload/Update CV</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashBoard;
