
import React from 'react';

const stats = [
  { label: 'Achievements Reached', value: 4 },
  { label: 'Day Streak', value: 15 },
  { label: 'Level', value: 10 },
];

const xp = { level: 10, current: 5, total: 1000, title: 'Career Achiever' };

const achievements = [
  {
    name: 'First Interview',
    desc: 'Completed your first mock interview',
    unlocked: true,
    date: '2024-10-15',
    color: '#a020f0',
    icon: '🔒',
  },
  {
    name: 'Quiz Master',
    desc: 'Scored 100% on 5 quizzes',
    unlocked: true,
    date: '2024-10-22',
    color: '#ffa500',
    icon: '🏆',
  },
  {
    name: 'Week Warrior',
    desc: 'Maintained a 7-day learning streak',
    unlocked: true,
    date: '2024-10-28',
    color: '#ff0066',
    icon: '🔥',
  },
  {
    name: 'CV Creator',
    desc: 'Created and downloaded your CV',
    unlocked: true,
    date: '2024-11-01',
    color: '#a020f0',
    icon: '📄',
  },
  {
    name: 'Knowledge Seeker',
    desc: 'Read 20 learning resources',
    unlocked: false,
    progress: '12/20',
    color: '#bbb',
    icon: '⚡',
  },
  {
    name: 'Perfect Score',
    desc: 'Get 90%+ on 10 interviews',
    unlocked: false,
    progress: '3/10',
    color: '#bbb',
    icon: '⭕',
  },
];

const Achievements = () => (
  <div className="achievements-page" style={{ maxWidth: 1100, margin: '0 auto' }}>
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      {stats.map((stat, idx) => (
        <div key={idx} style={{ background: '#eaf0ff', borderRadius: 16, padding: '18px 32px', fontWeight: 'bold', fontSize: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: '#4b0082', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.value}</span>
          {stat.label}
        </div>
      ))}
    </div>
    <div style={{ background: '#eaf0ff', borderRadius: 16, padding: 18, marginBottom: 24 }}>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>Level {xp.level}</div>
      <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>{xp.title}</div>
      <div style={{ background: '#fff', borderRadius: 8, height: 18, position: 'relative', marginBottom: 8 }}>
        <div style={{ width: `${(xp.current / xp.total) * 100}%`, background: '#4b0082', height: '100%', borderRadius: 8 }}></div>
        <span style={{ position: 'absolute', right: 8, top: 0, fontSize: 13 }}>{xp.current}/{xp.total} XP</span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
      {achievements.map((ach, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', border: ach.unlocked ? `2px solid ${ach.color}` : '2px solid #eee' }}>
          <div style={{ background: ach.color, color: '#fff', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 8 }}>{ach.icon}</div>
          <div style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{ach.name}</div>
          <div style={{ fontSize: 14, color: '#444', marginBottom: 8, textAlign: 'center' }}>{ach.desc}</div>
          {ach.unlocked ? (
            <div style={{ background: '#eaf0ff', color: '#4b0082', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>Unlocked {ach.date}</div>
          ) : (
            <div style={{ background: '#eee', color: '#888', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>{ach.progress}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Achievements;
