import React from 'react';
import './LearningResources.css';

const resources = [
  { id: 1, title: 'W3Schools - Learn Web Development', provider: 'W3Schools', tags: ['HTML', 'CSS', 'JavaScript'], level: 'Beginner', rating: 4.5, progress: 0, color: "#04AA6D", duration: "Self-Paced", link: "https://www.w3schools.com/" },
  { id: 2, title: 'freeCodeCamp - Complete Courses', provider: 'freeCodeCamp', tags: ['Web Dev', 'Python', 'JavaScript'], level: 'Beginner', rating: 4.9, progress: 0, color: "#2563EB", duration: "Self-Paced", link: "https://www.freecodecamp.org/" },
  { id: 3, title: 'SoloLearn - Interactive Learning', provider: 'SoloLearn', tags: ['JavaScript', 'Python', 'C++'], level: 'Beginner', rating: 4.7, progress: 0, color: "#13C44E", duration: "Self-Paced", link: "https://www.sololearn.com/" },
  { id: 4, title: 'Programiz - Learn Programming', provider: 'Programiz', tags: ['Java', 'Python', 'C'], level: 'Beginner', rating: 4.6, progress: 0, color: "#E34C26", duration: "Self-Paced", link: "https://www.programiz.com/" },
  { id: 5, title: 'Mozilla Developer Network', provider: 'Mozilla', tags: ['Web Standards', 'JavaScript', 'CSS'], level: 'Intermediate', rating: 4.8, progress: 0, color: "#FF9500", duration: "Self-Paced", link: "https://developer.mozilla.org/" },
  { id: 6, title: 'GeeksforGeeks - Programming Tutorials', provider: 'GeeksforGeeks', tags: ['Algorithms', 'Data Structures', 'Java'], level: 'Intermediate', rating: 4.7, progress: 0, color: "#0F9D58", duration: "Self-Paced", link: "https://www.geeksforgeeks.org/" },
  { id: 7, title: 'Codecademy - Interactive Coding', provider: 'Codecademy', tags: ['Python', 'JavaScript', 'SQL'], level: 'Beginner', rating: 4.6, progress: 0, color: "#FF6B35", duration: "Self-Paced", link: "https://www.codecademy.com/" },
  { id: 8, title: 'Khan Academy - Computer Science', provider: 'Khan Academy', tags: ['Python', 'JavaScript', 'Algorithms'], level: 'Beginner', rating: 4.8, progress: 0, color: "#14B866", duration: "Self-Paced", link: "https://www.khanacademy.org/computing" },
  { id: 9, title: 'LeetCode - Coding Interview Prep', provider: 'LeetCode', tags: ['Algorithms', 'Data Structures', 'Interview'], level: 'Advanced', rating: 4.9, progress: 0, color: "#FFA116", duration: "Self-Paced", link: "https://leetcode.com/" },
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

                <a
                  className="d-view-btn"
                  style={{ borderColor: res.color, color: res.color }}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {res.progress > 0 ? 'Continue' : 'Start Course'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearningResources;
