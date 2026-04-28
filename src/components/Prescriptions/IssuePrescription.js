// src/components/Prescriptions/IssuePrescription.js
import React, { useState, useEffect } from 'react';
import { FaFilePrescription, FaSpinner,FaCheckCircle, FaUserMd, FaStethoscope, FaCalendarAlt, FaClock, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';

const IssuePrescription = ({ patients, doctor, onSuccess }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [refills, setRefills] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'As needed'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }

    if (!medicationName) {
      setError('Please enter medication name');
      return;
    }

    if (!dosage) {
      setError('Please enter dosage');
      return;
    }

    if (!frequency) {
      setError('Please select frequency');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: selectedPatient,
          medication_name: medicationName,
          dosage: dosage,
          frequency: frequency,
          instructions: instructions,
          refills: parseInt(refills) || 0
        })
      });

      if (response.ok) {
        setSuccess('Prescription issued successfully!');
        setMedicationName('');
        setDosage('');
        setFrequency('');
        setInstructions('');
        setRefills('0');
        setSelectedPatient('');
        
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to issue prescription');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientData = patients.find(p => p.id == selectedPatient);

  return (
    <div className="issue-prescription-container">
      <div className="page-header-modern">
        <h1><FaFilePrescription /> Issue Prescription</h1>
        <p>Write and send a prescription to your patient</p>
      </div>

      <div className="prescription-form-wrapper">
        <form onSubmit={handleSubmit} className="prescription-form">
          {/* Patient Selection */}
          <div className="form-group">
            <label>Select Patient <span className="required">*</span></label>
            <select 
              value={selectedPatient} 
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Patient Info */}
          {selectedPatientData && (
            <div className="patient-info-card">
              <div className="patient-info-header">
                <FaUserMd className="patient-icon" />
                <h3>{selectedPatientData.name}</h3>
              </div>
              <div className="patient-info-details">
                <span><FaEnvelope /> {selectedPatientData.email}</span>
                <span><FaPhone /> {selectedPatientData.phone || 'No phone'}</span>
                <span><FaStethoscope /> Health Score: {selectedPatientData.health_score || '--'}%</span>
              </div>
            </div>
          )}

          {/* Medication Details */}
          <div className="form-row-two">
            <div className="form-group">
              <label>Medication Name <span className="required">*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Amoxicillin, Lisinopril"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Dosage <span className="required">*</span></label>
              <input 
                type="text" 
                placeholder="e.g., 500mg, 10mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Frequency <span className="required">*</span></label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Refills</label>
              <select value={refills} onChange={(e) => setRefills(e.target.value)}>
                <option value="0">0 (No refills)</option>
                <option value="1">1 refill</option>
                <option value="2">2 refills</option>
                <option value="3">3 refills</option>
                <option value="5">5 refills</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label>Instructions for Patient</label>
            <textarea 
              rows="3"
              placeholder="e.g., Take with food, Do not crush, Take at bedtime..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message">
              <FaTimes /> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <FaCheckCircle /> {success}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-prescription-btn" disabled={isSubmitting}>
            {isSubmitting ? <><FaSpinner className="spin" /> Issuing Prescription...</> : <><FaFilePrescription /> Issue Prescription</>}
          </button>
        </form>

        {/* Info Sidebar */}
        <div className="prescription-info-sidebar">
          <div className="info-card">
            <h4>📝 Prescription Tips</h4>
            <ul>
              <li>Include clear dosage instructions</li>
              <li>Specify if medication should be taken with food</li>
              <li>Note any potential side effects</li>
              <li>Patient can request refills online</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>⚕️ What happens next?</h4>
            <p>Patient will receive a notification and can view the prescription in their dashboard.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .issue-prescription-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header-modern h1 {
          font-size: 1.8rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-header-modern p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .prescription-form-wrapper {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
        }

        .prescription-form {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .patient-info-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }

        .patient-info-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .patient-icon {
          font-size: 28px;
          color: #3b82f6;
        }

        .patient-info-header h3 {
          font-size: 1rem;
          margin: 0;
        }

        .patient-info-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.8rem;
          color: #475569;
        }

        .patient-info-details span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .success-message {
          background: #d1fae5;
          color: #065f46;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .submit-prescription-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .submit-prescription-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.4);
        }

        .submit-prescription-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .prescription-info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .info-card h4 {
          font-size: 1rem;
          margin: 0 0 12px 0;
          color: #1e293b;
        }

        .info-card ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-card li {
          font-size: 0.8rem;
          color: #475569;
          margin-bottom: 8px;
        }

        .info-card p {
          font-size: 0.8rem;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .prescription-form-wrapper {
            grid-template-columns: 1fr;
          }
          
          .form-row-two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default IssuePrescription;