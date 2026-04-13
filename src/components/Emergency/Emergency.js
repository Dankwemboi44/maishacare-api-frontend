// src/components/Emergency/Emergency.js
import React, { useState, useEffect } from 'react';
import './Emergency.css';

const Emergency = ({ patientId, patientName }) => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [medicalId, setMedicalId] = useState(null);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    fetchEmergencyContacts();
    fetchMedicalId();
  }, []);

  const fetchEmergencyContacts = async () => {
    // Demo data
    setEmergencyContacts([
      { id: 1, name: 'John Johnson', phone: '+1 (555) 987-6543', relationship: 'Spouse' },
      { id: 2, name: 'Mary Johnson', phone: '+1 (555) 876-5432', relationship: 'Sister' }
    ]);
  };

  const fetchMedicalId = async () => {
    setMedicalId({
      name: patientName,
      bloodType: 'O+',
      allergies: ['Penicillin', 'Pollen'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg'],
      emergencyContacts: emergencyContacts
    });
  };

  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
    }
  };

  const deleteContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  const triggerSOS = () => {
    setSosActive(true);
    // In production, this would send SMS/call to emergency contacts
    setTimeout(() => {
      alert(`SOS Alert sent to your emergency contacts!`);
      setSosActive(false);
    }, 2000);
  };

  const downloadMedicalId = () => {
    const medicalIdCard = `
      MEDICAL ID CARD
      ================
      Name: ${medicalId?.name}
      Blood Type: ${medicalId?.bloodType}
      Allergies: ${medicalId?.allergies?.join(', ')}
      Conditions: ${medicalId?.conditions?.join(', ')}
      Medications: ${medicalId?.medications?.join(', ')}
      Emergency Contacts: ${medicalId?.emergencyContacts?.map(c => `${c.name} (${c.relationship}): ${c.phone}`).join('; ')}
    `;
    alert('Medical ID card would be downloaded here');
  };

  return (
    <div className="emergency-container">
      {/* SOS Button */}
      <div className="sos-section">
        <button className={`sos-button ${sosActive ? 'active' : ''}`} onClick={triggerSOS}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{sosActive ? 'SOS SENT!' : 'EMERGENCY SOS'}</span>
          <small>Tap in case of emergency</small>
        </button>
      </div>

      {/* Medical ID Card */}
      <div className="medical-id-card">
        <div className="medical-id-header">
          <i className="fas fa-id-card"></i>
          <h3>Medical ID Card</h3>
          <button className="download-id-btn" onClick={downloadMedicalId}>
            <i className="fas fa-download"></i> Download
          </button>
        </div>
        <div className="medical-id-content">
          <div className="id-row"><span>Name:</span><strong>{medicalId?.name}</strong></div>
          <div className="id-row"><span>Blood Type:</span><strong>{medicalId?.bloodType}</strong></div>
          <div className="id-row"><span>Allergies:</span><strong>{medicalId?.allergies?.join(', ') || 'None'}</strong></div>
          <div className="id-row"><span>Conditions:</span><strong>{medicalId?.conditions?.join(', ') || 'None'}</strong></div>
          <div className="id-row"><span>Medications:</span><strong>{medicalId?.medications?.join(', ') || 'None'}</strong></div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="emergency-contacts-section">
        <div className="section-header">
          <h3><i className="fas fa-phone-alt"></i> Emergency Contacts</h3>
          <button className="add-contact-btn" onClick={() => setShowAddContact(true)}>
            <i className="fas fa-plus"></i> Add Contact
          </button>
        </div>

        <div className="contacts-list">
          {emergencyContacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <div className="contact-avatar"><i className="fas fa-user-circle"></i></div>
              <div className="contact-info"><h4>{contact.name}</h4><p>{contact.relationship}</p><p className="contact-phone"><i className="fas fa-phone"></i> {contact.phone}</p></div>
              <div className="contact-actions">
                <button className="call-btn" onClick={() => window.location.href = `tel:${contact.phone}`}><i className="fas fa-phone"></i></button>
                <button className="delete-btn" onClick={() => deleteContact(contact.id)}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
          {emergencyContacts.length === 0 && (<div className="empty-contacts"><i className="fas fa-address-book"></i><p>No emergency contacts added</p></div>)}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (<div className="modal-overlay" onClick={() => setShowAddContact(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><div className="modal-header"><h3>Add Emergency Contact</h3><button onClick={() => setShowAddContact(false)}>×</button></div><div className="modal-body"><div className="form-group"><label>Full Name</label><input type="text" placeholder="Enter name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} /></div><div className="form-group"><label>Phone Number</label><input type="tel" placeholder="Enter phone number" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} /></div><div className="form-group"><label>Relationship</label><input type="text" placeholder="e.g., Spouse, Parent" value={newContact.relationship} onChange={e => setNewContact({...newContact, relationship: e.target.value})} /></div></div><div className="modal-footer"><button className="btn-secondary" onClick={() => setShowAddContact(false)}>Cancel</button><button className="btn-primary" onClick={addEmergencyContact}>Add Contact</button></div></div></div>)}
    </div>
  );
};

export default Emergency;