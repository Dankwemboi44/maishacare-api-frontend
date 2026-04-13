import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API - note: no /auth prefix
export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (data) => api.post('/register', data),
  getMe: () => api.get('/me'),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  getDoctors: () => api.get('/doctors'),
};

// Medical Records API
export const medicalRecordsAPI = {
  getAll: () => api.get('/medical-records'),
  create: (data) => api.post('/medical-records', data),
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: () => api.get('/prescriptions'),
  create: (data) => api.post('/prescriptions', data),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
};

// AI API
export const aiAPI = {
  symptomCheck: (data) => api.post('/ai/symptom-check', data),
  getWellnessTip: () => api.get('/ai/wellness-tip'),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;