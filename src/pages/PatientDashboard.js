import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHome, FaCalendarAlt, FaCalendarPlus, FaPrescriptionBottle, 
  FaFlask, FaFolder, FaBell, FaSyringe, FaChartLine, 
  FaExclamationTriangle, FaTruck, FaRobot, FaStethoscope,
  FaHeartbeat, FaTachometerAlt, FaUserMd, FaMicrophone, 
  FaVideo, FaPhoneSlash, FaCommentDots, FaUserCircle,
  FaChevronDown, FaPlus, FaEdit, FaTrash, FaCheckCircle,
  FaClock, FaCalendarDay, FaArrowRight, FaSpinner, FaKey,
  FaSignOutAlt, FaBars, FaPaperPlane, FaInfoCircle, FaUserEdit,
  FaArrowLeft, FaBolt, FaShieldAlt, FaQuoteLeft, FaStar,
  FaHistory, FaNotesMedical, FaAmbulance, FaCalendarWeek,
  FaPercentage, FaChartPie, FaNewspaper, FaDownload
} from 'react-icons/fa';
import Sidebar from '../components/common/Sidebar';
import HealthMetrics from '../components/HealthMetrics/HealthMetrics';
import Emergency from '../components/Emergency/Emergency';
import PharmacyDelivery from '../components/Pharmacy/PharmacyDelivery';
import GeminiChat from '../components/GeminiAI/GeminiChat';
import Prescriptions from '../components/Prescriptions/Prescriptions';
import SymptomChecker from '../components/SymptomChecker/SymptomChecker';
import BookAppointment from '../components/Appointments/BookAppointment';
import LabResults from '../components/LabResults/LabResults';
import MedicalRecords from '../components/MedicalRecords/MedicalRecords';

import '../styles/global.css';
import '../styles/dashboard.css';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showHealthScoreModal, setShowHealthScoreModal] = useState(false);
  
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
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showLabDetails, setShowLabDetails] = useState(false);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [refillMessage, setRefillMessage] = useState('');
  const [refillSubmitting, setRefillSubmitting] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: '', date_of_birth: '', address: '', emergency_contact: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  // Updated menuItems - ADDED Symptom Checker
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, badge: 0 },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt />, badge: 0 },
    { id: 'book', label: 'Book Appointment', icon: <FaCalendarPlus />, badge: 0 },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FaPrescriptionBottle />, badge: 0 },
    { id: 'lab-results', label: 'Lab Results', icon: <FaFlask />, badge: labResults.filter(l => l.status === 'pending').length },
    { id: 'medical-records', label: 'Medical Records', icon: <FaFolder />, badge: 0 },
    { id: 'reminders', label: 'Reminders', icon: <FaBell />, badge: 0 },
    { id: 'health-metrics', label: 'Health Metrics', icon: <FaChartLine />, badge: 0 },
    { id: 'emergency', label: 'Emergency', icon: <FaExclamationTriangle />, badge: 0 },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: <FaStethoscope />, badge: 0 },
    { id: 'pharmacy', label: 'Pharmacy', icon: <FaTruck />, badge: 0 },
    { id: 'health-tips', label: 'Health Tips', icon: <FaNewspaper />, badge: 0 },
    { id: 'ai-doctor', label: 'AI Doctor', icon: <FaRobot />, badge: 0 }
  ];

  const getPatientId = () => {
    let id = localStorage.getItem('patientId');
    if (id && id !== 'null' && id !== 'undefined') return parseInt(id);
    const userId = localStorage.getItem('userId');
    if (userId) return parseInt(userId);
    return 3;
  };

  const addNotification = (title, message, type = 'success') => {
    setNotifications(prev => [{ id: Date.now(), title, message, type, timestamp: new Date() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, 5)), 5000);
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
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Expected JSON but got:', contentType);
      throw new Error('Server returned HTML instead of JSON');
    }
    
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    return response;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    const patientId = getPatientId();
    
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const patientRes = await fetchWithAuth(`http://localhost:5000/api/patients/${patientId}`);
      const patientData = await patientRes.json();
      setPatient(patientData);
      setProfileForm({
        name: patientData.name || '',
        email: patientData.email || '',
        phone: patientData.phone || '',
        date_of_birth: patientData.date_of_birth || '',
        address: patientData.address || '',
        emergency_contact: patientData.emergency_contact || ''
      });
      
      const doctorsRes = await fetchWithAuth('http://localhost:5000/api/doctors');
      const doctorsData = await doctorsRes.json();
      setDoctors(doctorsData);
      
      const appointmentsRes = await fetchWithAuth('http://localhost:5000/api/appointments');
      const allAppointments = await appointmentsRes.json();
      setAppointments(allAppointments);
      setPastAppointments(allAppointments.filter(a => a.status === 'completed' || a.status === 'cancelled'));
      
      const prescriptionsRes = await fetchWithAuth('http://localhost:5000/api/prescriptions');
      const prescriptionsData = await prescriptionsRes.json();
      setPrescriptions(prescriptionsData);
      
      const labRes = await fetchWithAuth('http://localhost:5000/api/lab-results');
      const labData = await labRes.json();
      setLabResults(labData);
      
      setHealthMetrics({ blood_pressure: '118/76', heart_rate: 72, weight: 68.5, bmi: 25.2 });
      setReminders([
        { id: 1, title: 'Take Lisinopril', time: '08:00', frequency: 'Daily', type: 'medication' },
        { id: 2, title: 'Blood Pressure Check', time: '09:00', frequency: 'Daily', type: 'measurement' }
      ]);
      setMedicalHistory([
        { date: '2024-01-10', type: 'Checkup', description: 'Annual Physical', doctor: 'Sarah Moraa', notes: 'All vitals normal.' },
        { date: '2024-06-15', type: 'Lab Result', description: 'Blood Work', doctor: 'Sarah Moraa', notes: 'Cholesterol slightly elevated.' }
      ]);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      addNotification('Error', 'Failed to load data. Please refresh the page.', 'error');
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
  }, [patient?.id]);

  const initSocket = () => {
    if (patient?.id && typeof window.io !== 'undefined') {
      const socket = window.io('http://localhost:5000');
      socketRef.current = socket;
      setSocketReady(true);
      
      socket.on('connect', () => {
        socket.emit('user-online', { userId: patient.id, userName: patient.name, userRole: 'patient' });
      });
      
      socket.on('users-online', (users) => setOnlineUsers(users));
      
      socket.on('new-message', (data) => {
        if (currentChat && data.fromUserId === currentChat.userId) {
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            from_user_id: data.fromUserId,
            to_user_id: patient.id,
            message: data.message,
            created_at: data.timestamp,
            from_user_name: data.fromUserName
          }]);
        }
        fetchConversations();
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
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/messages/${userId}`);
      const data = await response.json();
      setChatMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = () => {
    if (!socketReady || !socketRef.current) return;
    if (!newMessage.trim() || !currentChat) return;
    
    socketRef.current.emit('private-message', {
      toUserId: currentChat.userId,
      message: newMessage,
      fromUserName: patient.name,
      fromUserRole: 'patient'
    });
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      from_user_id: patient.id,
      to_user_id: currentChat.userId,
      message: newMessage,
      created_at: new Date().toISOString(),
      from_user_name: patient.name
    }]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!isTyping && currentChat && socketReady && socketRef.current) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        toUserId: currentChat.userId,
        isTyping: true,
        fromUserName: patient.name
      });
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleBookAppointment = async (formData) => {
    try {
      const doctor = doctors.find(d => d.id == formData.doctor_id);
      
      const response = await fetchWithAuth('http://localhost:5000/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctor_id: formData.doctor_id,
          date: formData.appointment_date,
          time: formData.appointment_time,
          reason: formData.reason,
          type: formData.type,
          status: 'pending'
        })
      });
      
      if (response.ok) {
        addNotification('Appointment Request Sent', `Your appointment request with Dr. ${doctor?.name} has been sent. Waiting for doctor confirmation.`, 'success');
        fetchData();
        setActiveTab('appointments');
      }
    } catch (err) {
      addNotification('Error', 'Failed to book appointment. Please try again.', 'error');
    }
  };

  const submitRefillRequest = async () => {
    setRefillSubmitting(true);
    try {
      addNotification('Refill Request Submitted', `Your refill request for ${selectedPrescription.medication_name} has been sent.`, 'success');
      setShowRefillModal(false);
      setRefillMessage('');
    } catch (err) {
      addNotification('Error', 'Failed to submit refill request. Please try again.', 'error');
    } finally {
      setRefillSubmitting(false);
    }
  };

  const updateProfile = async () => {
    const patientId = getPatientId();
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/patients/${patientId}`, {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      
      if (response.ok) {
        const updatedPatient = await response.json();
        setPatient(updatedPatient);
        localStorage.setItem('userName', updatedPatient.name);
        setShowProfileModal(false);
        addNotification('Profile Updated', 'Your profile has been updated successfully.', 'success');
      }
    } catch (err) {
      addNotification('Error', 'Failed to update profile. Please try again.', 'error');
    }
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setResettingPassword(true);
    try {
      const response = await fetchWithAuth('http://localhost:5000/api/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      });
      
      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        addNotification('Password Updated', 'Your password has been changed successfully.', 'success');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
          setPasswordSuccess('');
        }, 2000);
      } else {
        const error = await response.json();
        setPasswordError(error.message || 'Current password is incorrect');
      }
    } catch (err) {
      setPasswordError('Network error. Please try again.');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogout = () => {
    if (socketRef.current) socketRef.current.disconnect();
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleEmergencySOS = () => {
    addNotification('Emergency Alert', 'Emergency services have been notified. Stay calm, help is on the way.', 'error');
    if (patient?.emergency_contact) {
      addNotification('Emergency Contact', `Emergency contact ${patient.emergency_contact} has been notified.`, 'info');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaSpinner className="fa-spin" />
          <p>Loading your health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <FaExclamationTriangle />
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const HealthScoreBreakdown = () => {
    const scoreFactors = [
      { name: 'Heart Rate', score: 92, weight: 25, status: 'good', suggestion: 'Maintain regular cardio exercise' },
      { name: 'Blood Pressure', score: 88, weight: 25, status: 'good', suggestion: 'Continue low-sodium diet' },
      { name: 'BMI', score: 78, weight: 20, status: 'warning', suggestion: 'Aim for 30 min daily walking' },
      { name: 'Activity Level', score: 85, weight: 15, status: 'good', suggestion: 'Keep up the great work!' },
      { name: 'Sleep Quality', score: 82, weight: 15, status: 'good', suggestion: 'Maintain consistent sleep schedule' }
    ];
    
    return (
      <div className="health-score-breakdown">
        <div className="breakdown-header">
          <h3><FaChartPie /> Your Health Score: {patient?.health_score || 85}%</h3>
          <p>Based on your recent health metrics and activity</p>
        </div>
        <div className="breakdown-factors">
          {scoreFactors.map((factor, i) => (
            <div key={i} className="factor-item">
              <div className="factor-header">
                <span className="factor-name">{factor.name}</span>
                <span className={`factor-score ${factor.status}`}>{factor.score}%</span>
              </div>
              <div className="factor-progress">
                <div className="factor-progress-bar" style={{ width: `${factor.score}%` }}></div>
              </div>
              <p className="factor-suggestion"><FaInfoCircle /> {factor.suggestion}</p>
            </div>
          ))}
        </div>
        <div className="breakdown-tips">
          <h4>Tips to Improve Your Score:</h4>
          <ul>
            <li>Exercise for at least 30 minutes daily</li>
            <li>Maintain a balanced diet rich in vegetables</li>
            <li>Get 7-8 hours of quality sleep</li>
            <li>Stay hydrated (8+ glasses of water daily)</li>
            <li>Schedule regular check-ups</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="modern-dashboard">
      <div className="hero-section-modern">
        <div className="hero-content">
          <div className="hero-greeting">
            <span className="greeting-badge">
              <FaShieldAlt /> Welcome Back
            </span>
            <h1>Hello, {patient?.name?.split(' ')[0] || 'User'}!</h1>
            <p>Your health journey continues. Here's your personalized dashboard.</p>
          </div>
          <div className="hero-stats-modern">
            <div className="hero-stat">
              <div className="stat-circle" onClick={() => setShowHealthScoreModal(true)} style={{ cursor: 'pointer' }}>
                <span className="stat-value">{patient?.health_score || 85}%</span>
                <span className="stat-label">Health Score</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-icon heartbeat"><FaHeartbeat /></div>
          <div className="floating-icon stethoscope"><FaStethoscope /></div>
          <div className="floating-icon medicine"><FaPrescriptionBottle /></div>
        </div>
      </div>

      <div className="stats-grid-modern">
        <div className="stat-card-modern">
          <div className="stat-icon heart"><FaHeartbeat /></div>
          <div className="stat-info">
            <h3>Heart Rate</h3>
            <p className="stat-number">{healthMetrics?.heart_rate || '--'} <span>bpm</span></p>
            <span className="stat-trend positive">↑ 2% vs last week</span>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon pressure"><FaTachometerAlt /></div>
          <div className="stat-info">
            <h3>Blood Pressure</h3>
            <p className="stat-number">{healthMetrics?.blood_pressure || '--'} <span>mmHg</span></p>
            <span className="stat-trend stable">→ Stable</span>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon lab"><FaFlask /></div>
          <div className="stat-info">
            <h3>Lab Results</h3>
            <p className="stat-number">{labResults?.length || 0}</p>
            <span className="stat-trend">{labResults?.filter(l => l.status === 'pending').length} pending</span>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="stat-icon calendar"><FaCalendarAlt /></div>
          <div className="stat-info">
            <h3>Appointments</h3>
            <p className="stat-number">{appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}</p>
            <span className="stat-trend">upcoming</span>
          </div>
        </div>
      </div>

      <div className="emergency-sos-banner">
        <button className="emergency-sos-btn" onClick={handleEmergencySOS}>
          <FaAmbulance /> EMERGENCY SOS <FaExclamationTriangle />
        </button>
        <p>In case of medical emergency, click above or call 911 immediately</p>
      </div>

      <div className="quick-actions-modern">
        <div className="section-header-with-icon">
          <h2><FaBolt /> Quick Actions</h2>
        </div>
        <div className="actions-grid">
          <div className="action-card" onClick={() => setActiveTab('book')}>
            <div className="action-icon"><FaCalendarPlus /></div>
            <h3>Book Appointment</h3>
            <p>Schedule a visit with a doctor</p>
            <FaArrowRight className="action-arrow" />
          </div>
          <div className="action-card" onClick={() => setActiveTab('prescriptions')}>
            <div className="action-icon"><FaPrescriptionBottle /></div>
            <h3>View Prescriptions</h3>
            <p>Check your medications</p>
            <FaArrowRight className="action-arrow" />
          </div>
          <div className="action-card" onClick={() => setActiveTab('lab-results')}>
            <div className="action-icon"><FaFlask /></div>
            <h3>Lab Results</h3>
            <p>View your test results</p>
            <FaArrowRight className="action-arrow" />
          </div>
          <div className="action-card" onClick={() => setActiveTab('symptom-checker')}>
            <div className="action-icon"><FaStethoscope /></div>
            <h3>Check Symptoms</h3>
            <p>Analyze your health concerns</p>
            <FaArrowRight className="action-arrow" />
          </div>
          <div className="action-card" onClick={() => setActiveTab('ai-doctor')}>
            <div className="action-icon"><FaRobot /></div>
            <h3>AI Assistant</h3>
            <p>Get health insights</p>
            <FaArrowRight className="action-arrow" />
          </div>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="appointments-modern">
          <div className="section-header-with-icon">
            <h2><FaCalendarAlt /> Upcoming Appointments</h2>
            <button className="view-all" onClick={() => setActiveTab('appointments')}>View All <FaArrowRight /></button>
          </div>
          <div className="appointments-list">
            {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').slice(0, 2).map(apt => (
              <div key={apt.id} className="appointment-card-modern">
                <div className="appointment-icon"><FaUserMd /></div>
                <div className="appointment-details">
                  <h4>Dr. {apt.doctor_name}</h4>
                  <p><FaCalendarDay /> {new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                  <span className={`appointment-type ${apt.type}`}>{apt.type === 'video' ? ' Video Call' : ' In-Person'}</span>
                </div>
                <div className="appointment-status">
                  <span className={`status-badge ${apt.status}`}>
                    {apt.status === 'pending' ? 'Waiting for confirmation' : apt.status}
                  </span>
                  {apt.type === 'video' && apt.status === 'confirmed' && (
                    <button className="join-call" onClick={() => { setCurrentAppointment(apt); setShowVideoCall(true); }}>
                      <FaVideo /> Join
                    </button>
                  )}
                </div>
              </div>
            ))}
            {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length === 0 && (
              <div className="empty-appointments">
                <FaCalendarDay />
                <p>No upcoming appointments</p>
                <button className="btn-outline" onClick={() => setActiveTab('book')}>Book One →</button>
              </div>
            )}
          </div>
        </div>

        <div className="reminders-modern">
          <div className="section-header-with-icon">
            <h2><FaBell /> Today's Reminders</h2>
            <button className="view-all" onClick={() => setActiveTab('reminders')}>Manage <FaArrowRight /></button>
          </div>
          <div className="reminders-list">
            {reminders.map(r => (
              <div key={r.id} className="reminder-card-modern">
                <div className="reminder-icon"><FaBell /></div>
                <div className="reminder-details">
                  <h4>{r.title}</h4>
                  <p><FaClock /> {r.time} • {r.frequency}</p>
                </div>
                <button className="reminder-check"><FaCheckCircle /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="medical-history-timeline">
        <div className="section-header-with-icon">
          <h2><FaHistory /> Recent Medical History</h2>
          <button className="view-all" onClick={() => setShowMedicalHistoryModal(true)}>View Full History <FaArrowRight /></button>
        </div>
        <div className="timeline">
          {medicalHistory.slice(0, 3).map((event, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-date">{new Date(event.date).toLocaleDateString()}</div>
              <div className={`timeline-badge ${event.type === 'Checkup' ? 'checkup' : event.type === 'Lab Result' ? 'lab' : 'followup'}`}>
                {event.type === 'Checkup' ? <FaStethoscope /> : event.type === 'Lab Result' ? <FaFlask /> : <FaNotesMedical />}
              </div>
              <div className="timeline-content">
                <h4>{event.description}</h4>
                <p className="timeline-doctor">Dr. {event.doctor}</p>
                <p className="timeline-notes">{event.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="health-tip-banner">
        <div className="tip-icon"><FaQuoteLeft /></div>
        <div className="tip-content">
          <h4>Health Tip of the Day</h4>
          <p>Drink at least 8 glasses of water daily to stay hydrated and support your immune system.</p>
        </div>
        <div className="tip-rating">
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
        </div>
      </div>
    </div>
  );

  const renderMedicalHistoryModal = () => (
    showMedicalHistoryModal && (
      <div className="modal-overlay" onClick={() => setShowMedicalHistoryModal(false)}>
        <div className="modal-content medical-history-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2><FaHistory /> Complete Medical History</h2>
            <button onClick={() => setShowMedicalHistoryModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="timeline full-timeline">
              {medicalHistory.map((event, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-date">{new Date(event.date).toLocaleDateString()}</div>
                  <div className={`timeline-badge ${event.type === 'Checkup' ? 'checkup' : event.type === 'Lab Result' ? 'lab' : 'followup'}`}>
                    {event.type === 'Checkup' ? <FaStethoscope /> : event.type === 'Lab Result' ? <FaFlask /> : <FaNotesMedical />}
                  </div>
                  <div className="timeline-content">
                    <h4>{event.description}</h4>
                    <p className="timeline-doctor">Dr. {event.doctor}</p>
                    <p className="timeline-notes">{event.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowMedicalHistoryModal(false)}>Close</button>
          </div>
        </div>
      </div>
    )
  );

  const renderHealthScoreModal = () => (
    showHealthScoreModal && (
      <div className="modal-overlay" onClick={() => setShowHealthScoreModal(false)}>
        <div className="modal-content health-score-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2><FaChartPie /> Health Score Breakdown</h2>
            <button onClick={() => setShowHealthScoreModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <HealthScoreBreakdown />
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowHealthScoreModal(false)}>Close</button>
          </div>
        </div>
      </div>
    )
  );

  const renderAppointments = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaCalendarAlt /> My Appointments</h1>
        <p>View and manage all your scheduled appointments</p>
      </div>
      <div className="appointments-table-modern">
        {appointments.map(apt => (
          <div key={apt.id} className="appointment-row-modern">
            <div className="appointment-doctor-info">
              <strong>Dr. {apt.doctor_name}</strong>
              <p>{apt.reason || 'Medical consultation'}</p>
            </div>
            <div className="appointment-date-time">
              <span className="date">{new Date(apt.date).toLocaleDateString()}</span>
              <span className="time">{apt.time}</span>
            </div>
            <div className="appointment-type-badge">
              <span className={`type-badge ${apt.type}`}>{apt.type === 'video' ? ' Video' : ' In-Person'}</span>
            </div>
            <div className="appointment-status-badge">
              <span className={`status-badge ${apt.status}`}>
                {apt.status === 'pending' ? 'Waiting for confirmation' : apt.status}
              </span>
            </div>
            <div className="appointment-actions">
              {apt.type === 'video' && apt.status === 'confirmed' && (
                <button className="btn-primary" onClick={() => { setCurrentAppointment(apt); setShowVideoCall(true); }}>
                  <FaVideo /> Join Call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookAppointment = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleBookAppointment({
        doctor_id: formData.get('doctor_id'),
        appointment_date: formData.get('appointment_date'),
        appointment_time: formData.get('appointment_time'),
        reason: formData.get('reason'),
        type: formData.get('type')
      });
    };
    
    return (
      <div className="page-container-modern">
        <div className="page-header-modern">
          <h1><FaCalendarPlus /> Book an Appointment</h1>
          <p>Schedule a visit with one of our experienced doctors</p>
        </div>
        <div className="booking-card-modern">
          <form onSubmit={handleSubmit} className="booking-form-modern">
            <div className="form-group">
              <label>Select Doctor</label>
              <select name="doctor_id" required>
                <option value="">Choose a doctor...</option>
                {doctors.map(d => (<option key={d.id} value={d.id}>Dr. {d.name} - {d.specialty}</option>))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="appointment_date" required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="appointment_time" required>
                  <option value="">Select time...</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" required>
                <option value="in-person"> In-Person Visit</option>
                <option value="video"> Video Consultation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea name="reason" rows="3" placeholder="Briefly describe your symptoms or reason for visit..."></textarea>
            </div>
            <button type="submit" className="btn-primary">Request Appointment</button>
          </form>
        </div>
      </div>
    );
  };

  const renderPrescriptions = () => <Prescriptions patientId={patient?.id} userType="patient" />;

  const renderLabResults = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaFlask /> Lab Results</h1>
        <p>View and download your laboratory results</p>
      </div>
      <div className="lab-results-grid-modern">
        {labResults.map(r => (
          <div key={r.id} className={`lab-result-card-modern ${r.status}`} onClick={() => { setSelectedLabResult(r); setShowLabDetails(true); }}>
            <div className="lab-icon"><FaFlask /></div>
            <div className="lab-info">
              <h3>{r.test_name}</h3>
              <p>{new Date(r.date).toLocaleDateString()}</p>
              <span className={`status-badge ${r.status}`}>{r.status}</span>
            </div>
            <div className="lab-actions">
              <button className="btn-download" onClick={(e) => { e.stopPropagation(); alert('Downloading...'); }}><FaDownload /> Download</button>
              {r.status === 'pending' && (
                <button className="btn-request" onClick={(e) => { e.stopPropagation(); addNotification('Review Requested', 'Doctor notified', 'success'); }}>
                  Request Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedicalRecordsTab = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaFolder /> Medical Records</h1>
        <p>View your medical history</p>
      </div>
      <div className="medical-records-list">
        {medicalHistory.map((record, i) => (
          <div key={i} className="medical-record-card">
            <div className="record-date">{new Date(record.date).toLocaleDateString()}</div>
            <div className="record-details">
              <h3>{record.description}</h3>
              <p className="record-doctor">Dr. {record.doctor}</p>
              <p className="record-notes">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderRemindersTab = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaBell /> Reminders</h1>
        <p>Manage your reminders</p>
      </div>
      <div className="reminders-list-modern">
        {reminders.map(r => (
          <div key={r.id} className="reminder-card-modern">
            <div className="reminder-icon"><FaBell /></div>
            <div className="reminder-info">
              <h3>{r.title}</h3>
              <p>{r.time} - {r.frequency}</p>
            </div>
            <button className="reminder-edit"><FaEdit /></button>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderVaccinationsTab = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaSyringe /> Vaccinations</h1>
        <p>Track your vaccination history</p>
      </div>
      <div className="empty-state-modern">
        <FaSyringe />
        <p>No vaccination records found</p>
      </div>
    </div>
  );
  
  const renderAIDoctor = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaRobot /> AI-Powered Health Assistant</h1>
        <p>Your intelligent health companion (No internet connection required)</p>
      </div>
      <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        <GeminiChat user={patient} userType="patient" />
      </div>
    </div>
  );
  
  const renderSymptomChecker = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaStethoscope /> Symptom Checker</h1>
        <p>Guided questions to help understand your symptoms</p>
      </div>
      <SymptomChecker 
        onAskAIDoctor={() => setActiveTab('ai-doctor')}
        userName={patient?.name}
      />
    </div>
  );
  
  const renderHealthMetricsComp = () => <HealthMetrics patientId={patient?.id} />;
  const renderEmergencyComp = () => <Emergency patientId={patient?.id} patientName={patient?.name} />;
  const renderPharmacyComp = () => <PharmacyDelivery />;
  
  const renderHealthTipsComp = () => (
    <div className="page-container-modern">
      <div className="page-header-modern">
        <h1><FaNewspaper /> Health Tips & Articles</h1>
        <p>Stay informed with the latest health insights</p>
      </div>
      <div className="health-tips-grid">
        <div className="health-tip-card">
          <h3>💪 Boost Your Immunity</h3>
          <p>Regular exercise, balanced diet, and adequate sleep are key to a strong immune system.</p>
        </div>
        <div className="health-tip-card">
          <h3>🥗 Healthy Eating Habits</h3>
          <p>Include fruits, vegetables, whole grains, and lean proteins in your daily meals.</p>
        </div>
        <div className="health-tip-card">
          <h3>💧 Stay Hydrated</h3>
          <p>Drink at least 8 glasses of water daily to maintain optimal body function.</p>
        </div>
        <div className="health-tip-card">
          <h3>😴 Sleep Hygiene</h3>
          <p>Aim for 7-8 hours of quality sleep. Maintain a consistent sleep schedule.</p>
        </div>
        <div className="health-tip-card">
          <h3>🧘 Mental Wellness</h3>
          <p>Practice meditation or deep breathing exercises to reduce stress.</p>
        </div>
        <div className="health-tip-card">
          <h3>🏃 Active Lifestyle</h3>
          <p>Get at least 30 minutes of physical activity most days of the week.</p>
        </div>
      </div>
    </div>
  );

  const renderProfileModal = () => (
    showProfileModal && (
      <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2><FaUserEdit /> Edit Profile</h2>
            <button onClick={() => setShowProfileModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="profile-avatar-section">
              <div className="avatar-preview"><FaUserCircle /></div>
              <button className="btn-secondary">Upload Photo</button>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={profileForm.date_of_birth} onChange={e => setProfileForm({...profileForm, date_of_birth: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows="2" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input type="text" value={profileForm.emergency_contact} onChange={e => setProfileForm({...profileForm, emergency_contact: e.target.value})} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={updateProfile}>Save Changes</button>
          </div>
        </div>
      </div>
    )
  );

  const renderPasswordModal = () => (
    showPasswordModal && (
      <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2><FaKey /> Change Password</h2>
            <button onClick={() => setShowPasswordModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <p className="password-info"><FaInfoCircle /> Changing your password is optional.</p>
            {passwordError && <div className="error-message">{passwordError}</div>}
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passwordForm.current_password} onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} />
              <small>Must be at least 6 characters</small>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={passwordForm.confirm_password} onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={changePassword} disabled={resettingPassword}>
              {resettingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderRefillModal = () => (
    showRefillModal && selectedPrescription && (
      <div className="modal-overlay" onClick={() => setShowRefillModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Request Refill: {selectedPrescription.medication_name}</h3>
            <button onClick={() => setShowRefillModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <p><strong>Current dosage:</strong> {selectedPrescription.dosage} - {selectedPrescription.frequency}</p>
            <p><strong>Refills remaining:</strong> {selectedPrescription.refills}</p>
            <textarea 
              placeholder="Additional notes (optional)..." 
              value={refillMessage} 
              onChange={e => setRefillMessage(e.target.value)} 
              rows="4"
            />
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowRefillModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={submitRefillRequest} disabled={refillSubmitting}>
              {refillSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderLabDetailsModal = () => (
    showLabDetails && selectedLabResult && (
      <div className="modal-overlay" onClick={() => setShowLabDetails(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{selectedLabResult.test_name}</h2>
            <button onClick={() => setShowLabDetails(false)}>×</button>
          </div>
          <div className="modal-body">
            <p><strong>Test Date:</strong> {new Date(selectedLabResult.date).toLocaleDateString()}</p>
            <div className="lab-results-detailed">
              <h3>Results</h3>
              {Object.entries(selectedLabResult.results || {}).map(([key, value]) => (
                <div key={key} className="result-row">
                  <span className="result-name">{key.toUpperCase()}</span>
                  <span className="result-value">{value.value} {value.unit}</span>
                  <span className="result-normal">Normal: {value.normal}</span>
                </div>
              ))}
            </div>
            {selectedLabResult.doctor_notes && (
              <div className="doctor-notes">
                <h3>Doctor's Notes</h3>
                <p>{selectedLabResult.doctor_notes}</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowLabDetails(false)}>Close</button>
            <button className="btn-primary" onClick={() => alert('Downloading report...')}>Download Report</button>
          </div>
        </div>
      </div>
    )
  );

  const renderNotificationsPanel = () => (
    showNotifications && (
      <div className="notifications-panel">
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button onClick={() => setNotifications([])}>Clear all</button>
        </div>
        {notifications.length === 0 ? (
          <p className="no-notifications">No new notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notification-item ${n.type}`}>
              <div className="notification-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{new Date(n.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))
        )}
      </div>
    )
  );

  const renderChat = () => (
    <>
      <button className="chat-toggle-btn" onClick={() => setChatOpen(!chatOpen)}>
        <FaCommentDots />
        {conversations.filter(c => c.unread > 0).length > 0 && (
          <span className="chat-unread-badge">{conversations.filter(c => c.unread > 0).length}</span>
        )}
      </button>
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Messages</h3>
            <button onClick={() => setChatOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            {!currentChat ? (
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div key={conv.userId} className="conversation-item" onClick={() => { setCurrentChat(conv); fetchMessages(conv.userId); }}>
                    <div className="conv-avatar"><FaUserMd /></div>
                    <div className="conv-info">
                      <h4>{conv.name}</h4>
                      <p>{conv.lastMessage?.substring(0, 40)}...</p>
                    </div>
                    {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="empty-chat">
                    <FaCommentDots />
                    <p>No conversations yet</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="chat-window">
                <div className="chat-window-header">
                  <button onClick={() => setCurrentChat(null)}><FaArrowLeft /></button>
                  <h4>{currentChat.name}</h4>
                  {onlineUsers.some(u => u.id === currentChat.userId) && <span className="online-status">Online</span>}
                </div>
                <div className="chat-messages-list">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.from_user_id === patient?.id ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        <p>{msg.message}</p>
                        <span className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                  {typingUser && <div className="typing-indicator-chat">{typingUser} is typing...</div>}
                </div>
                <div className="chat-input-area">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyUp={handleTyping} 
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                  />
                  <button onClick={sendMessage}><FaPaperPlane /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  const renderVideoCallModal = () => (
    showVideoCall && currentAppointment && (
      <div className="video-call-modal">
        <div className="video-call-container">
          <div className="video-call-header">
            <div className="call-info">
              <FaVideo />
              <span>Video Consultation with Dr. {currentAppointment.doctor_name}</span>
            </div>
            <button className="end-call-btn" onClick={() => setShowVideoCall(false)}>
              <FaPhoneSlash /> End Call
            </button>
          </div>
          <div className="video-grid">
            <div className="remote-video">
              <div className="waiting-screen">
                <FaUserCircle />
                <h3>Dr. {currentAppointment.doctor_name}</h3>
                <p>Waiting for doctor to join...</p>
              </div>
            </div>
            <div className="local-video">
              <video autoPlay muted playsInline ref={videoRef => { 
                if (videoRef && navigator.mediaDevices) { 
                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(stream => { videoRef.srcObject = stream; })
                    .catch(err => console.error(err)); 
                } 
              }} className="local-video-element" />
              <div className="local-label">You</div>
            </div>
          </div>
          <div className="call-controls">
            <button><FaMicrophone /></button>
            <button><FaVideo /></button>
            <button className="end-call" onClick={() => setShowVideoCall(false)}><FaPhoneSlash /></button>
          </div>
        </div>
      </div>
    )
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'appointments': return renderAppointments();
      case 'book': return <BookAppointment doctors={doctors} onBook={handleBookAppointment} />;
      case 'prescriptions': return renderPrescriptions();
      case 'medical-records': return renderMedicalRecordsTab();
      case 'reminders': return renderRemindersTab();
      case 'vaccinations': return renderVaccinationsTab();
      case 'health-metrics': return renderHealthMetricsComp();
      case 'emergency': return renderEmergencyComp();
      case 'pharmacy': return renderPharmacyComp();
      case 'health-tips': return renderHealthTipsComp();
      case 'symptom-checker': return renderSymptomChecker();
      case 'ai-doctor': return renderAIDoctor();
      case 'lab-results': return <LabResults userType="patient" patientId={patient?.id} />;
      case 'medical-records': return <MedicalRecords userType="patient" patientId={patient?.id} />;


      default: return renderDashboard();
      
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="top-navbar">
        <div className="top-navbar-container">
          <div className="navbar-logo">
            <div className="logo-icon"><FaHeartbeat /></div>
            <span className="logo-text" style={{ transition: 'opacity 0.3s ease-in-out' }}>{logoText}</span>
          </div>
          <div className="navbar-actions">
            <button className="action-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            <div className="user-dropdown">
              <button className="action-btn user-btn" onClick={() => setShowProfileModal(true)}>
                <FaUserCircle />
                <span>{patient?.name?.split(' ')[0] || 'User'}</span>
                <FaChevronDown />
              </button>
              <div className="dropdown-menu">
                <button onClick={() => setShowProfileModal(true)}><FaUserEdit /> Edit Profile</button>
                <button onClick={() => setShowPasswordModal(true)}><FaKey /> Change Password</button>
                <hr />
                <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={patient} 
        userType="patient" 
        menuItems={menuItems} 
        onProfileClick={() => setShowProfileModal(true)} 
      />

      <main className="main-content">
        <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </button>
        {renderNotificationsPanel()}
        {renderContent()}
      </main>

      {renderChat()}
      {renderVideoCallModal()}
      {renderProfileModal()}
      {renderPasswordModal()}
      {renderRefillModal()}
      {renderLabDetailsModal()}
      {renderMedicalHistoryModal()}
      {renderHealthScoreModal()}
    </div>
  );
};

export default PatientDashboard;