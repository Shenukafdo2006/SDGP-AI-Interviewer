
import React, { useState } from 'react';

const stats = [
  { label: 'Active Days', value: 7 },
  { label: 'Activities Complete', value: 6 },
  { label: 'day streak', value: 8 },
];

const events = [
  { date: '2024-11-01', type: 'Interview' },
  { date: '2024-11-02', type: 'Quiz' },
  { date: '2024-11-03', type: 'Learning' },
  { date: '2024-11-04', type: 'Goal' },
  { date: '2024-11-05', type: 'Interview' },
  { date: '2024-11-06', type: 'Quiz' },
  { date: '2024-11-07', type: 'Learning' },
  { date: '2024-11-08', type: 'Goal' },
];

const eventColors = {
  Interview: 'blue',
  Quiz: 'green',
  Learning: 'purple',
  Goal: 'orange',
};

const upcomingTasks = [
  { name: 'System Design 1', date: 'Nov 6' },
  { name: 'React Practice', date: 'Nov 7' },
  { name: 'Soft Skills', date: 'Nov 8' },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const ActivityCalendar = () => {
  const [month, setMonth] = useState(10); // November (0-indexed)
  const [year, setYear] = useState(2024);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Build calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Get events for current month
  const monthEvents = events.filter(e => {
    const edate = new Date(e.date);
    return edate.getFullYear() === year && edate.getMonth() === month;
  });

  return (
    <div className="activity-calendar-page" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 500 }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ background: '#eaf0ff', borderRadius: 16, padding: '18px 32px', fontWeight: 'bold', fontSize: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: '#4b0082', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.value}</span>
              {stat.label}
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={handlePrevMonth} style={{ fontSize: 18, background: '#eee', border: 'none', borderRadius: 8, padding: '4px 12px' }}>{'<'}</button>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</div>
            <button onClick={handleNextMonth} style={{ fontSize: 18, background: '#eee', border: 'none', borderRadius: 8, padding: '4px 12px' }}>{'>'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>{day}</div>
            ))}
            {calendarDays.map((d, idx) => (
              <div key={idx} style={{ height: 54, borderRadius: 8, background: d ? '#f8f8ff' : 'transparent', border: d ? '1px solid #eee' : 'none', position: 'relative', textAlign: 'center', paddingTop: 6 }}>
                {d && <span style={{ fontWeight: 'bold' }}>{d}</span>}
                {d && monthEvents.filter(e => new Date(e.date).getDate() === d).map((e, i) => (
                  <div key={i} style={{ height: 4, borderRadius: 2, background: eventColors[e.type], margin: '4px 0' }}></div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: '#888' }}>
            <span style={{ color: 'blue', fontWeight: 'bold' }}>Interview</span> &nbsp;
            <span style={{ color: 'green', fontWeight: 'bold' }}>Quiz</span> &nbsp;
            <span style={{ color: 'purple', fontWeight: 'bold' }}>Learning</span> &nbsp;
            <span style={{ color: 'orange', fontWeight: 'bold' }}>Goal</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 250 }}>
        <div style={{ background: '#eaf0ff', borderRadius: 16, padding: 18 }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Upcoming Tasks</div>
          {upcomingTasks.map((task, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 14, fontSize: 15, marginBottom: 12 }}>
              {task.name} - {task.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
