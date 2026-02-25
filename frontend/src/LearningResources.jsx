import React from 'react';
import './LearningResources.css';

const resources = [
  { id: 1, title: 'Web Development Bootcamp', provider: 'Online Academy', tags: ['HTML', 'React'], level: 'Beginner', rating: 4.8, progress: 65, color: "#6366F1" },
  { id: 2, title: 'Advanced React Patterns', provider: 'React Masters', tags: ['React', 'TS'], level: 'Advanced', rating: 4.9, progress: 30, color: "#8B5CF6" },
  { id: 3, title: 'System Design Prep', provider: 'Tech Pro', tags: ['Cloud', 'Scale'], level: 'Intermediate', rating: 4.7, progress: 10, color: "#10B981" },
];

const LearningResources = ({ onBack }) => {
  return (
    <div className="learning-resources-page">
      <header className="resources-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-content">
          <h1>📚 Learning Path</h1>
          <p>Curated materials to bridge your skill gaps.</p>
        </div>
      </header>

      <div className="resources-grid">
        {resources.map((res) => (
          <div key={res.id} className="resource-card">
            <div className="card-top">
              <span className="res-level" style={{ color: res.color }}>{res.level}</span>
              <span className="res-rating">★ {res.rating}</span>
            </div>
            <h3>{res.title}</h3>
            <p className="res-provider">{res.provider}</p>
            
            <div className="res-tags">
              {res.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>

            <div className="res-progress-section">
              <div className="progress-text">
                <span>Progress</span>
                <span>{res.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${res.progress}%`, background: res.color }} />
              </div>
            </div>

            <button className="view-btn" style={{ background: res.color }}>
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningResources;