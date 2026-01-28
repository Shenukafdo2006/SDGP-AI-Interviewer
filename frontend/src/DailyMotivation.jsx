
import React from 'react';

const quote = {
  text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  author: 'Winston Churchill',
};

const tips = [
  {
    icon: '🎯',
    title: 'Start Small',
    desc: 'Break down your goals into smaller, manageable tasks. Every small win counts!',
    color:"Black"



  },
  {
    icon: '📅',
    title: 'Stay Consistent',
    desc: 'Consistency beats intensity. Dedicate time every day, even if it’s just 30 minutes.',
    color: '#ff0066',
  },
  {
    icon: '⭐',
    title: 'Celebrate Progress',
    desc: 'Acknowledge your achievements, no matter how small. You’re improving every day!',
    color: '#ff0066',
  },
  {
    icon: '⚡',
    title: 'Learn from Failures',
    desc: 'Every mistake is a learning opportunity. Embrace challenges as growth moments.',
    color: '#ff0066',
  },
];

const DailyMotivation = () => (
  <div className="daily-motivation-page" style={{ maxWidth: 900, margin: '0 auto' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
      <div style={{ background: 'linear-gradient(90deg,#ff0066,#ff4e9b)', color: '#fff', borderRadius: 20, boxShadow: '0 2px 8px #ccc', padding: '24px 32px', fontSize: 22, fontStyle: 'italic', marginBottom: 10, width: '100%', maxWidth: 800 }}>
        <span style={{ fontSize: 32, marginRight: 12 }}>❝</span>
        {`"${quote.text}"`}
        <div style={{ fontSize: 16, fontStyle: 'normal', marginTop: 10 }}>— {quote.author}</div>
      </div>
    </div>
    <div style={{ border: '1px solid #222', borderRadius: 18, padding: 24, background: '#fff', boxShadow: '0 2px 8px #eee' }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 18 }}>Motivation Tips</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {tips.map((tip, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #eee', padding: 18, minWidth: 260, flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: tip.color, color: '#fff', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{tip.icon}</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{tip.title}</div>
              <div style={{ fontSize: 14, color: '#444', marginTop: 4 }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DailyMotivation;
