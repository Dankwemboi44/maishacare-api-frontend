// src/components/LabResults/LabResults.js
import React, { useState, useEffect } from 'react';
import { 
  FaFlask, FaDownload, FaEye, FaSpinner, FaCheckCircle, 
  FaClock, FaExclamationTriangle, FaSearch, FaFilter,
  FaChartLine, FaFilePdf, FaShare, FaCalendarAlt, FaUserMd,
  FaUserCircle, FaCheck, FaTimes
} from 'react-icons/fa';

const LabResults = ({ userType, patientId }) => {
  const [labResults, setLabResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState('approved');

  useEffect(() => {
    fetchLabResults();
  }, [patientId, userType]);

  useEffect(() => {
    filterResults();
  }, [searchTerm, statusFilter, labResults]);

  const fetchLabResults = async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/lab-results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLabResults(data);
        setFilteredResults(data);
      } else {
        loadDemoData();
      }
    } catch (error) {
      console.error('Error fetching lab results:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const demoData = [
      {
        id: 1,
        test_name: 'Complete Blood Count (CBC)',
        patient_name: 'John Mwangi',
        patient_id: 3,
        date: '2026-03-15',
        status: 'approved',
        results: {
          'WBC': { value: 7.2, unit: 'x10^3/uL', normal: '4.0-11.0', status: 'normal' },
          'RBC': { value: 4.8, unit: 'x10^6/uL', normal: '4.5-5.9', status: 'normal' },
          'Hemoglobin': { value: 14.2, unit: 'g/dL', normal: '13.5-17.5', status: 'normal' },
          'Platelets': { value: 250, unit: 'x10^3/uL', normal: '150-450', status: 'normal' }
        },
        doctor_notes: 'All values within normal range. Continue current treatment.'
      },
      {
        id: 2,
        test_name: 'Lipid Panel',
        patient_name: 'John Mwangi',
        patient_id: 3,
        date: '2026-03-10',
        status: 'approved',
        results: {
          'Total Cholesterol': { value: 210, unit: 'mg/dL', normal: '<200', status: 'high' },
          'HDL': { value: 45, unit: 'mg/dL', normal: '>40', status: 'normal' },
          'LDL': { value: 130, unit: 'mg/dL', normal: '<100', status: 'high' },
          'Triglycerides': { value: 175, unit: 'mg/dL', normal: '<150', status: 'high' }
        },
        doctor_notes: 'Elevated cholesterol levels. Recommend dietary changes.'
      },
      {
        id: 3,
        test_name: 'Thyroid Function Test',
        patient_name: 'Mary Wanjiku',
        patient_id: 4,
        date: '2026-03-20',
        status: 'pending',
        results: {
          'TSH': { value: 4.5, unit: 'mIU/L', normal: '0.4-4.0', status: 'high' },
          'T3': { value: 120, unit: 'ng/dL', normal: '80-200', status: 'normal' },
          'T4': { value: 5.2, unit: 'ug/dL', normal: '4.5-12', status: 'normal' }
        },
        doctor_notes: null
      },
      {
        id: 4,
        test_name: 'Urinalysis',
        patient_name: 'Peter Ochieng',
        patient_id: 5,
        date: '2026-03-18',
        status: 'pending',
        results: null,
        doctor_notes: null
      }
    ];
    
    setLabResults(demoData);
    setFilteredResults(demoData);
  };

  const filterResults = () => {
    let filtered = [...labResults];
    
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(result => result.status === statusFilter);
    }
    
    setFilteredResults(filtered);
  };

  const downloadResult = (result) => {
    alert(`Downloading ${result.test_name} results for ${result.patient_name}`);
  };

  const submitReview = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/lab-results/${selectedResult.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: reviewStatus,
          notes: reviewNotes
        })
      });
      
      if (response.ok) {
        alert('Lab results reviewed successfully');
        setShowReviewModal(false);
        fetchLabResults();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge approved"><FaCheckCircle /> Reviewed</span>;
      case 'pending':
        return <span className="status-badge pending"><FaClock /> Pending Review</span>;
      case 'needs_followup':
        return <span className="status-badge followup"><FaExclamationTriangle /> Needs Follow-up</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getResultStatusClass = (status) => {
    switch(status) {
      case 'normal': return 'result-normal';
      case 'high': return 'result-high';
      case 'low': return 'result-low';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spin" /> Loading lab results...
      </div>
    );
  }

  return (
    <div className="lab-results-container">
      <div className="page-header-modern">
        <h1><FaFlask /> Lab Results</h1>
        <p>{userType === 'doctor' ? 'Review patient laboratory results' : 'View your laboratory test results'}</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="lab-search-filter">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder={userType === 'doctor' ? "Search by test name or patient..." : "Search by test name..."}
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
          <option value="approved">Reviewed</option>
          <option value="pending">Pending</option>
          <option value="needs_followup">Needs Follow-up</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Found {filteredResults.length} lab result(s)
      </div>

      {/* Lab Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="empty-state">
          <FaFlask />
          <h3>No lab results found</h3>
          <p>No laboratory results are available at this time</p>
        </div>
      ) : (
        <div className="lab-results-grid">
          {filteredResults.map(result => (
            <div key={result.id} className="lab-result-card">
              <div className="lab-result-header">
                <div className="lab-test-info">
                  <div className="lab-icon"><FaFlask /></div>
                  <div>
                    <h3>{result.test_name}</h3>
                    <p className="lab-date"><FaCalendarAlt /> {formatDate(result.date)}</p>
                    {userType === 'doctor' && (
                      <p className="lab-patient"><FaUserCircle /> {result.patient_name}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>

              <div className="lab-result-preview">
                {result.results ? (
                  <div className="results-preview">
                    {Object.entries(result.results).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="preview-item">
                        <span className="preview-name">{key}</span>
                        <span className={`preview-value ${getResultStatusClass(value.status)}`}>
                          {value.value} {value.unit}
                        </span>
                      </div>
                    ))}
                    {Object.keys(result.results).length > 3 && (
                      <div className="more-results">+{Object.keys(result.results).length - 3} more</div>
                    )}
                  </div>
                ) : (
                  <div className="results-pending">
                    <FaClock /> Results pending review
                  </div>
                )}
              </div>

              <div className="lab-result-actions">
                <button className="btn-details" onClick={() => {
                  setSelectedResult(result);
                  setShowDetailsModal(true);
                }}>
                  <FaEye /> View Details
                </button>
                <button className="btn-download" onClick={() => downloadResult(result)}>
                  <FaDownload /> Download PDF
                </button>
                {userType === 'doctor' && result.status === 'pending' && (
                  <button className="btn-review" onClick={() => {
                    setSelectedResult(result);
                    setReviewNotes('');
                    setReviewStatus('approved');
                    setShowReviewModal(true);
                  }}>
                    <FaCheck /> Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content lab-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaFlask /> {selectedResult.test_name}</h2>
              <button onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="lab-info-section">
                <div className="info-row">
                  <span className="label">Patient:</span>
                  <span className="value">{selectedResult.patient_name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Test Date:</span>
                  <span className="value">{formatDate(selectedResult.date)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">{getStatusBadge(selectedResult.status)}</span>
                </div>
              </div>

              {selectedResult.results && (
                <div className="results-table">
                  <h3>Test Results</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Normal Range</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedResult.results).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td className={getResultStatusClass(value.status)}>
                            {value.value} {value.unit}
                          </td>
                          <td>{value.normal}</td>
                          <td>
                            <span className={`result-status ${value.status}`}>
                              {value.status === 'normal' ? '✓ Normal' : value.status === 'high' ? '↑ High' : '↓ Low'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedResult.doctor_notes && (
                <div className="doctor-notes">
                  <h3><FaUserMd /> Doctor's Notes</h3>
                  <p>{selectedResult.doctor_notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => downloadResult(selectedResult)}>
                <FaDownload /> Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal for Doctors */}
      {showReviewModal && selectedResult && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaCheck /> Review Lab Results</h2>
              <button onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="review-info">
                <p><strong>Patient:</strong> {selectedResult.patient_name}</p>
                <p><strong>Test:</strong> {selectedResult.test_name}</p>
                <p><strong>Date:</strong> {formatDate(selectedResult.date)}</p>
              </div>

              <div className="form-group">
                <label>Review Status</label>
                <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}>
                  <option value="approved">✓ Approve - Results Normal</option>
                  <option value="needs_followup">⚠️ Needs Follow-up</option>
                </select>
              </div>

              <div className="form-group">
                <label>Doctor's Notes</label>
                <textarea 
                  rows="4" 
                  placeholder="Add your comments about these results..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .lab-results-container {
          padding: 24px;
        }
        
        .lab-search-filter {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          padding: 10px 18px;
        }
        
        .search-box input {
          flex: 1;
          border: none;
          outline: none;
        }
        
        .filter-select {
          padding: 10px 18px;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          background: white;
          cursor: pointer;
        }
        
        .results-count {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 20px;
        }
        
        .lab-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }
        
        .lab-result-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.2s;
        }
        
        .lab-result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .lab-result-header {
          padding: 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .lab-test-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .lab-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #dbeafe, #ede9fe);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #3b82f6;
        }
        
        .lab-test-info h3 {
          font-size: 1rem;
          margin: 0;
        }
        
        .lab-date {
          font-size: 0.7rem;
          color: #64748b;
          margin: 4px 0 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .lab-patient {
          font-size: 0.7rem;
          color: #3b82f6;
          margin: 2px 0 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.followup {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .lab-result-preview {
          padding: 16px;
        }
        
        .results-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .preview-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        
        .preview-name {
          color: #64748b;
        }
        
        .preview-value {
          font-weight: 500;
        }
        
        .preview-value.result-normal {
          color: #10b981;
        }
        
        .preview-value.result-high {
          color: #ef4444;
        }
        
        .preview-value.result-low {
          color: #f59e0b;
        }
        
        .more-results {
          font-size: 0.7rem;
          color: #3b82f6;
          margin-top: 5px;
        }
        
        .results-pending {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f59e0b;
          font-size: 0.85rem;
        }
        
        .lab-result-actions {
          display: flex;
          gap: 10px;
          padding: 12px 16px;
          border-top: 1px solid #e2e8f0;
          background: #fafafa;
        }
        
        .btn-details, .btn-download, .btn-review {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .btn-details {
          background: #f1f5f9;
          color: #475569;
        }
        
        .btn-details:hover {
          background: #e2e8f0;
        }
        
        .btn-download {
          background: #3b82f6;
          color: white;
        }
        
        .btn-download:hover {
          background: #2563eb;
        }
        
        .btn-review {
          background: #10b981;
          color: white;
        }
        
        .btn-review:hover {
          background: #059669;
        }
        
        .lab-info-section {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        
        .info-row .label {
          width: 100px;
          font-weight: 600;
          color: #64748b;
        }
        
        .results-table {
          margin-bottom: 20px;
          overflow-x: auto;
        }
        
        .results-table h3 {
          font-size: 1rem;
          margin-bottom: 12px;
        }
        
        .results-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .results-table th,
        .results-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .results-table th {
          background: #f8fafc;
          font-weight: 600;
        }
        
        .result-normal {
          color: #10b981;
        }
        
        .result-high {
          color: #ef4444;
          font-weight: 500;
        }
        
        .result-low {
          color: #f59e0b;
        }
        
        .result-status {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 20px;
        }
        
        .result-status.normal {
          background: #d1fae5;
          color: #065f46;
        }
        
        .result-status.high {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .result-status.low {
          background: #fef3c7;
          color: #92400e;
        }
        
        .doctor-notes {
          background: #fef3c7;
          padding: 16px;
          border-radius: 12px;
        }
        
        .doctor-notes h3 {
          font-size: 0.9rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .doctor-notes p {
          font-size: 0.85rem;
          color: #78350f;
          margin: 0;
        }
        
        .review-info {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .review-info p {
          margin: 5px 0;
          font-size: 0.85rem;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
        }
        
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.85rem;
        }
        
        .modal-content {
          max-width: 600px;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .lab-results-grid {
            grid-template-columns: 1fr;
          }
          
          .lab-result-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default LabResults;