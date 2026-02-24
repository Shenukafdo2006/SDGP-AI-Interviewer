
import React, { useState } from 'react';

const userProfile = {
  name: 'Alex Johnson',
  title: 'Software Engineer | React & TypeScript Enthusiast',
  location: 'San Francisco, CA',
  connections: 847,
  followers: 1243,
  profileViews: 342,
  searchAppearances: 89,
  profileLink: 'https://linkedin.com/in/alexjohnson',
};

const profileStrength = {
  percent: 75,
  checklist: [
    { label: 'Add a profile photo', done: true },
    { label: 'Add your work experience', done: true },
    { label: 'Add 5+ skills', done: true },
    { label: 'Get 3 recommendations', done: true },
    { label: 'Add certifications', done: false },
    { label: 'Write a detailed summary', done: false },
  ],
};

const peopleSuggestions = [
  { initials: 'SA', name: 'Sarah Chen', title: 'Senior Frontend Developer at Google', mutual: 23 },
  { initials: 'MI', name: 'Michael Rodriguez', title: 'Tech Lead at Microsoft', mutual: 15 },
  { initials: 'EM', name: 'Emily Davis', title: 'Product Manager at Amazon', mutual: 31 },
  { initials: 'JA', name: 'James Wilson', title: 'Full Stack Developer at Meta', mutual: 12 },
];

const LinkedInIntegration = ({ onBack }) => {
  const [update, setUpdate] = useState('');
  const [shared, setShared] = useState(false);
  const [connected, setConnected] = useState(Array(peopleSuggestions.length).fill(false));

  const handleShare = () => {
    if (update.trim()) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      setUpdate('');
    }
  };

  const handleConnect = (idx) => {
    setConnected(connected.map((c, i) => i === idx ? true : c));
  };

const [selected, setSelected] = useState(null);

  if (selected) {      
    return (
      <div className="linkedin-integration-page" style={{ maxWidth: 700, margin: '0 auto' }}>
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
    <div className="linkedin-integration-page" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
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
      <div style={{ flex: 2, minWidth: 350 }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#4b0082', color: '#fff', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold' }}>{userProfile.name.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{userProfile.name}</div>
              <div style={{ fontSize: 14, color: '#555' }}>{userProfile.title}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{userProfile.location}</div>
            </div>
            <a href={userProfile.profileLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto' }}>
              <button style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 14 }}>View on LinkedIn</button>
            </a>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 18 }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{userProfile.profileViews}</div>
              <div style={{ fontSize: 13, color: '#888' }}>Profile views (30 days)</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{userProfile.searchAppearances}</div>
              <div style={{ fontSize: 13, color: '#888' }}>Search appearances</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#888' }}>{userProfile.connections} connections &nbsp; {userProfile.followers} followers</div>
        </div>
        <div style={{ background: '#eaf0ff', borderRadius: 12, padding: 18, marginBottom: 24 }}>
          <h3>Share an update</h3>
          <textarea value={update} onChange={e => setUpdate(e.target.value)} placeholder="What do you want to share?" style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: 15 }} />
          <button style={{ background: '#4b0082', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 16, marginTop: 10 }} onClick={handleShare}>Share</button>
          {shared && <div style={{ color: 'green', marginTop: 8 }}>Update shared!</div>}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 250 }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>Profile Strength</h3>
          <div style={{ marginBottom: 8 }}>Progress <span style={{ float: 'right', fontWeight: 'bold' }}>{profileStrength.percent}%</span></div>
          <div style={{ background: '#eee', borderRadius: 8, height: 10, marginBottom: 12 }}>
            <div style={{ width: `${profileStrength.percent}%`, background: '#4b0082', height: '100%', borderRadius: 8 }}></div>
          </div>
          <ul style={{ paddingLeft: 18, fontSize: 13 }}>
            {profileStrength.checklist.map((item, idx) => (
              <li key={idx} style={{ color: item.done ? 'green' : '#888', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</li>
            ))}
          </ul>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>People You May Know</h3>
          {peopleSuggestions.map((person, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ background: '#4b0082', color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 15 }}>{person.initials}</div>
              <div style={{ marginLeft: 10 }}>
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{person.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{person.title}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{person.mutual} mutual connections</div>
              </div>
              <button style={{ marginLeft: 'auto', background: connected[idx] ? '#eee' : '#4b0082', color: connected[idx] ? '#888' : '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13 }} onClick={() => handleConnect(idx)} disabled={connected[idx]}>
                {connected[idx] ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;
