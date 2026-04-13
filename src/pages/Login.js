// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt, FaUserMd, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import './AuthPages.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id.toString());
        localStorage.setItem('userName', data.user.name);
        
        if (data.user.role === 'patient') {
          localStorage.setItem('patientId', data.user.id.toString());
          navigate('/patient/dashboard');
        } else if (data.user.role === 'doctor') {
          localStorage.setItem('doctorId', data.user.id.toString());
          navigate('/doctor/dashboard');
        }
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
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
                <div className="floating-icon icon-2"><FaUsers /></div>
                <div className="floating-icon icon-3"><FaShieldAlt /></div>
              </div>
              <h2>Welcome Back!</h2>
              <p>Sign in to continue your health journey</p>
            </div>
          </div>
          
          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>24/7 Access to Doctors</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Secure Video Consultations</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Digital Prescriptions</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Login to Your Account</h2>
              <p>Enter your credentials to access your dashboard</p>
            </div>
            
            {error && (
              <div className="auth-error">
                <FaExclamationTriangle className="error-icon" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
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
                <label>Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
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
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Logging in...
                  </>
                ) : (
                  <>
                    Login <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;