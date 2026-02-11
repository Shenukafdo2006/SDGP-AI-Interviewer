import React, { useState } from 'react';
import './ActivityCalendar.css';



const stats = [
  { label: 'Active Days', value: 7 },
  { label: 'Activities Complete', value: 6 },
  { label: 'Day Streak', value: 8 },
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
  Interview: 'interview',
  Quiz: 'quiz',
  Learning: 'learning',
  Goal: 'goal',
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
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2024);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
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
              <div key={idx} className={`calendar-cell ${d ? '' : 'empty'}`}>
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
          {upcomingTasks.map((task, idx) => (
            <div key={idx} className="task-item">
              {task.name} — {task.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
