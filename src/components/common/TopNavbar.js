// src/components/common/TopNavbar.js
import React, { useState, useEffect, useRef } from 'react';
import { FaHeartbeat, FaBell, FaUserMd, FaUserCircle, FaChevronDown, FaUserEdit, FaSignOutAlt, FaCog, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import './TopNavbar.css';

const TopNavbar = ({ 
  user, 
  userType, 
  onProfileClick, 
  onLogout,
  notifications = [],
  onMarkAsRead,
  onClearAll
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle className="notif-icon-success" />;
      case 'warning':
        return <FaExclamationTriangle className="notif-icon-warning" />;
      case 'error':
        return <FaExclamationTriangle className="notif-icon-error" />;
      default:
        return <FaInfoCircle className="notif-icon-info" />;
    }
  };

  // Format time ago
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Logo text with transition
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

  const handleNotificationClick = () => {
    setShowNotificationPanel(!showNotificationPanel);
  };

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAsRead) {
      notifications.forEach(n => {
        if (!n.read) onMarkAsRead(n.id);
      });
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <nav className={`top-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="top-navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <FaHeartbeat />
          </div>
          <span className="logo-text" style={{ transition: 'opacity 0.3s ease-in-out' }}>
            {logoText}
          </span>
          {userType === 'doctor' && <span className="doctor-tag">Doctor Portal</span>}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Notifications - Real Notification Icon */}
          <div className="notification-wrapper" ref={panelRef}>
            <button 
              className={`action-btn notifications-btn ${unreadCount > 0 ? 'has-notifications' : ''}`} 
              onClick={handleNotificationClick}
            >
              <FaBell className="bell-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotificationPanel && (
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <h3>Notifications</h3>
                  <div className="notification-actions">
                    {unreadCount > 0 && (
                      <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button className="clear-all" onClick={handleClearAll}>
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="notification-panel-body">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <FaBell />
                      <p>No notifications yet</p>
                      <span>We'll notify you when something arrives</span>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">{notification.title}</div>
                          <div className="notification-message">{notification.message}</div>
                          <div className="notification-time">{timeAgo(notification.timestamp)}</div>
                        </div>
                        {!notification.read && <div className="notification-unread-dot" />}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="notification-panel-footer">
                    <button className="view-all-btn">View all notifications</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="user-dropdown">
            <button className="action-btn user-btn" onClick={onProfileClick}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="user-avatar-img" />
              ) : (
                userType === 'doctor' ? <FaUserMd /> : <FaUserCircle />
              )}
              <span className="user-name-mobile">{user?.name?.split(' ')[0] || 'User'}</span>
              <FaChevronDown className="dropdown-arrow" />
            </button>
            <div className="dropdown-menu">
              <button onClick={onProfileClick}>
                <FaUserEdit />
                <span>Edit Profile</span>
              </button>
              <button onClick={() => {}}>
                <FaCog />
                <span>Settings</span>
              </button>
              <hr />
              <button onClick={onLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;