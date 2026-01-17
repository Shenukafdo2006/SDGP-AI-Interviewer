
import React, { useState } from 'react';

const careers = [
  {
    id: 1,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/IFS_logo.png',
    title: 'Front End Developer - IFS',
    salary: '$30k - $65k',
    details: 'Work on modern web applications, collaborate with UI/UX teams, and use technologies like React, TypeScript, and CSS.',
  },
  {
    id: 2,
    logo: 'https://wso2.com/files/images/logo.svg',
    title: 'BackEnd Developer - Ws02',
    salary: '$30k - $65k',
    details: 'Build scalable backend systems, APIs, and microservices using Node.js, Java, and cloud platforms.',
  },
  {
    id: 3,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Virtusa_logo.png',
    title: 'Quality Assurance - Virtusa',
    salary: '$30k - $65k',
    details: 'Ensure software quality through automated and manual testing, work with QA tools, and collaborate with development teams.',
  },
  {
    id: 4,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    title: 'Project Management - Google',
    salary: '$30k - $65k',
    details: 'Lead cross-functional teams, manage project timelines, and deliver innovative solutions in a fast-paced environment.',
  },
];

const CareerSuggestions = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="career-suggestions-page" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: '#eaf0ff', borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>🚀 Why Explore These Careers?</div>
        <div style={{ fontSize: 15 }}>
          Each role is carefully selected to align with current industry demand and future growth opportunities, helping you prepare for real-world interviews with confidence.
        </div>
      </div>
      {selected ? (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 24, marginBottom: 24 }}>
          <button style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>Back to Suggestions</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src={selected.logo} alt="logo" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'contain', background: '#fff' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 20 }}>{selected.title}</div>
              <div style={{ fontSize: 16, color: '#888' }}>{selected.salary}</div>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 15 }}>{selected.details}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {careers.map(career => (
            <div key={career.id} style={{ background: '#eaf0ff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 18, minWidth: 260, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={career.logo} alt="logo" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'contain', background: '#fff', marginBottom: 10 }} />
              <div style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{career.title}</div>
              <div style={{ fontSize: 15, color: '#888', marginBottom: 10 }}>{career.salary}</div>
              <button style={{ background: '#8a2be2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 15 }} onClick={() => setSelected(career)}>Explore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerSuggestions;
