import React, { useState, useEffect } from 'react';
import './ActivityCalendar.css';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
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

const ActivityCalendar = ({ onBack = () => {} }) => {
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2024);
  const [events, setEvents] = useState([]);
  const [savedDates, setSavedDates] = useState([]);
  const [bookedMsg, setBookedMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  const uid = localStorage.getItem('uid');

  // Load saved dates
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'savedDates'), where('uid', '==', uid));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => a.date.localeCompare(b.date));
      setSavedDates(docs);
    }, err => console.error('savedDates error:', err));
    return unsub;
  }, [uid]);

  // Load events
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'calendarEvents'), where('uid', '==', uid));
    const unsub = onSnapshot(q, snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error('calendarEvents error:', err));
    return unsub;
  }, [uid]);

  const bookedDateSet = new Set(savedDates.map(t => t.date));

  const handleDayClick = async (d) => {
    if (!uid) {
      setMsgType('error');
      setBookedMsg('Not logged in!');
      setTimeout(() => setBookedMsg(''), 3000);
      return;
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (bookedDateSet.has(dateStr)) {
      setMsgType('error');
      setBookedMsg(`Already booked: ${formatDisplayDate(dateStr)}`);
      setTimeout(() => setBookedMsg(''), 3000);
      return;
    }

    try {
      await addDoc(collection(db, 'savedDates'), {
        uid,
        date: dateStr,
        type: 'Interview',
        createdAt: serverTimestamp(),
      });
      setMsgType('success');
      setBookedMsg(`Date Booked: ${formatDisplayDate(dateStr)}`);
    } catch (e) {
      console.error('Save failed:', e);
      setMsgType('error');
      setBookedMsg('Failed to save: ' + e.message);
    }
    setTimeout(() => setBookedMsg(''), 3000);
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
      {/* Back button */}
      <div className="calendar-back-btn-wrap">
        <button className="calendar-back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

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

          {bookedMsg && (
            <div style={{
              textAlign: 'center',
              padding: '6px 0',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: msgType === 'success' ? '#22c55e' : '#ef4444'
            }}>
              {msgType === 'success' ? '✅' : '❌'} {bookedMsg}
            </div>
          )}

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-label">{day}</div>
            ))}

            {calendarDays.map((d, idx) => {
              const dateStr = d
                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                : null;
              const isBooked = dateStr && bookedDateSet.has(dateStr);

              return (
                <div
                  key={idx}
                  className={`calendar-cell ${d ? '' : 'empty'}`}
                  style={{
                    cursor: d ? 'pointer' : 'default',
                    outline: isBooked ? '2px solid #22c55e' : 'none',
                    outlineOffset: '-2px',
                  }}
                  onClick={() => { if (d) handleDayClick(d); }}
                >
                  {d && <span className="day-number">{d}</span>}

                  {isBooked && (
                    <div style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#22c55e',
                      margin: '0 auto 1px',
                    }} />
                  )}

                  {d &&
                    monthEvents
                      .filter(e => new Date(e.date).getDate() === d)
                      .map((e, i) => (
                        <div key={i} className={`event-dot ${eventColors[e.type]}`} />
                      ))}
                </div>
              );
            })}
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
            <div className="task-item">Click any date to book it.</div>
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