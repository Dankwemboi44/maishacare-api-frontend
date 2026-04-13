// src/components/common/Sidebar.js
import React from 'react';
import { FaHeartbeat, FaTimes, FaUserMd, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ 
  isOpen, 
  activeTab, 
  onTabChange, 
  user, 
  userType, 
  menuItems,
  onProfileClick
}) => {
  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    if (onTabChange) {
      onTabChange(activeTab); // Keep current tab, just close sidebar
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={handleOverlayClick} />}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <FaHeartbeat />
            </div>
            <span className="logo-text">MaishaCare AI</span>
          </div>
          <button className="sidebar-close" onClick={handleOverlayClick}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-user" onClick={onProfileClick}>
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} />
            ) : (
              userType === 'doctor' ? <FaUserMd /> : <FaUserCircle />
            )}
          </div>
          <div className="user-info">
            <h4>{user?.name || 'User'}</h4>
            <p>{userType === 'doctor' ? user?.specialty : (user?.email || 'Patient')}</p>
          </div>
          <FaChevronDown className="user-chevron" />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;