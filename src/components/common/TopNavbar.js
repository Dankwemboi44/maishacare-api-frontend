// src/components/common/TopNavbar.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHeartbeat, 
  FaBell, 
  FaUserMd, 
  FaUserCircle, 
  FaChevronDown, 
  FaUserEdit, 
  FaSignOutAlt, 
  FaCog, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import './TopNavbar.css';

const TopNavbar = ({ 
  user, 
  userType, 
  onProfileClick, 
  onLogout,
  onSettingsClick,
  onViewAllNotifications,
  notifications = [],
  onMarkAsRead,
  onClearAll
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [logoText, setLogoText] = useState('MaishaCare AI');
  
  const notificationPanelRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Logo text rotation (FIXED: No direct DOM manipulation)
  useEffect(() => {
    const texts = ['MaishaCare AI', 'AI Powered Health Assistant'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLogoText(texts[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notification panel
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setShowNotificationPanel(false);
      }
      // Close user dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowNotificationPanel(false);
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  // Format time ago (ENHANCED with better formatting)
  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  // Toggle notification panel (closes user dropdown)
  const handleNotificationClick = () => {
    setShowNotificationPanel(!showNotificationPanel);
    setShowUserDropdown(false); // Close other dropdown
  };

  // Toggle user dropdown (closes notification panel)
  const handleUserDropdownToggle = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationPanel(false); // Close other panel
  };

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAsRead) {
      const unreadNotifications = notifications.filter(n => !n.read);
      unreadNotifications.forEach(n => onMarkAsRead(n.id));
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
    setShowNotificationPanel(false);
  };

  const handleViewAll = () => {
    if (onViewAllNotifications) {
      onViewAllNotifications();
    }
    setShowNotificationPanel(false);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setShowUserDropdown(false);
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserDropdown(false);
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0];
  };

  // Get user avatar or default
  const getUserAvatar = () => {
    if (user?.avatar) {
      return <img src={user.avatar} alt={user.name} className="user-avatar-img" />;
    }
    return userType === 'doctor' ? <FaUserMd /> : <FaUserCircle />;
  };

  return (
    <nav className={`top-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="top-navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <FaHeartbeat />
          </div>
          <span className="logo-text" style={{ transition: 'opacity 0.2s ease-in-out' }}>
            {logoText}
          </span>
          {userType === 'doctor' && <span className="doctor-tag">Doctor Portal</span>}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Notifications Panel */}
          <div className="notification-wrapper" ref={notificationPanelRef}>
            <button 
              className={`action-btn notifications-btn ${unreadCount > 0 ? 'has-notifications' : ''}`} 
              onClick={handleNotificationClick}
              aria-label="Notifications"
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
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleMarkAsRead(notification.id)}
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
                    <button className="view-all-btn" onClick={handleViewAll}>
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="user-dropdown" ref={userDropdownRef}>
            <button 
              className="action-btn user-btn" 
              onClick={handleUserDropdownToggle}
              aria-label="User menu"
            >
              {getUserAvatar()}
              <span className="user-name-mobile">{getDisplayName()}</span>
              <FaChevronDown className={`dropdown-arrow ${showUserDropdown ? 'rotated' : ''}`} />
            </button>
            
            {showUserDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleProfileClick}>
                  <FaUserEdit />
                  <span>Edit Profile</span>
                </button>
                <button onClick={handleSettingsClick}>
                  <FaCog />
                  <span>Settings</span>
                </button>
                <hr />
                <button onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;