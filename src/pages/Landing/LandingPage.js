// src/pages/Landing/LandingPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeartbeat, FaCalendarCheck, FaPrescriptionBottle, FaFlask, 
  FaVideo, FaRobot, FaChartLine, FaShieldAlt, FaUserMd, FaUser,
  FaArrowRight, FaStar, FaQuoteLeft, FaFacebookF, FaTwitter,
  FaLinkedinIn, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaBars, FaTimes, FaCheckCircle, FaAward, FaUsers,
  FaStethoscope, FaAmbulance, FaInfoCircle, FaClock,
  FaFileAlt, FaGavel, FaCookieBite
} from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [logoText, setLogoText] = useState('AI Powered Health Assistant');

  // Logo transition effect
  useEffect(() => {
    const texts = ['AI Powered Health Assistant', 'MaishaCare AI'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      const logoElement = document.querySelector('.logo-text');
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLearnMore = (feature) => {
    setSelectedFeature(feature);
    setShowFeatureModal(true);
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    { 
      icon: <FaCalendarCheck />, 
      title: 'Easy Appointment Booking', 
      description: 'Schedule appointments with top doctors in just a few clicks, anytime, anywhere.',
      fullDescription: 'Our intelligent booking system allows you to browse available doctors, view their schedules, and book appointments instantly.',
      benefits: ['24/7 online booking', 'Instant confirmation', 'SMS/Email reminders', 'Easy rescheduling'],
      color: '#3b82f6'
    },
    { 
      icon: <FaPrescriptionBottle />, 
      title: 'Digital Prescriptions', 
      description: 'Receive and manage your prescriptions online. Request refills with one click.',
      fullDescription: 'Access all your prescriptions digitally from anywhere. Request refills with a single click.',
      benefits: ['One-click refills', 'Medication reminders', 'Pharmacy integration', 'Prescription history'],
      color: '#10b981'
    },
    { 
      icon: <FaFlask />, 
      title: 'Lab Results Online', 
      description: 'Access your lab results instantly from anywhere.',
      fullDescription: 'Get notified instantly when your lab results are available. View detailed results with normal range comparisons.',
      benefits: ['Instant notifications', 'PDF downloads', 'Share with doctors', 'Historical tracking'],
      color: '#8b5cf6'
    },
    { 
      icon: <FaVideo />, 
      title: 'Video Consultations', 
      description: 'Connect with doctors via secure HD video calls from the comfort of your home.',
      fullDescription: 'Experience healthcare from anywhere with our secure, HIPAA-compliant video consultation platform.',
      benefits: ['HD video quality', 'End-to-end encrypted', 'Screen sharing', 'Record with consent'],
      color: '#f59e0b'
    },
    { 
      icon: <FaRobot />, 
      title: 'Doctor AI', 
      description: 'Get instant answers to your health questions with our intelligent AI assistant 24/7.',
      fullDescription: 'Powered by Google Gemini AI, our intelligent assistant is available 24/7 to answer your health questions.',
      benefits: ['24/7 availability', 'Symptom analysis', 'Personalized tips', 'Instant responses'],
      color: '#ef4444'
    },
    { 
      icon: <FaChartLine />, 
      title: 'Health Analytics', 
      description: 'Track your health metrics and see your progress with beautiful interactive charts.',
      fullDescription: 'Visualize your health journey with interactive charts and graphs.',
      benefits: ['Interactive charts', 'Trend analysis', 'Goal tracking', 'Shareable reports'],
      color: '#06b6d4'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Happy Patients', icon: <FaUsers /> },
    { value: '200+', label: 'Expert Doctors', icon: <FaUserMd /> },
    { value: '10K+', label: 'Video Consultations', icon: <FaVideo /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <FaStar /> }
  ];

  const testimonials = [
    { 
      name: 'Sarah Johnson', 
      role: 'Patient', 
      content: 'AI-Powered Health Assistant has completely transformed how I manage my health. The video consultations are so convenient.', 
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5
    },
    { 
      name: 'Dr. Michael Chen', 
      role: 'Cardiologist', 
      content: 'The platform is intuitive, secure, and efficient. My patients love the ease of booking appointments.', 
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5
    },
    { 
      name: 'Emily Davis', 
      role: 'Patient', 
      content: 'Getting my lab results online and requesting prescription refills has never been easier.', 
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 5
    }
  ];

  // Privacy Policy Modal Content
  const PrivacyPolicyContent = () => (
    <div className="legal-content">
      <h3>Privacy Policy</h3>
      <p>Last Updated: April 2026</p>
      
      <h4>1. Information We Collect</h4>
      <p>We collect information you provide directly to us, such as when you create an account, book an appointment, or communicate with doctors. This includes:</p>
      <ul>
        <li>Personal identification information (name, email, phone number, date of birth)</li>
        <li>Medical information shared with healthcare providers</li>
        <li>Payment and insurance information</li>
        <li>Communication records with healthcare professionals</li>
      </ul>
      
      <h4>2. How We Use Your Information</h4>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Facilitate appointments with healthcare providers</li>
        <li>Process prescriptions and lab results</li>
        <li>Send appointment reminders and important notifications</li>
        <li>Improve our services and user experience</li>
        <li>Comply with legal and regulatory requirements</li>
      </ul>
      
      <h4>3. Data Security</h4>
      <p>We implement industry-standard security measures to protect your personal and medical information. All data is encrypted in transit and at rest. We comply with HIPAA regulations to ensure your health information remains confidential.</p>
      
      <h4>4. Information Sharing</h4>
      <p>We do not sell your personal information. We may share your information with:</p>
      <ul>
        <li>Healthcare providers you choose to consult with</li>
        <li>Service providers who assist in our operations</li>
        <li>Legal authorities when required by law</li>
      </ul>
      
      <h4>5. Your Rights</h4>
      <p>You have the right to access, correct, or delete your personal information. You may also request a copy of your medical records or ask us to restrict processing of your data.</p>
      
      <h4>6. Contact Us</h4>
      <p>If you have questions about this Privacy Policy, please contact us at dankwemboi08@gmail.com or call +254714543862.</p>
    </div>
  );

  // Terms of Service Modal Content
  const TermsOfServiceContent = () => (
    <div className="legal-content">
      <h3>Terms of Service</h3>
      <p>Last Updated: April 2026</p>
      
      <h4>1. Acceptance of Terms</h4>
      <p>By accessing or using AI-Powered Health Assistant, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
      
      <h4>2. Description of Services</h4>
      <p>AI-Powered Health Assistant provides a platform for patients to connect with healthcare providers, manage medical records, book appointments, and access health-related information. We are not a healthcare provider and do not provide medical advice.</p>
      
      <h4>3. User Accounts</h4>
      <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must be at least 18 years old to use our services.</p>
      
      <h4>4. Medical Disclaimer</h4>
      <p>The information provided through our platform is for informational purposes only and is not a substitute for professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      
      <h4>5. Emergency Situations</h4>
      <p>If you are experiencing a medical emergency, call 911 or your local emergency services immediately. Do not use our platform for emergency situations.</p>
      
      <h4>6. User Conduct</h4>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any illegal purpose</li>
        <li>Harass, abuse, or harm another person</li>
        <li>Impersonate another person or entity</li>
        <li>Interfere with the proper functioning of the service</li>
        <li>Share false or misleading information</li>
      </ul>
      
      <h4>7. Payment and Cancellations</h4>
      <p>Fees for appointments and services are clearly displayed before booking. Cancellation policies vary by provider. Please review the cancellation policy before booking.</p>
      
      <h4>8. Limitation of Liability</h4>
      <p>To the maximum extent permitted by law, AI-Powered Health Assistant shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
      
      <h4>9. Changes to Terms</h4>
      <p>We reserve the right to modify these terms at any time. We will notify users of material changes via email or through the platform.</p>
      
      <h4>10. Contact Information</h4>
      <p>For questions about these Terms, contact us at dankwemboi08@gmail.com.</p>
    </div>
  );

  // Cookie Policy Modal Content
  const CookiePolicyContent = () => (
    <div className="legal-content">
      <h3>Cookie Policy</h3>
      <p>Last Updated: April 2026</p>
      
      <h4>1. What Are Cookies</h4>
      <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you interact with our site.</p>
      
      <h4>2. Types of Cookies We Use</h4>
      <p><strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable core functionality such as security, authentication, and account management.</p>
      <p><strong>Preference Cookies:</strong> These remember your settings and preferences, such as language and display options.</p>
      <p><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website, allowing us to improve our services.</p>
      <p><strong>Session Cookies:</strong> These are temporary and expire when you close your browser.</p>
      
      <h4>3. How We Use Cookies</h4>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep you logged in during your session</li>
        <li>Remember your preferences</li>
        <li>Analyze website traffic and usage patterns</li>
        <li>Improve website performance and user experience</li>
        <li>Prevent fraudulent activity</li>
      </ul>
      
      <h4>4. Third-Party Cookies</h4>
      <p>We may use third-party services that set their own cookies. These include analytics providers and payment processors. We do not control these cookies.</p>
      
      <h4>5. Managing Cookies</h4>
      <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
      <ul>
        <li>View cookies stored on your device</li>
        <li>Block cookies from specific sites</li>
        <li>Delete all cookies</li>
        <li>Set preferences for future cookie storage</li>
      </ul>
      <p>Please note that disabling essential cookies may affect the functionality of our website.</p>
      
      <h4>6. Changes to This Policy</h4>
      <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      
      <h4>7. Contact Us</h4>
      <p>If you have questions about our use of cookies, please contact us at dankwemboi08@gmail.com.</p>
    </div>
  );

  // Legal Modal Component
  const LegalModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body legal-modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => scrollToSection('home')}>
            <div className="logo-icon">
              <FaHeartbeat />
            </div>
            <span className="logo-text" style={{ transition: 'opacity 0.3s ease-in-out' }}>{logoText}</span>
          </div>
          
          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('features')}>Features</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('testimonials')}>Testimonials</button>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </div>
          
          <div className="nav-buttons">
            <button onClick={handleLogin} className="btn-outline">Login</button>
            <button onClick={handleGetStarted} className="btn-primary">Sign Up Free</button>
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FaShieldAlt />
              <span>Your Health, Our Priority</span>
            </div>
            <h1>
              Your Health, <br />
              <span className="gradient-text">Our Priority</span>
            </h1>
            <p>
              AI-Powered Health Assistant connects you with top doctors, manages your prescriptions, 
              and gives you access to your health records - all in one place. 
              Experience healthcare reimagined with cutting-edge technology.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">24/7</span>
                <span className="hero-stat-label">Availability</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Secure</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">HIPAA</span>
                <span className="hero-stat-label">Compliant</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="hero-image-container">
              <div className="floating-card card-1">
                <FaCalendarCheck />
                <span>Book Appointment</span>
              </div>
              <div className="floating-card card-2">
                <FaPrescriptionBottle />
                <span>Get Prescription</span>
              </div>
              <div className="floating-card card-3">
                <FaVideo />
                <span>Video Call</span>
              </div>
              <div className="hero-main-image">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop" alt="Doctor consultation" />
              </div>
              <div className="hero-experience-badge">
                <FaAward />
                <div>
                  <strong>More Years</strong>
                  <span>Of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2>Comprehensive Healthcare Solutions</h2>
            <p>Everything you need to manage your health in one powerful platform</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-link" onClick={() => handleLearnMore(feature)}>
                  <span>Learn More</span>
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-badge">About Us</span>
              <h2>Revolutionizing Healthcare Through Technology</h2>
              <p>AI-Powered Health Assistant is on a mission to make quality healthcare accessible to everyone.</p>
              
              <div className="about-stats">
                <div className="about-stat">
                  <div className="about-stat-icon"><FaUsers /></div>
                  <div>
                    <span className="about-stat-value">50,000+</span>
                    <span className="about-stat-label">Active Users</span>
                  </div>
                </div>
                <div className="about-stat">
                  <div className="about-stat-icon"><FaStethoscope /></div>
                  <div>
                    <span className="about-stat-value">200+</span>
                    <span className="about-stat-label">Expert Doctors</span>
                  </div>
                </div>
                <div className="about-stat">
                  <div className="about-stat-icon"><FaAmbulance /></div>
                  <div>
                    <span className="about-stat-value">24/7</span>
                    <span className="about-stat-label">Emergency Support</span>
                  </div>
                </div>
              </div>
              
              <div className="about-features">
                <div className="about-feature"><FaCheckCircle /> HIPAA Compliant</div>
                <div className="about-feature"><FaCheckCircle /> End-to-End Encrypted</div>
                <div className="about-feature"><FaCheckCircle /> 24/7 Support</div>
                <div className="about-feature"><FaCheckCircle /> Mobile Ready</div>
              </div>
            </div>
            
            <div className="about-image">
              <div className="about-image-container">
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=400&fit=crop" alt="Doctors" />
                <div className="about-experience">
                  <div className="about-experience-number">12+</div>
                  <div className="about-experience-text">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied patients and doctors who trust AI Health</p>
          </div>
          
          <div className="testimonials-slider">
            <div className="testimonials-container">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`testimonial-card ${activeTestimonial === index ? 'active' : ''}`}>
                  <div className="testimonial-quote"><FaQuoteLeft /></div>
                  <p className="testimonial-content">{testimonial.content}</p>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (<FaStar key={i} />))}
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                    <div>
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`dot ${activeTestimonial === index ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-left">
              <h2>Ready to Take Control of Your Health?</h2>
              <p>Join AI-Powered Health Assistant today and experience healthcare reimagined.</p>
              <div className="cta-buttons">
                <button onClick={handleGetStarted} className="btn-primary-large">Start Your Journey <FaArrowRight /></button>
                <button onClick={handleLogin} className="btn-outline-large">Already have an account? Login</button>
              </div>
            </div>
            <div className="cta-right">
              <div className="cta-features">
                <div className="cta-feature"><FaCheckCircle /> Free forever basic plan</div>
                <div className="cta-feature"><FaCheckCircle /> No credit card required</div>
                <div className="cta-feature"><FaCheckCircle /> Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-simple">
            <div className="contact-header">
              <span className="section-badge">Contact Us</span>
              <h2>Get in Touch</h2>
              <p>Have questions? We'd love to hear from you.</p>
            </div>
            
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaPhone /></div>
                <h3>Phone</h3>
                <p>+254714543862</p>
                <small>Mon-Fri, 9am - 6pm</small>
              </div>
              
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <h3>Email</h3>
                <p>dankwemboi08@gmail.com</p>
                <small>We respond within 24 hours</small>
              </div>
              
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaMapMarkerAlt /></div>
                <h3>Office</h3>
                <p>123 Health Street, Medical City, El 20100</p>
                <small>Visit us by appointment</small>
              </div>
            </div>
            
            <div className="contact-hours">
              <h4><FaClock /> Business Hours</h4>
              <div className="hours-list">
                <div><span>Monday - Friday:</span><strong>9:00 AM - 6:00 PM</strong></div>
                <div><span>Saturday:</span><strong>10:00 AM - 2:00 PM</strong></div>
                <div><span>Sunday:</span><strong>Closed</strong></div>
              </div>
            </div>
            
            <div className="social-links-contact">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {showFeatureModal && selectedFeature && (
        <div className="modal-overlay" onClick={() => setShowFeatureModal(false)}>
          <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon" style={{ background: `linear-gradient(135deg, ${selectedFeature.color}20, ${selectedFeature.color}10)`, color: selectedFeature.color }}>
                {selectedFeature.icon}
              </div>
              <h2>{selectedFeature.title}</h2>
              <button className="modal-close" onClick={() => setShowFeatureModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="feature-full-description">{selectedFeature.fullDescription}</p>
              <div className="feature-benefits">
                <h3>Key Benefits:</h3>
                <ul>
                  {selectedFeature.benefits.map((benefit, i) => (
                    <li key={i}><FaCheckCircle /> {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowFeatureModal(false)}>Close</button>
              <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modals */}
      <LegalModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </LegalModal>

      <LegalModal 
        isOpen={showCookieModal} 
        onClose={() => setShowCookieModal(false)} 
        title="Cookie Policy"
      >
        <CookiePolicyContent />
      </LegalModal>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon"><FaHeartbeat /></div>
                <span>AI-Powered Health Assistant</span>
              </div>
              <p>Transforming healthcare through technology and compassion.</p>
              <div className="footer-newsletter">
                <h4>Subscribe to our newsletter</h4>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email address" />
                  <button onClick={() => alert('Subscribed! Check your email for confirmation.')}>Subscribe</button>
                </div>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Platform</h4>
                <button onClick={() => scrollToSection('features')}>Features</button>
                <button onClick={() => scrollToSection('about')}>About Us</button>
                <button onClick={() => scrollToSection('contact')}>Contact</button>
              </div>
              <div className="link-group">
                <h4>Resources</h4>
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleGetStarted}>Sign Up</button>
                <button onClick={() => alert('Help Center coming soon')}>Help Center</button>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <button onClick={() => setShowPrivacyModal(true)}><FaFileAlt /> Privacy Policy</button>
                <button onClick={() => setShowTermsModal(true)}><FaGavel /> Terms of Service</button>
                <button onClick={() => setShowCookieModal(true)}><FaCookieBite /> Cookie Policy</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 AI-Powered Health Assistant. All rights reserved.</p>
            <div className="footer-bottom-links">
              <button onClick={() => setShowPrivacyModal(true)}>Privacy Policy</button>
              <button onClick={() => setShowTermsModal(true)}>Terms of Service</button>
              <button onClick={() => setShowCookieModal(true)}>Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;