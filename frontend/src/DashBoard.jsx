import "./DashBoard.css";
import { useState } from "react";
import InterviewTraining from "./InterviewTraining";

function NavItem({ children, onClick }) {
  return (
    <button className="nav-item" onClick={onClick} aria-label={typeof children === 'string' ? children : 'nav'}>
      {children}
    </button>
  );
}

function DashBoard() {
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (view === "training") {
    return <InterviewTraining onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <button className="menu" onClick={() => setSidebarOpen((s) => !s)} aria-expanded={sidebarOpen} aria-label="Toggle menu">☰</button>
        <div className="brand">
          <div className="logo-circle">REVOLVE</div>
        </div>
        <div className="profile">
          <div className="avatar">U</div>
          <div className="username">User</div>
        </div>
      </header>

      <div className={`layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="avatar-lg">U</div>
            <div className="user-info">
              <div className="name">Welcome, User</div>
              <div className="role">SDE Candidate</div>
            </div>
          </div>
          <nav className="nav">
            <NavItem onClick={() => setView('dashboard')}>Dashboard</NavItem>
            <NavItem onClick={() => setView('training')}>Interview Training</NavItem>
            <NavItem onClick={() => alert('Quizzes - placeholder')}>Quizzes</NavItem>
            <NavItem onClick={() => alert('CV Upload - placeholder')}>CV</NavItem>
          </nav>
        </aside>

        <main className="container">
          <section className="hero card">
            <div className="hero-left">
              <h1>Welcome Back, User!</h1>
              <p className="next">Next: Technical Round - SDE Role</p>
              <div className="progress-wrap">
                <div className="progress-label">Overall Progress</div>
                <div className="progress-bar" role="progressbar" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-fill" style={{width:'78%'}}></div>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <button className="cta" onClick={() => setView('training')}>Continue Learning</button>
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
                <div className="badges">
                  <span className="badge">DS</span>
                  <span className="badge">Algo</span>
                  <span className="badge">Sys</span>
                </div>
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
              <button className="action bar blue" onClick={() => setView('training')}>Start Mock Interview</button>
              <button className="action bar pink" onClick={() => alert('Skills Quiz - placeholder')}>Take Skills Quiz</button>
              <button className="action bar green" onClick={() => alert('Upload CV - placeholder')}>Upload/Update CV</button>
            </div>
          </section>

          <footer className="footer card">
            <div>Need help? <a href="#">Contact Support</a></div>
            <div className="small">Version 0.1</div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default DashBoard;
