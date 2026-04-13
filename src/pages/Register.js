// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaArrowRight, FaUserMd, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa';
import './AuthPages.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          phone: formData.phone,
          address: formData.address,
          specialty: userType === 'doctor' ? formData.specialty : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="logo-icon">
              <FaHeartbeat />
            </div>
            <h1>MaishaCare AI</h1>
            <p>AI Powered Health Assistant</p>
          </div>
          
          <div className="auth-illustration">
            <div className="illustration-content">
              <div className="floating-icon-wrapper">
                <div className="floating-icon icon-1"><FaUserMd /></div>
                <div className="floating-icon icon-2"><FaHeartbeat /></div>
                <div className="floating-icon icon-3"><FaStethoscope /></div>
              </div>
              <h2>Join Us Today!</h2>
              <p>Start your journey to better health</p>
            </div>
          </div>
          
          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Access to Top Doctors</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>AI-Powered Health Insights</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Secure Medical Records</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Create an Account</h2>
              <p>Sign up to get started with AI-powered healthcare</p>
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            
            <div className="user-type-toggle">
              <button 
                className={`type-btn ${userType === 'patient' ? 'active' : ''}`}
                onClick={() => setUserType('patient')}
              >
                <FaUser /> Patient
              </button>
              <button 
                className={`type-btn ${userType === 'doctor' ? 'active' : ''}`}
                onClick={() => setUserType('doctor')}
              >
                <FaUserMd /> Doctor
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {userType === 'doctor' && (
                <div className="form-group">
                  <label>Specialty</label>
                  <div className="input-with-icon">
                    <FaStethoscope className="input-icon" />
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>
              </div>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;