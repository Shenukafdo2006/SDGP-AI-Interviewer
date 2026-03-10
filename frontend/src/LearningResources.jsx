import React from 'react';
import './LearningResources.css';

const resources = [
  { id: 1, title: 'Complete Web Development Bootcamp', provider: 'Online Academy', tags: ['HTML', 'React', 'Node'], level: 'Beginner', rating: 4.8, progress: 65, color: "#6366F1", duration: "45h 30m" },
  { id: 2, title: 'Advanced React Patterns', provider: 'React Masters', tags: ['React', 'TypeScript'], level: 'Advanced', rating: 4.9, progress: 30, color: "#8B5CF6", duration: "12h 15m" },
  { id: 3, title: 'System Design Interview Prep', provider: 'Tech Pro', tags: ['Cloud', 'Architecture'], level: 'Intermediate', rating: 4.7, progress: 10, color: "#10B981", duration: "20h 00m" },
  { id: 4, title: 'UI/UX Principles for Devs', provider: 'Design School', tags: ['Figma', 'CSS'], level: 'Beginner', rating: 4.6, progress: 0, color: "#F59E0B", duration: "08h 45m" },
];

const LearningResources = ({ onBack }) => {
  return (
    <div className="learning-desktop-container">
      <aside className="resources-sidebar">
        <button className="back-nav-btn" onClick={onBack}>← Back to Home</button>
        <div className="filter-group">
          <h4>Filter by Level</h4>
          <label><input type="checkbox" /> Beginner</label>
          <label><input type="checkbox" /> Intermediate</label>
          <label><input type="checkbox" /> Advanced</label>
        </div>
        <div className="filter-group">
          <h4>Categories</h4>
          <span className="sidebar-tag">Web Dev</span>
          <span className="sidebar-tag">DevOps</span>
          <span className="sidebar-tag">Mobile</span>
        </div>
      </aside>

      <main className="resources-main">
        <header className="desktop-header">
          <div className="header-text">
            <h1>Learning Path</h1>
            <p>Welcome back! You have 3 courses in progress.</p>
          </div>
          <div className="header-stats">
            <div className="stat-box"><span>12</span> Courses</div>
            <div className="stat-box"><span>48h</span> Completed</div>
          </div>
        </header>

        <div className="resources-desktop-grid">
          {resources.map((res) => (
            <div key={res.id} className="desktop-res-card">
              <div className="res-banner" style={{ background: `${res.color}22` }}>
                <span className="res-duration">{res.duration}</span>
              </div>
              <div className="res-body">
                <div className="res-meta">
                  <span className="res-lvl" style={{ color: res.color }}>{res.level}</span>
                  <span className="res-rate">★ {res.rating}</span>
                </div>
                <h3>{res.title}</h3>
                <p className="res-prov">by {res.provider}</p>
                
                <div className="res-tags-row">
                  {res.tags.map(tag => <span key={tag} className="d-tag">{tag}</span>)}
                </div>

                <div className="res-progress-wrap">
                  <div className="progress-label"><span>Course Progress</span> <span>{res.progress}%</span></div>
                  <div className="p-bar-bg"><div className="p-bar-fill" style={{ width: `${res.progress}%`, background: res.color }} /></div>
                </div>

                <button className="d-view-btn" style={{ borderColor: res.color, color: res.color }}>
                  {res.progress > 0 ? 'Continue' : 'Start Course'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearningResources;