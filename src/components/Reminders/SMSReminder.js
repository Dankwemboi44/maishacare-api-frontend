// src/components/Reminders/SMSReminder.js
import React, { useState } from 'react';
import './SMSReminder.css';

const SMSReminder = ({ appointments }) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('1 hour');

  const toggleReminder = () => setReminderEnabled(!reminderEnabled);
  const testReminder = () => alert('Test SMS sent to your phone!');

  return (
    <div className="sms-reminder-container">
      <div className="reminder-header"><div><i className="fas fa-sms"></i><h3>Appointment Reminders</h3><p>Get SMS notifications before your appointments</p></div><label className="toggle-switch"><input type="checkbox" checked={reminderEnabled} onChange={toggleReminder} /><span className="toggle-slider"></span></label></div>
      {reminderEnabled && (<div className="reminder-settings"><label>Remind me</label><select value={reminderTime} onChange={e => setReminderTime(e.target.value)}><option value="15 min">15 minutes before</option><option value="30 min">30 minutes before</option><option value="1 hour">1 hour before</option><option value="2 hours">2 hours before</option><option value="1 day">1 day before</option></select><button className="test-btn" onClick={testReminder}>Send Test SMS</button></div>)}
      <div className="upcoming-reminders"><h4>Upcoming Appointments</h4>{appointments.filter(a => a.status === 'upcoming').map(apt => (<div key={apt.id} className="reminder-item"><i className="fas fa-bell"></i><div><strong>{apt.doctor_name}</strong><p>{new Date(apt.date).toLocaleDateString()} at {apt.time}</p></div><span className="reminder-status">Reminder will be sent</span></div>))}</div>
    </div>
  );
};

export default SMSReminder;