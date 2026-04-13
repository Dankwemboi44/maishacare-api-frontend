// src/components/MedicalRecords/MedicalRecordsUpload.js
import React, { useState, useEffect } from 'react';
import { 
  FaUpload, FaFilePdf, FaFileImage, FaFileAlt, FaTrash, 
  FaDownload, FaEye, FaSpinner, FaFolder, FaCloudUploadAlt,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

const MedicalRecordsUpload = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    title: '',
    category: 'lab_results',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: 'lab_results', label: 'Lab Results', icon: <FaFileAlt /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FaFilePdf /> },
    { id: 'imaging', label: 'Imaging/X-Ray', icon: <FaFileImage /> },
    { id: 'vaccination', label: 'Vaccination Records', icon: <FaFileAlt /> },
    { id: 'other', label: 'Other', icon: <FaFolder /> }
  ];

  const getAuthToken = () => localStorage.getItem('authToken');

  const fetchRecords = async () => {
    setLoading(true);
    const token = getAuthToken();
    
    try {
      const response = await fetch(`http://localhost:5000/api/medical-records?patient_id=${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        // Demo data
        setRecords([
          { id: 1, title: 'Blood Test Results', category: 'lab_results', file_name: 'blood_test.pdf', file_size: 245000, uploaded_at: '2026-03-15', status: 'approved' },
          { id: 2, title: 'Chest X-Ray', category: 'imaging', file_name: 'chest_xray.jpg', file_size: 1200000, uploaded_at: '2026-03-10', status: 'pending' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', fileDetails.title);
    formData.append('category', fileDetails.category);
    formData.append('description', fileDetails.description);
    formData.append('date', fileDetails.date);
    formData.append('patient_id', patientId);

    try {
      const response = await fetch('http://localhost:5000/api/medical-records/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);
        setShowUploadModal(false);
        setSelectedFile(null);
        setFileDetails({ title: '', category: 'lab_results', description: '', date: new Date().toISOString().split('T')[0] });
        alert('File uploaded successfully!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const token = getAuthToken();
      try {
        const response = await fetch(`http://localhost:5000/api/medical-records/${recordId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          setRecords(records.filter(r => r.id !== recordId));
          alert('Record deleted successfully');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const downloadRecord = async (record) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`http://localhost:5000/api/medical-records/${record.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = record.file_name;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const getFileIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : <FaFileAlt />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const filteredRecords = selectedCategory === 'all' 
    ? records 
    : records.filter(r => r.category === selectedCategory);

  useEffect(() => {
    fetchRecords();
  }, [patientId]);

  return (
    <div className="medical-records-upload">
      <div className="records-header">
        <h2><FaFolder /> Medical Records</h2>
        <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
          <FaCloudUploadAlt /> Upload Record
        </button>
      </div>

      <div className="categories-filter">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><FaSpinner className="spin" /> Loading records...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-records">
          <FaFolder />
          <h3>No medical records found</h3>
          <p>Upload your first medical record to get started</p>
        </div>
      ) : (
        <div className="records-grid">
          {filteredRecords.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-icon">
                {getFileIcon(record.category)}
              </div>
              <div className="record-info">
                <h4>{record.title}</h4>
                <p className="record-date">{new Date(record.uploaded_at).toLocaleDateString()}</p>
                <p className="record-size">{formatFileSize(record.file_size)}</p>
                <span className={`record-status ${record.status}`}>{record.status}</span>
              </div>
              <div className="record-actions">
                <button className="icon-btn" onClick={() => downloadRecord(record)} title="Download">
                  <FaDownload />
                </button>
                <button className="icon-btn" onClick={() => deleteRecord(record.id)} title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaCloudUploadAlt /> Upload Medical Record</h2>
              <button onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                <FaUpload />
                <p>Click to select file</p>
                <small>PDF, JPG, PNG, DOC (Max 10MB)</small>
                {selectedFile && <p className="selected-file">Selected: {selectedFile.name}</p>}
              </div>
              <input 
                id="fileInput" 
                type="file" 
                style={{ display: 'none' }} 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Blood Test Results" 
                  value={fileDetails.title}
                  onChange={(e) => setFileDetails({...fileDetails, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={fileDetails.category}
                  onChange={(e) => setFileDetails({...fileDetails, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={fileDetails.date}
                  onChange={(e) => setFileDetails({...fileDetails, date: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  rows="3" 
                  placeholder="Additional notes about this record..."
                  value={fileDetails.description}
                  onChange={(e) => setFileDetails({...fileDetails, description: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleFileUpload} disabled={!selectedFile || uploading}>
                {uploading ? <FaSpinner className="spin" /> : <FaUpload />} Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsUpload;