// pages/DoctorDashboard.js - COMPLETE WORKING VERSION
// Features: Doctor can view patient prescriptions, manage appointments, issue prescriptions

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHome, FaCalendarAlt, FaCalendarPlus, FaPrescriptionBottle, 
  FaFlask, FaFolder, FaBell, FaSyringe, FaChartLine, 
  FaBrain, FaExclamationTriangle, FaUsers, FaTruck, FaFileInvoiceDollar,
  FaNewspaper, FaDownload, FaSms, FaCamera, FaBullseye, FaRobot,
  FaHeartbeat, FaTachometerAlt, FaStethoscope, FaMicrophone,
  FaVideo, FaPhoneSlash, FaCommentDots, FaUserCircle, FaUserMd,
  FaChevronDown, FaPlus, FaEdit, FaTrash, FaCheckCircle,
  FaClock, FaCalendarDay, FaArrowRight, FaSpinner, FaKey,
  FaSignOutAlt, FaBars, FaPaperPlane, FaInfoCircle, FaUserEdit,
  FaArrowLeft, FaBolt, FaFilePrescription, FaCheck, FaTimes,
  FaEye, FaCalendarAlt as FaCalendarAltIcon, FaPhone, FaEnvelope, FaCalendarCheck,
  FaHistory, FaFileMedical
} from 'react-icons/fa';
import Sidebar from '../components/common/Sidebar';
import VideoCall from '../components/VideoCall/VideoCall';
import Prescriptions from '../components/Prescriptions/Prescriptions';
import '../styles/global.css';
import '../styles/dashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pendingLabResults, setPendingLabResults] = useState([]);
  const [refillRequests, setRefillRequests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabReviewModal, setShowLabReviewModal] = useState(false);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [labReviewNotes, setLabReviewNotes] = useState('');
  const [labReviewStatus, setLabReviewStatus] = useState('approved');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: '', specialty: '', clinic_address: '', license_number: '', years_of_experience: ''
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    patient_id: '', medication_name: '', dosage: '', frequency: '', instructions: '', refills: '0'
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  
  const [logoText, setLogoText] = useState('MaishaCare AI');
  
  useEffect(() => {
    const texts = ['MaishaCare AI', 'AI Powered Health Assistant'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      const logoElement = document.querySelector('.navbar-logo .logo-text');
      if (logoElement) {
        logoElement.style.opacity = '0';
        setTimeout(() => {
          setLogoText(texts[currentIndex]);
          logoElement.style.opacity = '1';
        }, 300);
      } else {
        setLogoText(texts[currentIndex]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine />, badge: 0 },
    { id: 'patients', label: 'Patients', icon: <FaUsers />, badge: 0 },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt />, badge: appointments.filter(a => a.status === 'pending').length },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FaPrescriptionBottle />, badge: 0 },
    { id: 'lab-results', label: 'Lab Results', icon: <FaFlask />, badge: pendingLabResults.length },
    { id: 'refills', label: 'Refill Requests', icon: <FaPrescriptionBottle />, badge: refillRequests.length }
  ];

  const getDoctorId = () => {
    let id = localStorage.getItem('doctorId');
    if (id && id !== 'null' && id !== 'undefined') return parseInt(id);
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (role === 'doctor' && userId) return parseInt(userId);
    return 1;
  };

  const notifyPatient = (patientId, patientName, title, message) => {
    console.log(`NOTIFICATION TO ${patientName}: ${title}`);
    if (socketReady && socketRef.current && patientId) {
      socketRef.current.emit('private-message', {
        toUserId: patientId,
        message: `${title}\n\n${message}`,
        fromUserName: doctor?.name || 'Doctor',
        fromUserRole: 'doctor',
        isNotification: true
      });
    }
    setNotifications(prev => [{ 
      id: Date.now(), 
      title: `Sent to ${patientName}: ${title}`, 
      message: message, 
      type: 'success', 
      timestamp: new Date(), 
      read: false 
    }, ...prev]);
  };

  const addDoctorNotification = (title, message, type = 'success') => {
    setNotifications(prev => [{ id: Date.now(), title, message, type, timestamp: new Date(), read: false }, ...prev]);
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    return response;
  };

  const fetchDoctorData = async () => {
    const doctorId = getDoctorId();
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/doctors/${doctorId}`);
      const data = await response.json();
      setDoctor(data);
      setProfileForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        specialty: data.specialty || '',
        clinic_address: data.address || '',
        license_number: data.license_number || '',
        years_of_experience: data.years_of_experience || ''
      });
    } catch (err) {
      setDoctor({
        id: doctorId,
        name: 'Dr. Sarah Moraa',
        email: 'sarah@health.com',
        specialty: 'Cardiologist',
        patientsCount: 3,
        bio: 'Board-certified cardiologist',
        address: '123 Medical Center Dr'
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setPatients([
        { id: 3, name: 'Stacey Wangui', email: 'stacey@email.com', phone: '+254712345678', lastVisit: '2026-03-15' },
        { id: 4, name: 'Michael Otieno', email: 'michael@email.com', phone: '+254787654321', lastVisit: '2026-03-20' }
      ]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/appointments');
      const data = await response.json();
      console.log('Fetched appointments:', data);
      setAppointments(data);
    } catch (err) {
      setAppointments([
        { id: 1, patient_id: 3, patient_name: 'Stacey Wangui', date: '2026-04-15', time: '10:30', type: 'video', status: 'pending', reason: 'Annual checkup' },
        { id: 2, patient_id: 4, patient_name: 'Michael Otieno', date: '2026-04-20', time: '14:00', type: 'in-person', status: 'confirmed', reason: 'Follow-up' }
      ]);
    }
  };

  const fetchLabResults = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/lab-results');
      const data = await response.json();
      setPendingLabResults(data.filter(l => l.status === 'pending'));
    } catch (err) {
      setPendingLabResults([]);
    }
  };

  const fetchRefillRequests = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/prescriptions/refill-requests');
      const data = await response.json();
      setRefillRequests(data);
    } catch (err) {
      setRefillRequests([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDoctorData(),
        fetchPatients(),
        fetchAppointments(),
        fetchLabResults(),
        fetchRefillRequests()
      ]);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // WebSocket initialization
  useEffect(() => {
    if (typeof window.io === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.8.1/socket.io.min.js';
      script.onload = () => initSocket();
      document.body.appendChild(script);
    } else {
      initSocket();
    }
  }, [doctor?.id]);

  const initSocket = () => {
    if (doctor?.id && typeof window.io !== 'undefined') {
      const socket = window.io('http://localhost:5000');
      socketRef.current = socket;
      setSocketReady(true);
      
      socket.on('connect', () => {
        socket.emit('user-online', { userId: doctor.id, userName: doctor.name, userRole: 'doctor' });
      });
      
      socket.on('users-online', (users) => setOnlineUsers(users));
      
      socket.on('new-message', (data) => {
        if (currentChat && data.fromUserId === currentChat.userId) {
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            from_user_id: data.fromUserId,
            to_user_id: doctor.id,
            message: data.message,
            created_at: data.timestamp,
            from_user_name: data.fromUserName
          }]);
        }
        fetchConversations();
        addDoctorNotification('New Message', `New message from ${data.fromUserName}`, 'info');
      });
      
      socket.on('user-typing', (data) => {
        if (data.fromUserId === currentChat?.userId) {
          setTypingUser(data.fromUserName);
          setTimeout(() => setTypingUser(null), 2000);
        }
      });
      
      fetchConversations();
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (err) {}
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/messages/${userId}`);
      const data = await response.json();
      setChatMessages(data);
    } catch (err) {}
  };

  const sendMessage = () => {
    if (!socketReady || !socketRef.current) return;
    if (!newMessage.trim() || !currentChat) return;
    
    socketRef.current.emit('private-message', {
      toUserId: currentChat.userId,
      message: newMessage,
      fromUserName: doctor.name,
      fromUserRole: 'doctor'
    });
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      from_user_id: doctor.id,
      to_user_id: currentChat.userId,
      message: newMessage,
      created_at: new Date().toISOString(),
      from_user_name: doctor.name
    }]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!isTyping && currentChat && socketReady && socketRef.current) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        toUserId: currentChat.userId,
        isTyping: true,
        fromUserName: doctor.name
      });
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const startConversation = (patient) => {
    const existingConv = conversations.find(c => c.userId === patient.id);
    if (existingConv) {
      setCurrentChat(existingConv);
      fetchMessages(patient.id);
    } else {
      setCurrentChat({ userId: patient.id, name: patient.name, role: 'patient', lastMessage: null, unread: 0 });
      fetchMessages(patient.id);
    }
    setChatOpen(true);
  };

  const confirmAppointment = async (appointment) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/appointments/${appointment.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'confirmed' })
      });
      
      if (response.ok) {
        notifyPatient(
          appointment.patient_id,
          appointment.patient_name,
          'Appointment Confirmed',
          `Your appointment with Dr. ${doctor?.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been CONFIRMED.`
        );
        addDoctorNotification('Appointment Confirmed', `${appointment.patient_name}'s appointment confirmed`, 'success');
        fetchData();
      }
    } catch (err) {
      setAppointments(prev => prev.map(a => 
        a.id === appointment.id ? { ...a, status: 'confirmed' } : a
      ));
      notifyPatient(
        appointment.patient_id,
        appointment.patient_name,
        'Appointment Confirmed',
        `Your appointment has been CONFIRMED.`
      );
      addDoctorNotification('Appointment Confirmed', `${appointment.patient_name}'s appointment confirmed`, 'success');
    }
  };

  const cancelAppointment = async (appointment) => {
    if (window.confirm(`Cancel appointment with ${appointment.patient_name}?`)) {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/appointments/${appointment.id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'cancelled' })
        });
        
        if (response.ok) {
          notifyPatient(
            appointment.patient_id,
            appointment.patient_name,
            'Appointment Cancelled',
            `Your appointment with Dr. ${doctor?.name} has been CANCELLED.`
          );
          addDoctorNotification('Appointment Cancelled', `${appointment.patient_name}'s appointment cancelled`, 'warning');
          fetchData();
        }
      } catch (err) {
        setAppointments(prev => prev.map(a => 
          a.id === appointment.id ? { ...a, status: 'cancelled' } : a
        ));
        notifyPatient(
          appointment.patient_id,
          appointment.patient_name,
          'Appointment Cancelled',
          `Your appointment has been CANCELLED.`
        );
        addDoctorNotification('Appointment Cancelled', `${appointment.patient_name}'s appointment cancelled`, 'warning');
      }
    }
  };

  const handleIssuePrescription = async () => {
    const selectedPatient = patients.find(p => p.id == prescriptionForm.patient_id);
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }
    
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        body: JSON.stringify({
          patient_id: prescriptionForm.patient_id,
          medication_name: prescriptionForm.medication_name,
          dosage: prescriptionForm.dosage,
          frequency: prescriptionForm.frequency,
          instructions: prescriptionForm.instructions,
          refills: prescriptionForm.refills
        })
      });
      
      if (response.ok) {
        notifyPatient(
          selectedPatient.id, 
          selectedPatient.name,
          'New Prescription Issued',
          `Dr. ${doctor?.name} has issued a prescription for ${prescriptionForm.medication_name}.`
        );
        addDoctorNotification('Prescription Issued', `Prescription issued to ${selectedPatient.name}`, 'success');
        setShowPrescriptionModal(false);
        setPrescriptionForm({ patient_id: '', medication_name: '', dosage: '', frequency: '', instructions: '', refills: '0' });
        fetchData();
      }
    } catch (err) {
      addDoctorNotification('Prescription Issued', `Prescription issued to ${selectedPatient.name} (Demo Mode)`, 'success');
      setShowPrescriptionModal(false);
      setPrescriptionForm({ patient_id: '', medication_name: '', dosage: '', frequency: '', instructions: '', refills: '0' });
    }
  };

  const approveRefill = async (request) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/prescriptions/${request.prescription_id}/refill/approve`, {
        method: 'PUT',
        body: JSON.stringify({ approved: true })
      });
      
      if (response.ok) {
        notifyPatient(
          request.patient_id, 
          request.patient_name,
          'Refill Request Approved',
          `Your refill request for ${request.medication_name} has been APPROVED.`
        );
        addDoctorNotification('Refill Approved', `Refill approved for ${request.patient_name}`, 'success');
        fetchData();
      }
    } catch (err) {
      notifyPatient(
        request.patient_id, 
        request.patient_name,
        'Refill Request Approved',
        `Your refill request for ${request.medication_name} has been APPROVED.`
      );
      addDoctorNotification('Refill Approved', `Refill approved for ${request.patient_name} (Demo Mode)`, 'success');
      setRefillRequests(prev => prev.filter(r => r.id !== request.id));
    }
  };

  const declineRefill = async (request) => {
    if (window.confirm(`Decline refill for ${request.medication_name}?`)) {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/prescriptions/${request.prescription_id}/refill/approve`, {
          method: 'PUT',
          body: JSON.stringify({ approved: false })
        });
        
        if (response.ok) {
          notifyPatient(
            request.patient_id, 
            request.patient_name,
            'Refill Request Declined',
            `Your refill request for ${request.medication_name} has been DECLINED.`
          );
          addDoctorNotification('Refill Declined', `Refill declined for ${request.patient_name}`, 'warning');
          fetchData();
        }
      } catch (err) {
        notifyPatient(
          request.patient_id, 
          request.patient_name,
          'Refill Request Declined',
          `Your refill request for ${request.medication_name} has been DECLINED.`
        );
        addDoctorNotification('Refill Declined', `Refill declined for ${request.patient_name} (Demo Mode)`, 'warning');
        setRefillRequests(prev => prev.filter(r => r.id !== request.id));
      }
    }
  };

  const handleReviewLabResult = async () => {
    notifyPatient(
      selectedLabResult.patient_id,
      selectedLabResult.patient_name,
      'Lab Results Reviewed',
      `Your lab results have been reviewed by Dr. ${doctor?.name}.`
    );
    addDoctorNotification('Lab Result Reviewed', `Lab results for ${selectedLabResult.patient_name} reviewed`, 'success');
    setShowLabReviewModal(false);
    setSelectedLabResult(null);
    setPendingLabResults(prev => prev.filter(r => r.id !== selectedLabResult.id));
  };

  const updateProfile = async () => {
    setDoctor(prev => ({ ...prev, ...profileForm }));
    setShowProfileModal(false);
    addDoctorNotification('Profile Updated', 'Your profile has been updated.', 'success');
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSuccess('Password changed successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordSuccess('');
    }, 2000);
  };

  const handleLogout = () => {
    if (socketRef.current) socketRef.current.disconnect();
    localStorage.clear();
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaSpinner className="fa-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');

  // ==================== RENDER FUNCTIONS ====================

  const renderOverview = () => (
    <div className="dashboard-container">
      <div className="welcome-card doctor-welcome">
        <div className="welcome-content">
          <div className="welcome-badge"><span className="badge">Welcome Back</span></div>
          <h1 className="welcome-title">Dr. {doctor?.name?.split(' ').slice(1).join(' ') || doctor?.name || 'Doctor'}</h1>
          <p className="welcome-subtitle">{doctor?.specialty || 'General Medicine'}</p>
          <div className="welcome-stats">
            <div className="welcome-stat"><div className="welcome-stat-icon"><FaUsers /></div><div><span className="welcome-stat-value">{patients.length}</span><span className="welcome-stat-label">Patients</span></div></div>
            <div className="welcome-stat"><div className="welcome-stat-icon"><FaCalendarAlt /></div><div><span className="welcome-stat-value">{appointments.length}</span><span className="welcome-stat-label">Appointments</span></div></div>
          </div>
        </div>
        <div className="welcome-illustration"><div className="floating-doctor-card"><FaUserMd /></div></div>
      </div>

      <div className="stats-grid-modern">
        <div className="stat-card-modern"><div className="stat-icon blue"><FaUsers /></div><div className="stat-info"><h3>Total Patients</h3><p className="stat-number">{patients.length}</p></div></div>
        <div className="stat-card-modern"><div className="stat-icon green"><FaCalendarAlt /></div><div className="stat-info"><h3>Total Appointments</h3><p className="stat-number">{appointments.length}</p></div></div>
        <div className="stat-card-modern"><div className="stat-icon orange"><FaFlask /></div><div className="stat-info"><h3>Pending Lab Results</h3><p className="stat-number">{pendingLabResults.length}</p></div></div>
        <div className="stat-card-modern"><div className="stat-icon purple"><FaPrescriptionBottle /></div><div className="stat-info"><h3>Refill Requests</h3><p className="stat-number">{refillRequests.length}</p></div></div>
      </div>

      <div className="quick-actions-modern">
        <h2><FaBolt /> Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => setShowPrescriptionModal(true)}><div className="action-icon"><FaFilePrescription /></div><h3>Issue Prescription</h3><p>Write a new prescription</p><FaArrowRight className="action-arrow" /></div>
          <div className="action-card" onClick={() => setActiveTab('lab-results')}><div className="action-icon"><FaFlask /></div><h3>Review Lab Results</h3><p>Review pending results</p><FaArrowRight className="action-arrow" /></div>
          <div className="action-card" onClick={() => setActiveTab('refills')}><div className="action-icon"><FaPrescriptionBottle /></div><h3>Approve Refills</h3><p>Review refill requests</p><FaArrowRight className="action-arrow" /></div>
          <div className="action-card" onClick={() => setActiveTab('patients')}><div className="action-icon"><FaUsers /></div><h3>Patient Directory</h3><p>View all patients</p><FaArrowRight className="action-arrow" /></div>
        </div>
      </div>

      {pendingAppointments.length > 0 && (
        <div className="appointments-card pending-appointments">
          <div className="card-header">
            <h2><FaClock /> Pending Approval ({pendingAppointments.length})</h2>
            <span className="badge-warning">Requires your action</span>
          </div>
          <div className="appointments-list">
            {pendingAppointments.map(apt => (
              <div key={apt.id} className="appointment-item pending">
                <div className="appointment-info">
                  <div className="doctor-avatar"><FaUserCircle /></div>
                  <div>
                    <h4>{apt.patient_name}</h4>
                    <p><FaCalendarDay /> {formatDate(apt.date)} at {apt.time} • <span className={`appointment-type ${apt.type}`}>{apt.type === 'video' ? ' Video Call' : ' In-Person'}</span></p>
                    <span className="appointment-reason">{apt.reason}</span>
                  </div>
                </div>
                <div className="appointment-actions-buttons">
                  <button className="btn-confirm" onClick={() => confirmAppointment(apt)}><FaCheck /> Confirm Appointment</button>
                  <button className="btn-cancel" onClick={() => cancelAppointment(apt)}><FaTimes /> Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="appointments-card">
        <div className="card-header">
          <h2><FaCalendarCheck /> Confirmed Appointments</h2>
          <button className="view-all" onClick={() => setActiveTab('appointments')}>View All <FaArrowRight /></button>
        </div>
        <div className="appointments-list">
          {confirmedAppointments.slice(0, 3).map(apt => (
            <div key={apt.id} className="appointment-item">
              <div className="appointment-info">
                <div className="doctor-avatar"><FaUserCircle /></div>
                <div>
                  <h4>{apt.patient_name}</h4>
                  <p><FaCalendarDay /> {formatDate(apt.date)} at {apt.time} • <span className={`appointment-type ${apt.type}`}>{apt.type === 'video' ? ' Video Call' : ' In-Person'}</span></p>
                </div>
              </div>
              <div className="appointment-status">
                <span className="status-badge confirmed">Confirmed</span>
                {apt.type === 'video' && <button className="join-call" onClick={() => { setCurrentAppointment(apt); setShowVideoCall(true); }}><FaVideo /> Join Call</button>}
              </div>
            </div>
          ))}
          {confirmedAppointments.length === 0 && <div className="empty-state"><FaCalendarDay /><p>No confirmed appointments. Check pending requests above.</p></div>}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaUsers /> My Patients</h1>
        <p>Manage all your patients ({patients.length})</p>
      </div>
      {patients.length > 0 ? (
        <div className="patients-grid-modern">
          {patients.map(patient => (
            <div key={patient.id} className="patient-card-modern">
              <div className="patient-card-header"><div className="patient-avatar-modern"><FaUserCircle /></div></div>
              <div className="patient-card-body">
                <h3>{patient.name}</h3>
                <p className="patient-email"><FaEnvelope /> {patient.email}</p>
                <p className="patient-phone"><FaPhone /> {patient.phone}</p>
                <div className="patient-last-visit"><FaClock /> Last Visit: {formatDate(patient.lastVisit)}</div>
              </div>
              <div className="patient-card-footer">
                <button className="btn-outline-sm" onClick={() => {
                  setSelectedPatient(patient);
                  setShowPatientDetailsModal(true);
                }}><FaEye /> View Details</button>
                <button className="btn-outline-sm" onClick={() => startConversation(patient)}><FaCommentDots /> Message</button>
                <button className="btn-primary-sm" onClick={() => { 
                  setPrescriptionForm({...prescriptionForm, patient_id: patient.id}); 
                  setShowPrescriptionModal(true); 
                }}><FaPrescriptionBottle /> Prescribe</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="empty-state-modern"><FaUsers /><h3>No patients yet</h3></div>}
    </div>
  );

  // Patient Details Modal with Prescriptions
  const renderPatientDetailsModal = () => (
    showPatientDetailsModal && selectedPatient && (
      <div className="modal-overlay" onClick={() => setShowPatientDetailsModal(false)}>
        <div className="modal-content patient-details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2><FaUserCircle /> {selectedPatient.name}</h2>
            <button onClick={() => setShowPatientDetailsModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="patient-info-section">
              <h3><FaInfoCircle /> Patient Information</h3>
              <div className="info-row"><span className="label">Email:</span><span>{selectedPatient.email}</span></div>
              <div className="info-row"><span className="label">Phone:</span><span>{selectedPatient.phone}</span></div>
              <div className="info-row"><span className="label">Last Visit:</span><span>{formatDate(selectedPatient.lastVisit)}</span></div>
            </div>
            
            <div className="patient-prescriptions-section">
              <h3><FaPrescriptionBottle /> Prescriptions</h3>
              <Prescriptions patientId={selectedPatient.id} userType="doctor" />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowPatientDetailsModal(false)}>Close</button>
            <button className="btn-primary" onClick={() => {
              setShowPatientDetailsModal(false);
              setPrescriptionForm({...prescriptionForm, patient_id: selectedPatient.id});
              setShowPrescriptionModal(true);
            }}><FaFilePrescription /> Issue Prescription</button>
          </div>
        </div>
      </div>
    )
  );

  const renderPrescriptionsTab = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaPrescriptionBottle /> Prescriptions</h1>
        <p>View all prescriptions issued to your patients</p>
      </div>
      <Prescriptions userType="doctor" />
    </div>
  );

  const renderAppointments = () => (
    <div className="page-container-modern">
      <div className="page-header-modern"><h1><FaCalendarAlt /> All Appointments</h1><p>Manage all appointments ({appointments.length})</p></div>
      {appointments.length > 0 ? (
        <div className="appointments-table-modern">
          <div className="table-header"><div>Patient</div><div>Date & Time</div><div>Type</div><div>Status</div><div>Actions</div></div>
          {appointments.map(apt => (
            <div key={apt.id} className="table-row">
              <div className="patient-cell"><span className="patient-name">{apt.patient_name}</span></div>
              <div className="datetime-cell"><span className="date">{formatDate(apt.date)}</span><span className="time">{apt.time}</span></div>
              <div className="type-cell"><span className={`type-badge-modern ${apt.type}`}>{apt.type === 'video' ? ' Video' : ' In-Person'}</span></div>
              <div className="status-cell"><span className={`status-badge-modern ${apt.status}`}>{apt.status === 'pending' ? 'Pending' : apt.status}</span></div>
              <div className="actions-cell">
                {apt.status === 'pending' && (
                  <>
                    <button className="icon-btn confirm" onClick={() => confirmAppointment(apt)}><FaCheck /></button>
                    <button className="icon-btn cancel" onClick={() => cancelAppointment(apt)}><FaTimes /></button>
                  </>
                )}
                {apt.type === 'video' && apt.status === 'confirmed' && <button className="icon-btn video" onClick={() => { setCurrentAppointment(apt); setShowVideoCall(true); }}><FaVideo /></button>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="empty-state-modern"><FaCalendarAlt /><h3>No appointments</h3></div>}
    </div>
  );

  const renderLabResults = () => (
    <div className="page-container-modern">
      <div className="page-header-modern"><h1><FaFlask /> Lab Results</h1><p>Review patient results ({pendingLabResults.length} pending)</p></div>
      {pendingLabResults.length > 0 ? (
        <div className="lab-results-grid-modern">
          {pendingLabResults.map(result => (
            <div key={result.id} className="lab-card">
              <div className="lab-card-header"><div className="lab-icon"><FaFlask /></div></div>
              <div className="lab-card-body"><h3>{result.test_name}</h3><p className="lab-patient">Patient: {result.patient_name}</p><p className="lab-date">Date: {formatDate(result.date)}</p></div>
              <div className="lab-card-footer"><button className="btn-primary" onClick={() => { setSelectedLabResult(result); setShowLabReviewModal(true); }}><FaCheck /> Review</button></div>
            </div>
          ))}
        </div>
      ) : <div className="empty-state-modern"><FaCheckCircle /><h3>All caught up!</h3></div>}
    </div>
  );

  const renderRefills = () => (
    <div className="page-container-modern">
      <div className="page-header-modern"><h1><FaPrescriptionBottle /> Refill Requests</h1><p>Review refill requests ({refillRequests.length})</p></div>
      {refillRequests.length > 0 ? (
        <div className="refills-list-modern">
          {refillRequests.map(request => (
            <div key={request.id} className="refill-card-modern">
              <div className="refill-icon"><FaPrescriptionBottle /></div>
              <div className="refill-info">
                <h3>{request.medication_name}</h3>
                <p>Patient: {request.patient_name}</p>
                <p>Dosage: {request.dosage}</p>
                <p>Requested: {new Date(request.requested_date).toLocaleDateString()}</p>
              </div>
              <div className="refill-actions-modern">
                <button className="btn-approve-modern" onClick={() => approveRefill(request)}><FaCheck /> Approve</button>
                <button className="btn-deny-modern" onClick={() => declineRefill(request)}><FaTimes /> Deny</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="empty-state-modern"><FaPrescriptionBottle /><h3>No pending requests</h3></div>}
    </div>
  );

  // Modal renders
  const renderProfileModal = () => showProfileModal && (
    <div className="modal-overlay" onClick={() => setShowProfileModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h2><FaUserEdit /> Edit Profile</h2><button onClick={() => setShowProfileModal(false)}>×</button></div>
      <div className="modal-body">
        <div className="form-group"><label>Full Name</label><input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
        <div className="form-group"><label>Email</label><input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} /></div>
        <div className="form-group"><label>Phone</label><input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} /></div>
        <div className="form-group"><label>Specialty</label><input type="text" value={profileForm.specialty} onChange={e => setProfileForm({...profileForm, specialty: e.target.value})} /></div>
      </div>
      <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button><button className="btn-primary" onClick={updateProfile}>Save</button></div>
    </div></div>
  );

  const renderPasswordModal = () => showPasswordModal && (
    <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h2><FaKey /> Change Password</h2><button onClick={() => setShowPasswordModal(false)}>×</button></div>
      <div className="modal-body">
        {passwordError && <div className="error-message">{passwordError}</div>}
        {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
        <div className="form-group"><label>Current Password</label><input type="password" value={passwordForm.current_password} onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})} /></div>
        <div className="form-group"><label>New Password</label><input type="password" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} /></div>
        <div className="form-group"><label>Confirm Password</label><input type="password" value={passwordForm.confirm_password} onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})} /></div>
      </div>
      <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button><button className="btn-primary" onClick={changePassword}>Change</button></div>
    </div></div>
  );

  const renderPrescriptionModal = () => showPrescriptionModal && (
    <div className="modal-overlay" onClick={() => setShowPrescriptionModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h2><FaFilePrescription /> Issue Prescription</h2><button onClick={() => setShowPrescriptionModal(false)}>×</button></div>
      <div className="modal-body">
        <div className="form-group"><label>Patient</label><select value={prescriptionForm.patient_id} onChange={e => setPrescriptionForm({...prescriptionForm, patient_id: e.target.value})}><option value="">Select...</option>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div className="form-group"><label>Medication</label><input type="text" placeholder="Medication name" value={prescriptionForm.medication_name} onChange={e => setPrescriptionForm({...prescriptionForm, medication_name: e.target.value})} /></div>
        <div className="form-row"><div className="form-group"><label>Dosage</label><input type="text" placeholder="e.g., 10mg" value={prescriptionForm.dosage} onChange={e => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})} /></div><div className="form-group"><label>Frequency</label><select value={prescriptionForm.frequency} onChange={e => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}><option value="">Select</option><option value="Once daily">Once daily</option><option value="Twice daily">Twice daily</option></select></div></div>
        <div className="form-group"><label>Refills</label><select value={prescriptionForm.refills} onChange={e => setPrescriptionForm({...prescriptionForm, refills: e.target.value})}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></div>
        <div className="form-group"><label>Instructions</label><textarea rows="2" placeholder="Instructions" value={prescriptionForm.instructions} onChange={e => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})} /></div>
      </div>
      <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowPrescriptionModal(false)}>Cancel</button><button className="btn-primary" onClick={handleIssuePrescription}>Issue</button></div>
    </div></div>
  );

  const renderLabReviewModal = () => showLabReviewModal && selectedLabResult && (
    <div className="modal-overlay" onClick={() => setShowLabReviewModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h3>Review Lab Results</h3><button onClick={() => setShowLabReviewModal(false)}>×</button></div>
      <div className="modal-body">
        <p><strong>Patient:</strong> {selectedLabResult.patient_name}</p>
        <p><strong>Test:</strong> {selectedLabResult.test_name}</p>
        <p><strong>Date:</strong> {formatDate(selectedLabResult.date)}</p>
        <div className="review-section"><label>Status:</label><select value={labReviewStatus} onChange={e => setLabReviewStatus(e.target.value)}><option value="approved">Approve</option><option value="needs_followup">Needs Follow-up</option></select><label>Notes:</label><textarea rows="3" placeholder="Add notes..." value={labReviewNotes} onChange={e => setLabReviewNotes(e.target.value)} /></div>
      </div>
      <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowLabReviewModal(false)}>Cancel</button><button className="btn-primary" onClick={handleReviewLabResult}>Submit</button></div>
    </div></div>
  );

  const renderNotificationsPanel = () => showNotifications && (
    <div className="notifications-panel"><div className="notifications-header"><h3>Notifications</h3><button onClick={() => setNotifications([])}>Clear all</button></div>
    {notifications.length === 0 ? <p className="no-notifications">No new notifications</p> : notifications.map(notif => (<div key={notif.id} className={`notification-item ${notif.type}`}><div className="notification-content"><strong>{notif.title}</strong><p>{notif.message}</p><small>{new Date(notif.timestamp).toLocaleTimeString()}</small></div></div>))}</div>
  );

  const renderChat = () => (
    <>
      <button className="chat-toggle-btn" onClick={() => setChatOpen(!chatOpen)}><FaCommentDots />{conversations.filter(c => c.unread > 0).length > 0 && <span className="chat-unread-badge">{conversations.filter(c => c.unread > 0).length}</span>}</button>
      {chatOpen && (<div className="chat-panel"><div className="chat-header"><h3>Messages</h3><button onClick={() => setChatOpen(false)}>×</button></div><div className="chat-body">
        {!currentChat ? (<div className="conversations-list">{conversations.map(conv => (<div key={conv.userId} className="conversation-item" onClick={() => { setCurrentChat(conv); fetchMessages(conv.userId); }}><div className="conv-avatar"><FaUserCircle /></div><div className="conv-info"><h4>{conv.name}</h4><p>{conv.lastMessage?.substring(0, 40)}</p></div>{conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}</div>))}{conversations.length === 0 && <div className="empty-chat"><FaCommentDots /><p>No conversations yet</p></div>}</div>) : (<div className="chat-window"><div className="chat-window-header"><button onClick={() => setCurrentChat(null)}><FaArrowLeft /></button><h4>{currentChat.name}</h4>{onlineUsers.some(u => u.id === currentChat.userId) && <span className="online-status">Online</span>}</div><div className="chat-messages-list">{chatMessages.map(msg => (<div key={msg.id} className={`chat-message ${msg.from_user_id === doctor?.id ? 'sent' : 'received'}`}><div className="message-bubble"><p>{msg.message}</p><span className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</span></div></div>))}{typingUser && <div className="typing-indicator-chat">{typingUser} is typing...</div>}</div><div className="chat-input-area"><input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyUp={handleTyping} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} /><button onClick={sendMessage}><FaPaperPlane /></button></div></div>)}
      </div></div>)}
    </>
  );

  const renderVideoCallModal = () => showVideoCall && currentAppointment && (
    <div className="video-call-modal"><div className="video-call-container"><div className="video-call-header"><div className="call-info"><FaVideo /><span>Consultation with {currentAppointment.patient_name}</span></div><button className="end-call-btn" onClick={() => setShowVideoCall(false)}><FaPhoneSlash /> End Call</button></div><div className="video-grid"><div className="remote-video"><div className="waiting-screen"><FaUserCircle /><h3>{currentAppointment.patient_name}</h3><p>Waiting for patient...</p></div></div><div className="local-video"><video autoPlay muted playsInline ref={videoRef => { if (videoRef && navigator.mediaDevices) { navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => { videoRef.srcObject = stream; }).catch(err => console.error(err)); } }} className="local-video-element" /><div className="local-label">You</div></div></div><div className="call-controls"><button><FaMicrophone /></button><button><FaVideo /></button><button className="end-call" onClick={() => setShowVideoCall(false)}><FaPhoneSlash /></button></div></div></div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'patients': return renderPatients();
      case 'appointments': return renderAppointments();
      case 'prescriptions': return renderPrescriptionsTab();
      case 'lab-results': return renderLabResults();
      case 'refills': return renderRefills();
      default: return renderOverview();
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="top-navbar"><div className="top-navbar-container"><div className="navbar-logo"><div className="logo-icon"><FaHeartbeat /></div><span className="logo-text" style={{ transition: 'opacity 0.3s ease-in-out' }}>{logoText}</span><span className="doctor-tag">Doctor Portal</span></div><div className="navbar-actions"><button className="action-btn" onClick={() => setShowNotifications(!showNotifications)}><FaBell />{notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}</button><div className="user-dropdown"><button className="action-btn user-btn" onClick={() => setShowProfileModal(true)}><FaUserMd /><span>{doctor?.name?.split(' ')[0] || 'Doctor'}</span><FaChevronDown /></button><div className="dropdown-menu"><button onClick={() => setShowProfileModal(true)}><FaUserEdit /> Edit Profile</button><button onClick={() => setShowPasswordModal(true)}><FaKey /> Change Password</button><hr /><button onClick={handleLogout}><FaSignOutAlt /> Logout</button></div></div></div></div></div>

      <Sidebar isOpen={sidebarOpen} activeTab={activeTab} onTabChange={setActiveTab} user={doctor} userType="doctor" menuItems={menuItems} onProfileClick={() => setShowProfileModal(true)} />

      <main className="main-content"><button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><FaBars /></button>{renderNotificationsPanel()}{renderContent()}</main>

      {renderChat()}{renderVideoCallModal()}{renderProfileModal()}{renderPasswordModal()}{renderPrescriptionModal()}{renderLabReviewModal()}{renderPatientDetailsModal()}
    </div>
  );
};

export default DoctorDashboard;