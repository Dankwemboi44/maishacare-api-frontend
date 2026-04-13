// src/components/Goals/HealthGoals.js
import React, { useState } from 'react';
import './HealthGoals.css';

const HealthGoals = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Walk 10,000 steps daily', current: 7234, target: 10000, unit: 'steps', progress: 72 },
    { id: 2, title: 'Drink 8 glasses of water', current: 5, target: 8, unit: 'glasses', progress: 62 },
    { id: 3, title: 'Exercise 30 minutes', current: 20, target: 30, unit: 'minutes', progress: 66 },
    { id: 4, title: 'Sleep 8 hours', current: 7.2, target: 8, unit: 'hours', progress: 90 }
  ]);

  const [achievements] = useState([
    { id: 1, name: 'First Step', icon: '👟', description: 'Completed your first health goal', unlocked: true, date: 'Mar 15, 2026' },
    { id: 2, name: 'Consistency King', icon: '👑', description: '7 day streak', unlocked: true, date: 'Mar 20, 2026' },
    { id: 3, name: 'Heart Hero', icon: '❤️', description: 'Maintained healthy heart rate for a week', unlocked: false },
    { id: 4, name: 'Sleep Master', icon: '😴', description: '8 hours of sleep for 5 days', unlocked: false }
  ]);

  const updateProgress = (id, increment) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, current: Math.min(goal.target, Math.max(0, goal.current + increment)), progress: Math.min(100, Math.round((goal.current + increment) / goal.target * 100)) } : goal));
  };

  return (<div className="health-goals-container"><h2><i className="fas fa-bullseye"></i> Health Goals</h2><div className="goals-list">{goals.map(goal => (<div key={goal.id} className="goal-card"><div className="goal-header"><h3>{goal.title}</h3><span className="goal-value">{goal.current} / {goal.target} {goal.unit}</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${goal.progress}%` }}></div></div><div className="goal-actions"><button onClick={() => updateProgress(goal.id, -10)}>−</button><span>{goal.progress}%</span><button onClick={() => updateProgress(goal.id, 10)}>+</button></div></div>))}</div><div className="achievements-section"><h3><i className="fas fa-medal"></i> Achievements</h3><div className="achievements-grid">{achievements.map(ach => (<div key={ach.id} className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}><div className="achievement-icon">{ach.icon}</div><h4>{ach.name}</h4><p>{ach.description}</p>{ach.unlocked && <span className="unlocked-date">Unlocked: {ach.date}</span>}</div>))}</div></div></div>);
};

export default HealthGoals;