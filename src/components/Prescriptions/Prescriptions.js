// src/components/Prescriptions/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { 
  FaPrescriptionBottle, FaSpinner, FaCheckCircle, FaClock, 
  FaInfoCircle, FaUserCircle, FaCalendarAlt, FaDownload, 
  FaPrint, FaShare, FaEye, FaFilePdf, FaUserMd, FaSyringe,
  FaSearch, FaFilter
} from 'react-icons/fa';
import './Prescriptions.css';

const Prescriptions = ({ patientId, userType }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId, userType]);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, statusFilter, prescriptions]);

  const filterPrescriptions = () => {
    let filtered = [...prescriptions];
    
    if (searchTerm) {
      filtered = filtered.filter(pres => 
        pres.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userType === 'doctor' && pres.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pres => pres.status === statusFilter);
    }
    
    setFilteredPrescriptions(filtered);
  };

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    
    try {
      let url = 'http://localhost:5000/api/prescriptions';
      
      if (userType === 'doctor' && patientId) {
        url = `http://localhost:5000/api/prescriptions?patient_id=${patientId}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
        setFilteredPrescriptions(data);
      } else if (response.status === 401) {
        setError('Please login again');
      } else {
        loadDemoData();
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    let demoData = [];
    
    if (userType === 'doctor') {
      if (patientId) {
        // Demo data for a specific patient
        demoData = [
          { 
            id: 1, 
            medication_name: 'Amoxicillin', 
            dosage: '500mg', 
            frequency: 'Twice daily',
            instructions: 'Take with food for 7 days',
            doctor_name: 'Dr. Sarah Moraa',
            prescribed_date: '2026-03-20',
            status: 'active',
            refills: 0,
            document_url: null
          }
        ];
      } else {
        // Demo data for doctor's all prescriptions
        demoData = [
          { 
            id: 1, 
            patient_name: 'John Mwangi',
            patient_id: 3,
            medication_name: 'Lisinopril', 
            dosage: '10mg', 
            frequency: 'Once daily',
            instructions: 'Take with food. Do not crush or chew.',
            doctor_name: 'Dr. Sarah Moraa',
            prescribed_date: '2026-03-20',
            status: 'active',
            refills: 2
          },
          { 
            id: 2, 
            patient_name: 'Mary Wanjiku',
            patient_id: 4,
            medication_name: 'Metformin', 
            dosage: '500mg', 
            frequency: 'Twice daily',
            instructions: 'Take with meals to reduce stomach upset.',
            doctor_name: 'Dr. Sarah Moraa',
            prescribed_date: '2026-03-15',
            status: 'active',
            refills: 1
          },
          { 
            id: 3, 
            patient_name: 'Peter Ochieng',
            patient_id: 5,
            medication_name: 'Atorvastatin', 
            dosage: '20mg', 
            frequency: 'Once daily',
            instructions: 'Take at bedtime.',
            doctor_name: 'Dr. Sarah Moraa',
            prescribed_date: '2026-03-10',
            status: 'expired',
            refills: 0
          }
        ];
      }
    } else {
      // Patient demo data
      demoData = [
        { 
          id: 1, 
          medication_name: 'Lisinopril', 
          dosage: '10mg', 
          frequency: 'Once daily',
          instructions: 'Take with food',
          doctor_name: 'Dr. Sarah Moraa',
          prescribed_date: '2026-03-20',
          status: 'active',
          refills: 2
        },
        { 
          id: 2, 
          medication_name: 'Metformin', 
          dosage: '500mg', 
          frequency: 'Twice daily',
          instructions: 'Take with meals',
          doctor_name: 'Dr. Michael Kibet',
          prescribed_date: '2026-03-15',
          status: 'active',
          refills: 1
        }
      ];
    }
    
    setPrescriptions(demoData);
    setFilteredPrescriptions(demoData);
  };

  const downloadPrescription = (pres) => {
    alert(`Downloading prescription for ${pres.medication_name}`);
  };

  const printPrescription = (pres) => {
    window.print();
  };

  const sharePrescription = (pres) => {
    alert(`Share prescription for ${pres.medication_name}`);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      case 'pending': return 'status-pending';
      default: return 'status-active';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaSpinner className="spin" />
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  // ==================== DOCTOR VIEW (All prescriptions) ====================
  if (userType === 'doctor' && !patientId) {
    if (filteredPrescriptions.length === 0 && !loading) {
      return (
        <div className="empty-state">
          <FaPrescriptionBottle />
          <h3>No prescriptions issued yet</h3>
          <p>Click "Issue Prescription" to write a prescription for your patients</p>
        </div>
      );
    }

    return (
      <div className="prescriptions-container">
        <div className="prescriptions-header">
          <h2><FaPrescriptionBottle /> Prescriptions Issued</h2>
          <div className="prescriptions-actions">
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search by patient or medication..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="prescriptions-grid">
          {filteredPrescriptions.map(pres => (
            <div key={pres.id} className="prescription-card">
              <div className="prescription-header">
                <div className="prescription-icon">
                  <FaPrescriptionBottle />
                </div>
                <div>
                  <span className={getStatusClass(pres.status)}>
                    {pres.status === 'active' ? <FaCheckCircle /> : <FaClock />} {pres.status || 'Active'}
                  </span>
                </div>
              </div>
              <div className="prescription-body">
                <h3>{pres.medication_name}</h3>
                <div className="dosage">{pres.dosage} - {pres.frequency}</div>
                <div className="doctor-info">
                  <FaUserCircle /> {pres.patient_name}
                </div>
                <div className="doctor-info">
                  <FaCalendarAlt /> {formatDate(pres.prescribed_date)}
                </div>
                <div className="refills-info">
                  <FaSyringe /> Refills left: {pres.refills || 0}
                </div>
              </div>
              <div className="prescription-footer">
                <button className="btn-details" onClick={() => {
                  setSelectedPrescription(pres);
                  setShowDetailsModal(true);
                }}>
                  <FaEye /> Details
                </button>
                <button className="btn-download" onClick={() => downloadPrescription(pres)}>
                  <FaDownload /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedPrescription && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content prescription-details-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><FaPrescriptionBottle /> Prescription Details</h2>
                <button onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="details-section">
                  <h3>Medication Information</h3>
                  <div className="details-row">
                    <span className="label">Medication:</span>
                    <span className="value">{selectedPrescription.medication_name}</span>
                  </div>
                  <div className="details-row">
                    <span className="label">Dosage:</span>
                    <span className="value">{selectedPrescription.dosage}</span>
                  </div>
                  <div className="details-row">
                    <span className="label">Frequency:</span>
                    <span className="value">{selectedPrescription.frequency}</span>
                  </div>
                  <div className="details-row">
                    <span className="label">Refills left:</span>
                    <span className="value">{selectedPrescription.refills || 0}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Patient Information</h3>
                  <div className="details-row">
                    <span className="label">Patient Name:</span>
                    <span className="value">{selectedPrescription.patient_name}</span>
                  </div>
                  <div className="details-row">
                    <span className="label">Prescribed by:</span>
                    <span className="value">Dr. {selectedPrescription.doctor_name}</span>
                  </div>
                  <div className="details-row">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(selectedPrescription.prescribed_date)}</span>
                  </div>
                </div>

                {selectedPrescription.instructions && (
                  <div className="details-section">
                    <h3>Instructions</h3>
                    <div className="instructions-text">
                      {selectedPrescription.instructions}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                <button className="btn-primary" onClick={() => downloadPrescription(selectedPrescription)}>
                  <FaDownload /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== PATIENT VIEW ====================
  if (filteredPrescriptions.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <FaPrescriptionBottle />
        <h3>No prescriptions yet</h3>
        <p>Your prescriptions will appear here after a doctor's visit</p>
      </div>
    );
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2><FaPrescriptionBottle /> My Prescriptions</h2>
        <div className="prescriptions-actions">
          <div className="search-bar">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search medication..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="prescriptions-grid">
        {filteredPrescriptions.map(pres => (
          <div key={pres.id} className="prescription-card">
            <div className="prescription-header">
              <div className="prescription-icon">
                <FaPrescriptionBottle />
              </div>
              <div>
                <span className={getStatusClass(pres.status)}>
                  {pres.status === 'active' ? <FaCheckCircle /> : <FaClock />} {pres.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="prescription-body">
              <h3>{pres.medication_name}</h3>
              <div className="dosage">{pres.dosage} - {pres.frequency}</div>
              <div className="doctor-info">
                <FaUserMd /> Dr. {pres.doctor_name}
              </div>
              <div className="date-info">
                <FaCalendarAlt /> {formatDate(pres.prescribed_date)}
              </div>
              <div className="refills-info">
                <FaSyringe /> Refills left: {pres.refills || 0}
              </div>
            </div>
            <div className="prescription-footer">
              <button className="btn-details" onClick={() => {
                setSelectedPrescription(pres);
                setShowDetailsModal(true);
              }}>
                <FaEye /> Details
              </button>
              <button className="btn-download" onClick={() => downloadPrescription(pres)}>
                <FaDownload /> Download
              </button>
              <button className="btn-print" onClick={() => printPrescription(pres)}>
                <FaPrint /> Print
              </button>
              <button className="btn-share" onClick={() => sharePrescription(pres)}>
                <FaShare /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal for Patient */}
      {showDetailsModal && selectedPrescription && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content prescription-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPrescriptionBottle /> Prescription Details</h2>
              <button onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="details-section">
                <h3>Medication Information</h3>
                <div className="details-row">
                  <span className="label">Medication:</span>
                  <span className="value">{selectedPrescription.medication_name}</span>
                </div>
                <div className="details-row">
                  <span className="label">Dosage:</span>
                  <span className="value">{selectedPrescription.dosage}</span>
                </div>
                <div className="details-row">
                  <span className="label">Frequency:</span>
                  <span className="value">{selectedPrescription.frequency}</span>
                </div>
                <div className="details-row">
                  <span className="label">Refills left:</span>
                  <span className="value">{selectedPrescription.refills || 0}</span>
                </div>
              </div>

              <div className="details-section">
                <h3>Prescriber Information</h3>
                <div className="details-row">
                  <span className="label">Doctor:</span>
                  <span className="value">Dr. {selectedPrescription.doctor_name}</span>
                </div>
                <div className="details-row">
                  <span className="label">Date Prescribed:</span>
                  <span className="value">{formatDate(selectedPrescription.prescribed_date)}</span>
                </div>
              </div>

              {selectedPrescription.instructions && (
                <div className="details-section">
                  <h3>Instructions</h3>
                  <div className="instructions-text">
                    {selectedPrescription.instructions}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => downloadPrescription(selectedPrescription)}>
                <FaDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;