
import React, { useState } from 'react';

const allCandidates = [
  {
    name: 'Emily Chen',
    initials: 'EC',
    degree: 'BS Computer Science - Stanford University',
    email: 'emily.chen@email.com',
    location: 'San Francisco, CA',
    gpa: 3.8,
    available: 'Immediate',
    phone: '+1 234-567-8901',
    experience: '1 year experience',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
  },
  {
    name: 'Michael Rodriguez',
    initials: 'MR',
    degree: 'BS Software Engineering - MIT',
    email: 'michael.r@email.com',
    location: 'Remote',
    gpa: 3.9,
    available: 'June 2025',
    phone: '+1 234-567-8902',
    experience: '6 months experience',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
  },
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    degree: 'BS Data Science - Columbia University',
    email: 'sarah.j@email.com',
    location: 'New York, NY',
    gpa: 3.7,
    available: 'Immediate',
    phone: '+1 234-567-8903',
    experience: '1.5 years experience',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
  },
];

const allSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Git', 'Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'AWS', 'Android', 'Bootstrap', 'Firebase'];

const CVFiltering = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [expLevel, setExpLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [skills, setSkills] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);

  const handleSkillChange = (skill) => {
    setSkills(skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]);
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setExpLevel('');
    setAvailability('');
    setSkills([]);
  };

  const filteredCandidates = allCandidates.filter(c => {
    if (search && !(`${c.name} ${c.email}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (location && c.location !== location) return false;
    if (expLevel && c.experience.indexOf(expLevel) === -1) return false;
    if (availability && c.available !== availability) return false;
    if (skills.length && !skills.every(s => c.skills.includes(s))) return false;
    return true;
  });

  const handleShortlist = (idx) => {
    setShortlisted([...shortlisted, idx]);
  };

  const handleDownload = (candidate) => {
    const content = `Name: ${candidate.name}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nLocation: ${candidate.location}\nDegree: ${candidate.degree}\nGPA: ${candidate.gpa}\nAvailable: ${candidate.available}\nExperience: ${candidate.experience}\nSkills: ${candidate.skills.join(', ')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${candidate.name.replace(/\s+/g, '_')}_CV.txt`;
    link.click();
  };

  return (
    <div className="cv-filtering-page" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 24 }}>
        <h3>Filters</h3>
        <div style={{ marginBottom: 10 }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or email..." style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Location<br/>
            <select value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
              <option value="">All Locations</option>
              {[...new Set(allCandidates.map(c => c.location))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Experience Level<br/>
            <select value={expLevel} onChange={e => setExpLevel(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
              <option value="">All Levels</option>
              {['1 year', '6 months', '1.5 years'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Availability<br/>
            <select value={availability} onChange={e => setAvailability(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
              <option value="">All</option>
              {[...new Set(allCandidates.map(c => c.available))].map(av => <option key={av} value={av}>{av}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Skills<br/>
            <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #eee', borderRadius: 6, padding: 6 }}>
              {allSkills.map(skill => (
                <div key={skill}>
                  <input type="checkbox" checked={skills.includes(skill)} onChange={() => handleSkillChange(skill)} /> {skill}
                </div>
              ))}
            </div>
          </label>
        </div>
        <button onClick={clearFilters} style={{ marginTop: 10, background: '#eee', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 14 }}>Clear Filters</button>
      </div>
      <div style={{ flex: 3, minWidth: 350 }}>
        <h2>{filteredCandidates.length} candidates found</h2>
        {filteredCandidates.map((c, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', marginBottom: 24, padding: 18, position: 'relative', display: 'flex', gap: 18 }}>
            <div style={{ background: '#4b0082', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 20 }}>{c.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 17 }}>{c.name}</div>
              <div style={{ color: '#666', fontSize: 14 }}>{c.degree}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{c.email}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{c.location}</div>
              <div style={{ fontSize: 13, color: '#888' }}>GPA: {c.gpa} &nbsp; Available: {c.available}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{c.phone} &nbsp; {c.experience}</div>
              <div style={{ margin: '8px 0' }}>{c.skills.map(skill => <span key={skill} style={{ background: '#eee', borderRadius: 6, padding: '2px 8px', marginRight: 5, fontSize: 13 }}>{skill}</span>)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
              <button style={{ background: shortlisted.includes(idx) ? '#eee' : '#4b0082', color: shortlisted.includes(idx) ? '#888' : '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13 }} onClick={() => handleShortlist(idx)} disabled={shortlisted.includes(idx)}>
                {shortlisted.includes(idx) ? 'Shortlisted' : 'Shortlist'}
              </button>
              <button style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13 }} onClick={() => alert('CV Preview not implemented in mockup.')}>View CV</button>
              <button style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13 }} onClick={() => handleDownload(c)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVFiltering;
