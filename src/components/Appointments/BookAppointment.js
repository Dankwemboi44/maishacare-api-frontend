// src/components/Appointments/BookAppointment.js
import React, { useState } from 'react';
import { FaCalendarPlus, FaCalendarCheck, FaSpinner, FaUserMd, FaVideo, FaHospital, FaStar, FaClock } from 'react-icons/fa';
import './BookAppointment.css';

const BookAppointment = ({ doctors, onBook }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('in-person');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const selectedDoctorInfo = doctors.find(d => d.id == selectedDoctor);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onBook({
      doctor_id: selectedDoctor,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      reason: reason,
      type: selectedType
    });
    setIsSubmitting(false);
  };

  return (
    <div className="book-appointment-container">
      <div className="booking-header">
        <h1><FaCalendarPlus /> Book an Appointment</h1>
        <p>Schedule a visit with our experienced doctors</p>
      </div>

      <div className="booking-main">
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Doctor Selection - Compact Grid */}
          <div className="form-row">
            <label>Select Doctor</label>
            <div className="doctor-grid">
              {doctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className={`doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <FaUserMd className="doctor-icon" />
                  <div>
                    <h4>Dr. {doctor.name}</h4>
                    <p>{doctor.specialty}</p>
                  </div>
                  {selectedDoctor === doctor.id && <span className="check-mark">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Date, Time, Type - Three Columns */}
          <div className="form-row-three">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getTodayDate()}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
                <option value="">Select time</option>
                {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="type-buttons">
                <button type="button" className={`type-btn ${selectedType === 'in-person' ? 'active' : ''}`} onClick={() => setSelectedType('in-person')}>
                  <FaHospital /> In-Person
                </button>
                <button type="button" className={`type-btn ${selectedType === 'video' ? 'active' : ''}`} onClick={() => setSelectedType('video')}>
                  <FaVideo /> Video
                </button>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="form-row">
            <label>Reason for visit (optional)</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="2"
              placeholder="Briefly describe your symptoms..."
            />
          </div>

          {/* Summary Bar */}
          {selectedDoctor && selectedDate && selectedTime && (
            <div className="summary-bar">
              <span>📅 {new Date(selectedDate).toLocaleDateString()}</span>
              <span>⏰ {selectedTime}</span>
              <span>👨‍⚕️ Dr. {selectedDoctorInfo?.name}</span>
              <span>{selectedType === 'video' ? '📹 Video' : '🏥 In-Person'}</span>
              <span className="fee">KSh {selectedType === 'video' ? '2,000' : '2,500'}</span>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={!selectedDoctor || !selectedDate || !selectedTime || isSubmitting}>
            {isSubmitting ? <><FaSpinner className="spin" /> Submitting...</> : <><FaCalendarCheck /> Request Appointment</>}
          </button>
        </form>

        {/* Compact Info Sidebar */}
        <div className="info-sidebar">
          <div className="info-item">📌 Arrive 15 mins early</div>
          <div className="info-item">⏰ Free cancellation up to 24 hours</div>
          <div className="info-item">📞 Need help? Call +254 700 123 456</div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;