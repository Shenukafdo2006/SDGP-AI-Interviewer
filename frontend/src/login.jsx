import React, { useState, useEffect } from 'react';
import './ActivityCalendar.css';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const stats = [
  { label: 'Active Days', value: 7 },
  { label: 'Activities Complete', value: 6 },
  { label: 'Day Streak', value: 8 },
];

const eventColors = {
  Interview: 'interview',
  Quiz: 'quiz',
  Learning: 'learning',
  Goal: 'goal',
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleString('default', { month: 'short', day: 'numeric' });
}

const ActivityCalendar = () => {
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2024);
  const [events, setEvents] = useState([]);
  const [savedDates, setSavedDates] = useState([]);

  // ── Load calendar dot events from Firestore ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'calendarEvents'), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('calendarEvents error:', err));
    return unsub;
  }, []);

  // ── Load saved dates (upcoming tasks) from Firestore ──
  useEffect(() => {
    const q = query(collection(db, 'savedDates'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setSavedDates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('savedDates error:', err));
    return unsub;
  }, []);

  // ── Click a day → save to Firestore ──
  const handleDayClick = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    console.log('Saving date:', dateStr); // ← check this appears in console when you click

    addDoc(collection(db, 'savedDates'), {
      date: dateStr,
      type: 'Interview',
      createdAt: serverTimestamp(),
    })
      .then(() => console.log('Saved successfully!'))
      .catch((err) => console.error('Save failed:', err));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const monthEvents = events.filter(e => {
    const edate = new Date(e.date);
    return edate.getFullYear() === year && edate.getMonth() === month;
  });

  return (
    <div className="activity-calendar-page">
      <div className="calendar-left">
        <div className="stats-row">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              {stat.label}
            </div>
          ))}
        </div>

        <div className="calendar-card">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>{'<'}</button>
            <div className="calendar-title">
              {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
            </div>
            <button onClick={handleNextMonth}>{'>'}</button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-label">{day}</div>
            ))}

            {calendarDays.map((d, idx) => (
              <div
                key={idx}
                className={`calendar-cell ${d ? '' : 'empty'}`}
                style={{ cursor: d ? 'pointer' : 'default' }}
                onClick={() => { if (d) handleDayClick(d); }}
              >
                {d && <span className="day-number">{d}</span>}
                {d &&
                  monthEvents
                    .filter(e => new Date(e.date).getDate() === d)
                    .map((e, i) => (
                      <div key={i} className={`event-dot ${eventColors[e.type]}`} />
                    ))}
              </div>
            ))}
          </div>

          <div className="calendar-legend">
            <span className="interview">Interview</span>
            <span className="quiz">Quiz</span>
            <span className="learning">Learning</span>
            <span className="goal">Goal</span>
          </div>
        </div>
      </div>

      <div className="calendar-right">
        <div className="tasks-card">
          <h3>Upcoming Tasks</h3>
          {savedDates.length === 0 ? (
            <div className="task-item">Click any date to save it here.</div>
          ) : (
            savedDates.map((task) => (
              <div key={task.id} className="task-item">
                {task.type} — {formatDisplayDate(task.date)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;