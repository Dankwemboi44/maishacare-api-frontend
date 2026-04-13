// src/components/Prescriptions/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { 
  FaPrescriptionBottle, FaDownload, FaPrint, FaShareAlt, 
  FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle, 
  FaSpinner, FaEye, FaFilePdf, FaFileImage, FaFileAlt,
  FaInfoCircle, FaPlus, FaSearch, FaFilter
} from 'react-icons/fa';
import './Prescriptions.css';

const Prescriptions = ({ patientId, userType = 'patient' }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloading, setDownloading] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    setLoading(true);
    const token = getAuthToken();
    const userId = patientId || localStorage.getItem('userId') || localStorage.getItem('patientId');
    
    try {
      let url = 'http://localhost:5000/api/prescriptions';
      if (userType === 'patient' && userId) {
        url = `http://localhost:5000/api/prescriptions?patient_id=${userId}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        // Fallback demo data
        setPrescriptions([
          { 
            id: 1, 
            medication_name: 'Lisinopril', 
            dosage: '10mg', 
            frequency: 'Once daily',
            instructions: 'Take in the morning with food',
            refills: 2,
            prescribed_date: '2024-01-10',
            doctor_name: 'Dr. Sarah Chen',
            status: 'active',
            document_url: '/prescriptions/lisinopril.pdf',
            document_type: 'pdf'
          },
          { 
            id: 2, 
            medication_name: 'Metformin', 
            dosage: '500mg', 
            frequency: 'Twice daily',
            instructions: 'Take with meals',
            refills: 1,
            prescribed_date: '2024-02-15',
            doctor_name: 'Dr. Sarah Chen',
            status: 'active',
            document_url: '/prescriptions/metformin.pdf',
            document_type: 'pdf'
          },
          { 
            id: 3, 
            medication_name: 'Atorvastatin', 
            dosage: '20mg', 
            frequency: 'Once daily at bedtime',
            instructions: 'Take at the same time each night',
            refills: 0,
            prescribed_date: '2023-11-20',
            doctor_name: 'Dr. Michael Chen',
            status: 'expired',
            document_url: null
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download prescription document
  const downloadPrescription = async (prescription) => {
    setDownloading(prescription.id);
    
    try {
      // If document_url exists, download it
      if (prescription.document_url) {
        // In a real app, this would fetch from your backend
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/prescriptions/${prescription.id}/download`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${prescription.medication_name}_prescription.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          // Generate a PDF if no document exists
          generateAndDownloadPDF(prescription);
        }
      } else {
        // Generate PDF from prescription data
        generateAndDownloadPDF(prescription);
      }
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: generate PDF
      generateAndDownloadPDF(prescription);
    } finally {
      setDownloading(null);
    }
  };

  // Generate PDF from prescription data
  const generateAndDownloadPDF = (prescription) => {
    // Create a printable HTML document
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${prescription.medication_name}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #1e293b;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #64748b;
            font-size: 12px;
          }
          .prescription-card {
            background: #f8fafc;
            padding: 24px;
            border-radius: 12px;
            margin: 20px 0;
          }
          .doctor-info, .patient-info {
            margin-bottom: 24px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .medication-details {
            margin: 24px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .medication-name {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 12px;
          }
          .dosage {
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 8px;
          }
          .instructions {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px dashed #cbd5e1;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #94a3b8;
          }
          .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          h3 {
            margin-bottom: 12px;
            color: #0f172a;
          }
          .label {
            font-weight: 600;
            color: #475569;
            width: 120px;
            display: inline-block;
          }
          .value {
            color: #1e293b;
          }
          .row {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MaishaCare AI</div>
          <div class="subtitle">AI Powered Health Assistant</div>
        </div>
        
        <div class="doctor-info">
          <h3>Prescribing Physician</h3>
          <div class="row"><span class="label">Doctor:</span><span class="value">${prescription.doctor_name || 'Dr. Sarah Chen'}</span></div>
          <div class="row"><span class="label">Specialty:</span><span class="value">Cardiology</span></div>
          <div class="row"><span class="label">License No:</span><span class="value">MD-12345</span></div>
        </div>
        
        <div class="patient-info">
          <h3>Patient Information</h3>
          <div class="row"><span class="label">Name:</span><span class="value">${localStorage.getItem('userName') || 'Patient'}</span></div>
          <div class="row"><span class="label">Date:</span><span class="value">${new Date().toLocaleDateString()}</span></div>
        </div>
        
        <div class="prescription-card">
          <div class="medication-details">
            <div class="medication-name">${prescription.medication_name}</div>
            <div class="dosage">${prescription.dosage} - ${prescription.frequency}</div>
            <div class="row"><span class="label">Refills:</span><span class="value">${prescription.refills}</span></div>
            <div class="instructions">
              <strong>Instructions:</strong><br>
              ${prescription.instructions || 'Take as directed by your physician.'}
            </div>
          </div>
        </div>
        
        <div class="signature">
          <div class="row">_________________________</div>
          <div class="row">Doctor's Signature</div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated prescription. For any questions, please contact your pharmacy.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prescription.medication_name}_prescription.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Print prescription
  const printPrescription = (prescription) => {
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${prescription.medication_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .doctor-info, .patient-info { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .medication { margin: 20px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
          .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MaishaCare AI</div>
          <p>AI Powered Health Assistant</p>
        </div>
        <div class="doctor-info">
          <h3>Prescribing Physician</h3>
          <p><strong>Doctor:</strong> ${prescription.doctor_name || 'Dr. Sarah Chen'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="patient-info">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> ${localStorage.getItem('userName') || 'Patient'}</p>
        </div>
        <div class="medication">
          <h3>Medication</h3>
          <p><strong>Name:</strong> ${prescription.medication_name}</p>
          <p><strong>Dosage:</strong> ${prescription.dosage}</p>
          <p><strong>Frequency:</strong> ${prescription.frequency}</p>
          <p><strong>Refills:</strong> ${prescription.refills}</p>
          <p><strong>Instructions:</strong> ${prescription.instructions || 'Take as directed'}</p>
        </div>
        <div class="footer">
          <p>This is a computer-generated prescription.</p>
        </div>
        <button onclick="window.print()" class="no-print" style="margin-top:20px;padding:10px20px;background:#3b82f6;color:white;border:none;border-radius:5px;cursor:pointer;">Print</button>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Share prescription
  const sharePrescription = async (prescription) => {
    const shareData = {
      title: `Prescription - ${prescription.medication_name}`,
      text: `Medication: ${prescription.medication_name} ${prescription.dosage}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${prescription.medication_name} ${prescription.dosage} - ${prescription.frequency}`);
      alert('Prescription details copied to clipboard!');
    }
  };

  // Get document icon
  const getDocumentIcon = (type) => {
    switch(type) {
      case 'pdf': return <FaFilePdf />;
      case 'image': return <FaFileImage />;
      default: return <FaFileAlt />;
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = p.medication_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

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

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2><FaPrescriptionBottle /> My Prescriptions</h2>
        <div className="prescriptions-actions">
          <div className="search-bar">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search medications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="prescriptions-grid">
        {filteredPrescriptions.length === 0 ? (
          <div className="empty-state">
            <FaPrescriptionBottle />
            <h3>No prescriptions found</h3>
            <p>Your prescriptions will appear here once issued by your doctor</p>
          </div>
        ) : (
          filteredPrescriptions.map(prescription => (
            <div key={prescription.id} className="prescription-card">
              <div className="prescription-header">
                <div className="prescription-icon">
                  <FaPrescriptionBottle />
                </div>
                <div className="prescription-status">
                  <span className={getStatusClass(prescription.status)}>
                    {prescription.status || 'active'}
                  </span>
                </div>
              </div>
              
              <div className="prescription-body">
                <h3>{prescription.medication_name}</h3>
                <p className="dosage">{prescription.dosage} - {prescription.frequency}</p>
                <p className="doctor-info">
                  <FaUserMd /> {prescription.doctor_name || 'Dr. Sarah Chen'}
                </p>
                <p className="date-info">
                  <FaCalendarAlt /> Prescribed: {new Date(prescription.prescribed_date).toLocaleDateString()}
                </p>
                <p className="refills-info">
                  Refills left: {prescription.refills}
                </p>
              </div>
              
              <div className="prescription-footer">
                <button 
                  className="btn-details" 
                  onClick={() => {
                    setSelectedPrescription(prescription);
                    setShowDetailsModal(true);
                  }}
                >
                  <FaEye /> Details
                </button>
                
                <button 
                  className="btn-download" 
                  onClick={() => downloadPrescription(prescription)}
                  disabled={downloading === prescription.id}
                >
                  {downloading === prescription.id ? <FaSpinner className="spin" /> : <FaDownload />} 
                  Download
                </button>
                
                <button 
                  className="btn-print" 
                  onClick={() => printPrescription(prescription)}
                >
                  <FaPrint /> Print
                </button>
                
                <button 
                  className="btn-share" 
                  onClick={() => sharePrescription(prescription)}
                >
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))
        )}
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
                  <span className="label">Instructions:</span>
                  <span className="value">{selectedPrescription.instructions || 'Take as directed'}</span>
                </div>
                <div className="details-row">
                  <span className="label">Refills:</span>
                  <span className="value">{selectedPrescription.refills}</span>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Prescriber Information</h3>
                <div className="details-row">
                  <span className="label">Doctor:</span>
                  <span className="value">{selectedPrescription.doctor_name || 'Dr. Sarah Chen'}</span>
                </div>
                <div className="details-row">
                  <span className="label">Prescribed Date:</span>
                  <span className="value">{new Date(selectedPrescription.prescribed_date).toLocaleDateString()}</span>
                </div>
                <div className="details-row">
                  <span className="label">Expires:</span>
                  <span className="value">{new Date(selectedPrescription.expires_at || '2026-12-31').toLocaleDateString()}</span>
                </div>
              </div>
              
              {selectedPrescription.document_url && (
                <div className="details-section">
                  <h3>Document</h3>
                  <div className="document-preview">
                    {getDocumentIcon(selectedPrescription.document_type)}
                    <span>Prescription Document</span>
                    <button 
                      className="btn-download-sm"
                      onClick={() => downloadPrescription(selectedPrescription)}
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => downloadPrescription(selectedPrescription)}>
                <FaDownload /> Download Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;