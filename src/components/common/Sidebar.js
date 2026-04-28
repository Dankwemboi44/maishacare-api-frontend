// src/components/common/Sidebar.js
import React, { useEffect } from 'react';
import { 
  FaHeartbeat, 
  FaTimes, 
  FaUserMd, 
  FaUserCircle, 
  FaChevronDown,
  FaSignOutAlt 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ 
  isOpen, 
  activeTab, 
  onTabChange, 
  user, 
  userType, 
  menuItems,
  onProfileClick,
  onLogout,        // NEW: logout handler
  onClose          // NEW: close sidebar handler
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    // Close sidebar on mobile
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick} />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <FaHeartbeat />
            </div>
            <span className="logo-text">MaishaCare AI</span>
          </div>
          <button className="sidebar-close" onClick={handleOverlayClick} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <button className="sidebar-user" onClick={handleProfileClick}>
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} />
            ) : (
              userType === 'doctor' ? <FaUserMd /> : <FaUserCircle />
            )}
          </div>
          <div className="user-info">
            <h4>{user?.name || 'User'}</h4>
            <p>{userType === 'doctor' ? (user?.specialty || 'Doctor') : (user?.email || 'Patient')}</p>
          </div>
          <FaChevronDown className="user-chevron" />
        </button>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;