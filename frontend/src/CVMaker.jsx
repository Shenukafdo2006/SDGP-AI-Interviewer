
import React, { useState } from 'react';

const initialCV = {
  name: 'Shenuka Fernando',
  email: 'shenukafd2006@gmail.com',
  phone: '+94 76 9075161',
  summary: 'A passionate and dedicated Software Engineering student with hands-on experience in web development, software design, and problem-solving. Proficient in Java, Python, HTML, CSS, and JavaScript, with a keen interest in AI, machine learning, and robotics. Adept at collaborating in cross-functional teams and eager to contribute to real-world software solutions.',
  skills: ['ULUX', 'Backend', 'Database', 'Software Life Cycle', 'Artificial Intelligence', 'Leadership'],
  experience: [
    'Python Traffic Data Management System',
    'Real world Digital Circuit Application and Incident analysis - 2024',
    'Python percolation Process',
    'Html & CSS Website for United Nations SDG',
    'University Enrollment System using JAVA and OOP concepts',
  ],
};

const CVMaker = () => {
  const [cv, setCV] = useState(initialCV);
  const [skillInput, setSkillInput] = useState('');
  const [expInput, setExpInput] = useState('');

  const handleChange = (field, value) => {
    setCV({ ...cv, [field]: value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setCV({ ...cv, skills: [...cv.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (idx) => {
    setCV({ ...cv, skills: cv.skills.filter((_, i) => i !== idx) });
  };

  const addExp = () => {
    if (expInput.trim()) {
      setCV({ ...cv, experience: [...cv.experience, expInput.trim()] });
      setExpInput('');
    }
  };

  const removeExp = (idx) => {
    setCV({ ...cv, experience: cv.experience.filter((_, i) => i !== idx) });
  };

  const downloadCV = () => {
    const content = `Name: ${cv.name}\nEmail: ${cv.email}\nPhone: ${cv.phone}\n\nSummary:\n${cv.summary}\n\nSkills:\n${cv.skills.join(', ')}\n\nExperience:\n${cv.experience.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${cv.name.replace(/\s+/g, '_')}_CV.txt`;
    link.click();
  };

  return (
    <div className="cv-maker-page" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 350 }}>
        <h2>Personal Information</h2>
        <div style={{ marginBottom: 10 }}>
          <label>Full Name<br/>
            <input type="text" value={cv.name} onChange={e => handleChange('name', e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Email<br/>
            <input type="email" value={cv.email} onChange={e => handleChange('email', e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Phone<br/>
            <input type="text" value={cv.phone} onChange={e => handleChange('phone', e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>
        </div>
        <h2>Professional Summary</h2>
        <textarea value={cv.summary} onChange={e => handleChange('summary', e.target.value)} style={{ width: '100%', minHeight: 80, borderRadius: 6, border: '1px solid #ccc', padding: 8 }} />
        <h2>Skills</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {cv.skills.map((skill, idx) => (
            <span key={idx} style={{ background: '#eaf0ff', borderRadius: 6, padding: '4px 10px', marginBottom: 4, fontSize: 14 }}>
              {skill} <button style={{ marginLeft: 4, fontSize: 12 }} onClick={() => removeSkill(idx)}>×</button>
            </span>
          ))}
        </div>
        <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add skill" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }} />
        <button onClick={addSkill} style={{ padding: '6px 14px', borderRadius: 6, background: '#4b0082', color: '#fff', border: 'none' }}>Add</button>
        <h2>Experience</h2>
        <ul style={{ paddingLeft: 18 }}>
          {cv.experience.map((exp, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>{exp} <button style={{ marginLeft: 8, fontSize: 12 }} onClick={() => removeExp(idx)}>×</button></li>
          ))}
        </ul>
        <input type="text" value={expInput} onChange={e => setExpInput(e.target.value)} placeholder="Add experience" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }} />
        <button onClick={addExp} style={{ padding: '6px 14px', borderRadius: 6, background: '#4b0082', color: '#fff', border: 'none' }}>Add</button>
      </div>
      <div style={{ flex: 1, minWidth: 320, background: '#eaf0ff', borderRadius: 16, padding: 18, marginTop: 24 }}>
        <h2>Preview</h2>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18 }}>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>{cv.name}</div>
          <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>{cv.email} | {cv.phone}</div>
          <div style={{ fontWeight: 'bold', marginTop: 10 }}>Summary</div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>{cv.summary}</div>
          <div style={{ fontWeight: 'bold', marginTop: 10 }}>Skills</div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>{cv.skills.join(', ')}</div>
          <div style={{ fontWeight: 'bold', marginTop: 10 }}>Experience</div>
          <ul style={{ fontSize: 14, marginBottom: 10, paddingLeft: 18 }}>
            {cv.experience.map((exp, idx) => <li key={idx}>{exp}</li>)}
          </ul>
        </div>
        <button onClick={downloadCV} style={{ marginTop: 18, width: '100%', background: '#4b0082', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 16 }}>Download CV</button>
      </div>
    </div>
  );
};

export default CVMaker;
