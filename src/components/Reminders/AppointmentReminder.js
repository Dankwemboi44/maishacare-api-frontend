// src/components/Reminders/AppointmentReminder.js
import React, { useState, useEffect } from 'react';
import { FaBell, FaClock, FaCalendarAlt, FaEnvelope, FaSms, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const AppointmentReminder = ({ appointments, onSendReminder }) => {
  const [sending, setSending] = useState(null);
  const [reminderHistory, setReminderHistory] = useState([]);
  const [reminderSettings, setReminderSettings] = useState({
    email: true,
    sms: false,
    hoursBefore: 24
  });

  const getUpcomingAppointments = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate > now && aptDate < tomorrow && apt.status === 'confirmed';
    });
  };

  const sendReminder = async (appointment, method) => {
    setSending(appointment.id);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointment_id: appointment.id,
          method: method,
          hours_before: reminderSettings.hoursBefore
        })
      });
      
      if (response.ok) {
        setReminderHistory(prev => [...prev, {
          id: Date.now(),
          appointment_id: appointment.id,
          patient_name: appointment.patient_name,
          method: method,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }]);
        alert(`Reminder sent to ${appointment.patient_name} via ${method.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Reminder error:', err);
      alert('Failed to send reminder');
    } finally {
      setSending(null);
    }
  };

  const upcoming = getUpcomingAppointments();

  return (
    <div className="appointment-reminder">
      <div className="reminder-settings">
        <h3><FaBell /> Reminder Settings</h3>
        <div className="settings-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={reminderSettings.email}
              onChange={(e) => setReminderSettings({...reminderSettings, email: e.target.checked})}
            />
            <FaEnvelope /> Email Reminders
          </label>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={reminderSettings.sms}
              onChange={(e) => setReminderSettings({...reminderSettings, sms: e.target.checked})}
            />
            <FaSms /> SMS Reminders
          </label>
          <div className="hours-select">
            <label>Send reminder:</label>
            <select 
              value={reminderSettings.hoursBefore}
              onChange={(e) => setReminderSettings({...reminderSettings, hoursBefore: parseInt(e.target.value)})}
            >
              <option value={12}>12 hours before</option>
              <option value={24}>24 hours before</option>
              <option value={48}>48 hours before</option>
            </select>
          </div>
        </div>
      </div>

      <div className="upcoming-appointments">
        <h3><FaCalendarAlt /> Upcoming Appointments (Next 24 hours)</h3>
        {upcoming.length === 0 ? (
          <div className="empty-reminders">
            <FaBell />
            <p>No upcoming appointments in the next 24 hours</p>
          </div>
        ) : (
          <div className="reminder-list">
            {upcoming.map(apt => (
              <div key={apt.id} className="reminder-item">
                <div className="reminder-info">
                  <h4>{apt.patient_name}</h4>
                  <p><FaClock /> {new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                  <p className="doctor-name">with Dr. {apt.doctor_name}</p>
                </div>
                <div className="reminder-actions">
                  {reminderSettings.email && (
                    <button 
                      className="btn-reminder email"
                      onClick={() => sendReminder(apt, 'email')}
                      disabled={sending === apt.id}
                    >
                      {sending === apt.id ? <FaSpinner className="spin" /> : <FaEnvelope />}
                      Email
                    </button>
                  )}
                  {reminderSettings.sms && (
                    <button 
                      className="btn-reminder sms"
                      onClick={() => sendReminder(apt, 'sms')}
                      disabled={sending === apt.id}
                    >
                      {sending === apt.id ? <FaSpinner className="spin" /> : <FaSms />}
                      SMS
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reminderHistory.length > 0 && (
        <div className="reminder-history">
          <h3>Recent Reminders</h3>
          <div className="history-list">
            {reminderHistory.slice(-5).reverse().map(rem => (
              <div key={rem.id} className="history-item">
                <FaCheckCircle className="success-icon" />
                <span>{rem.patient_name}</span>
                <span className="method">{rem.method}</span>
                <small>{new Date(rem.sent_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentReminder;