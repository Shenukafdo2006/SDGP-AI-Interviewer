import "./LearningResources.css";
import React, { useState } from 'react';

const resources = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    provider: 'Online Academy',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    level: 'Beginner',
    duration: '12 weeks',
    rating: 4.8,
    link: 'https://example.com/web-bootcamp',
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    provider: 'React Masters',
    tags: ['React', 'TypeScript', 'Performance'],
    level: 'Advanced',
    duration: '6 weeks',
    rating: 4.9,
    link: 'https://example.com/react-patterns',
  },
  {
    id: 3,
    title: 'System Design Interview Prep',
    provider: 'Tech Interview Pro',
    tags: ['System Design', 'Architecture', 'Scalability'],
    level: 'Intermediate',
    duration: '8 weeks',
    rating: 4.7,
    link: 'https://example.com/system-design',
  },
];

const LearningResources = ({ onBack }) => {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="learning-resources-page" style={{ maxWidth: 700, margin: '0 auto' }}>
        <header className="header">
          <div
            className="menu-icon"
            onClick={onBack}
            style={{ cursor: onBack ? "pointer" : "default" }}
          >
            ←
          </div>
          <div className="logo">📚</div>
        </header>
        <button style={{ marginBottom: 20 }} onClick={() => setSelected(null)}>Back to Resources</button>
        <h2>{selected.title}</h2>
        <div style={{ marginBottom: 10 }}>Provider: <b>{selected.provider}</b></div>
        <div style={{ marginBottom: 10 }}>Tags: {selected.tags.map(tag => <span key={tag} style={{ background: '#eee', borderRadius: 6, padding: '2px 8px', marginRight: 5 }}>{tag}</span>)}</div>
        <div style={{ marginBottom: 10 }}>Level: {selected.level} | Duration: {selected.duration}</div>
        <div style={{ marginBottom: 10 }}>Rating: <span style={{ color: '#f5b400', fontWeight: 'bold' }}>{selected.rating} ★</span></div>
        <a href={selected.link} target="_blank" rel="noopener noreferrer">
          <button style={{ background: 'linear-gradient(90deg,#a020f0,#8a2be2)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 16 }}>View Course</button>
        </a>
      </div>
    );
  }

  return (
    <div className="learning-resources-page" style={{ maxWidth: 700, margin: '0 auto' }}>
      <header className="header">
        <div
          className="menu-icon"
          onClick={onBack}
          style={{ cursor: onBack ? "pointer" : "default" }}
        >
          ←
        </div>
        <div className="logo">📚</div>
      </header>
      <h2>Learning Resources</h2>
      {resources.map(resource => (
        <div key={resource.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', marginBottom: 24, padding: 18, position: 'relative' }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>{resource.title}</div>
          <div style={{ color: '#666', fontSize: 14 }}>{resource.provider}</div>
          <div style={{ margin: '8px 0' }}>{resource.tags.map(tag => <span key={tag} style={{ background: '#eee', borderRadius: 6, padding: '2px 8px', marginRight: 5, fontSize: 13 }}>{tag}</span>)}</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Level: {resource.level} &nbsp; Duration: {resource.duration}</div>
          <div style={{ position: 'absolute', top: 18, right: 18, color: '#f5b400', fontWeight: 'bold', fontSize: 15 }}>★ {resource.rating}</div>
          <button style={{ width: '100%', background: 'linear-gradient(90deg,#a020f0,#8a2be2)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 16, marginTop: 12 }} onClick={() => setSelected(resource)}>
            View Course
          </button>
        </div>
      ))}
    </div>
  );
};

export default LearningResources;
