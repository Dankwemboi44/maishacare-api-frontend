// src/components/MedicalRecords/MedicalRecords.js
import React, { useState, useEffect } from 'react';
import { 
  FaFolder, FaUpload, FaDownload, FaTrash, FaEye, FaSpinner, 
  FaFilePdf, FaFileImage, FaFileAlt, FaSearch, FaCalendarAlt,
  FaFilter, FaPlus, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaCloudUploadAlt, FaUserMd, FaClock, FaFile, FaImage, FaInfoCircle
} from 'react-icons/fa';

const MedicalRecords = ({ userType, patientId, patientName, isModal = false }) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'other',
    description: '',
    record_date: new Date().toISOString().split('T')[0],
    file: null
  });

  const categories = [
    { id: 'all', name: 'All Records', icon: <FaFolder />, color: '#64748b' },
    { id: 'lab_results', name: 'Lab Results', icon: <FaFileAlt />, color: '#3b82f6' },
    { id: 'prescriptions', name: 'Prescriptions', icon: <FaFilePdf />, color: '#10b981' },
    { id: 'imaging', name: 'Imaging', icon: <FaFileImage />, color: '#8b5cf6' },
    { id: 'other', name: 'Other', icon: <FaFile />, color: '#f59e0b' }
  ];

  useEffect(() => {
    fetchRecords();
  }, [patientId]);

  useEffect(() => {
    filterRecords();
  }, [searchTerm, categoryFilter, records]);

  const fetchRecords = async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    
    try {
      let url = 'http://localhost:5000/api/medical-records';
      
      if (userType === 'doctor' && patientId) {
        url = `http://localhost:5000/api/medical-records?patient_id=${patientId}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setFilteredRecords(data);
      } else {
        console.error('Failed to fetch records:', response.status);
        setRecords([]);
        setFilteredRecords([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];
    
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }
    
    setFilteredRecords(filtered);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload PDF, JPG, or PNG files only');
        return;
      }
      
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      alert('Please select a file');
      return;
    }
    
    if (!uploadForm.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('category', uploadForm.category);
    formData.append('description', uploadForm.description);
    formData.append('date', uploadForm.record_date);
    
    if (userType === 'doctor' && patientId) {
      formData.append('patient_id', patientId);
    }
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const response = await fetch('http://localhost:5000/api/medical-records/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        alert('Record uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          category: 'other',
          description: '',
          record_date: new Date().toISOString().split('T')[0],
          file: null
        });
        setUploadProgress(0);
        fetchRecords();
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Network error. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5000/api/medical-records/${selectedRecord.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Record deleted successfully');
        setShowDeleteConfirm(false);
        setSelectedRecord(null);
        fetchRecords();
      } else {
        alert('Delete failed. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDownload = (record) => {
    if (record.file_url && record.file_url !== '#') {
      window.open(record.file_url, '_blank');
    } else {
      alert('Demo mode: Download would start here.');
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : <FaFileAlt />;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : '#64748b';
  };

  const getCategoryName = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <FaFilePdf style={{ color: '#ef4444' }} />;
    if (fileType?.startsWith('image/')) return <FaFileImage style={{ color: '#3b82f6' }} />;
    return <FaFileAlt style={{ color: '#64748b' }} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Compact Modal View for Doctors
  if (isModal) {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <FaSpinner className="spin" style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px' }}>Loading records...</p>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '8px', padding: '8px 12px' }}>
            <FaSearch size={14} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaUpload /> Upload
          </button>
        </div>
        
        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FaFolder style={{ fontSize: '40px', color: '#94a3b8' }} />
            <p style={{ marginTop: '10px', color: '#64748b' }}>No medical records found</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              style={{ marginTop: '15px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              <FaUpload /> Upload Record
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            {filteredRecords.map(record => (
              <div key={record.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: getCategoryColor(record.category), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {getCategoryIcon(record.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{record.title}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>{formatDate(record.record_date)}</p>
                </div>
                <div>
                  <button onClick={() => handleView(record)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }} title="View">
                    <FaEye color="#3b82f6" />
                  </button>
                  <button onClick={() => handleDownload(record)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }} title="Download">
                    <FaDownload color="#10b981" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full Page View for Patients
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <FaSpinner className="spin" style={{ fontSize: '40px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginLeft: '10px' }}>Loading medical records...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FaFolder /> Medical Records
          </h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>
            {userType === 'doctor' && patientName ? `Medical records for ${patientName}` : 'View and manage your medical documents'}
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
        >
          <FaUpload /> Upload Record
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '10px 18px' }}>
          <FaSearch style={{ color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: '8px 16px',
                background: categoryFilter === cat.id ? cat.color : '#f1f5f9',
                color: categoryFilter === cat.id ? 'white' : '#475569',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
        Found {filteredRecords.length} record(s)
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '20px' }}>
          <FaFolder style={{ fontSize: '48px', color: '#94a3b8' }} />
          <h3>No medical records found</h3>
          <p>Upload your medical documents to keep them organized</p>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ marginTop: '16px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <FaPlus /> Upload Your First Record
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {filteredRecords.map(record => (
            <div key={record.id} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '16px', transition: 'all 0.2s', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: getCategoryColor(record.category), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', flexShrink: 0 }}>
                  {getCategoryIcon(record.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{record.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 8px 0' }}>{record.description || 'No description'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCalendarAlt /> {formatDate(record.record_date)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaUserMd /> {record.uploaded_by_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getFileIcon(record.file_type)} {formatFileSize(record.file_size)}</span>
                  </div>
                  <div>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', color: 'white', background: getCategoryColor(record.category) }}>
                      {getCategoryName(record.category)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={() => handleView(record)}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    onClick={() => handleDownload(record)}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  {userType === 'patient' && (
                    <button 
                      onClick={() => { setSelectedRecord(record); setShowDeleteConfirm(true); }}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowUploadModal(false)}>
          <div style={{ background: 'white', borderRadius: '24px', maxWidth: '550px', width: '90%', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaCloudUploadAlt /> Upload Medical Record</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., Blood Test Results - March 2026"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Category</label>
                <select 
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  <option value="lab_results">Lab Results</option>
                  <option value="prescriptions">Prescriptions</option>
                  <option value="imaging">Imaging (X-ray, MRI, etc.)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Date of Record</label>
                <input 
                  type="date" 
                  value={uploadForm.record_date}
                  onChange={(e) => setUploadForm({...uploadForm, record_date: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Description</label>
                <textarea 
                  rows="3"
                  placeholder="Brief description of the document..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>File <span style={{ color: '#ef4444' }}>*</span></label>
                <div 
                  onClick={() => document.getElementById('fileInput').click()}
                  style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  {uploadForm.file ? (
                    <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <FaCheckCircle /> {uploadForm.file.name}
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt style={{ fontSize: '40px', color: '#94a3b8', marginBottom: '10px' }} />
                      <p>Click to select file</p>
                      <small style={{ color: '#94a3b8' }}>Supported: PDF, JPG, PNG (Max 10MB)</small>
                    </div>
                  )}
                </div>
              </div>
              
              {uploadProgress > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }}></div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowUploadModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleUpload} disabled={uploading} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}>
                {uploading ? <><FaSpinner className="spin" /> Uploading...</> : <><FaUpload /> Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowViewModal(false)}>
          <div style={{ background: 'white', borderRadius: '24px', maxWidth: '500px', width: '90%', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>{getCategoryIcon(selectedRecord.category)} {selectedRecord.title}</h2>
              <button onClick={() => setShowViewModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p><strong>Description:</strong> {selectedRecord.description || 'No description'}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div><strong>Category:</strong> {getCategoryName(selectedRecord.category)}</div>
                <div><strong>Date:</strong> {formatDate(selectedRecord.record_date)}</div>
                <div><strong>Uploaded by:</strong> {selectedRecord.uploaded_by_name}</div>
                <div><strong>File size:</strong> {formatFileSize(selectedRecord.file_size)}</div>
                <div><strong>File type:</strong> {selectedRecord.file_type?.split('/')[1]?.toUpperCase() || 'Unknown'}</div>
                <div><strong>Uploaded on:</strong> {formatDate(selectedRecord.createdAt)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                {getFileIcon(selectedRecord.file_type)}
                <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>Click download to view the full document</p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowViewModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
              <button onClick={() => handleDownload(selectedRecord)} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ background: 'white', borderRadius: '24px', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaExclamationTriangle style={{ color: '#ef4444' }} /> Confirm Delete</h2>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <p>Are you sure you want to delete <strong>{selectedRecord.title}</strong>?</p>
              <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>This action cannot be undone.</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MedicalRecords;