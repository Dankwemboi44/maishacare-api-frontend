// components/dashboard/StatsCard.js
import React from 'react';

const StatsCard = ({ icon, title, value, subtitle, trend, color, onClick }) => {
  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'stats-card-primary';
      case 'success':
        return 'stats-card-success';
      case 'warning':
        return 'stats-card-warning';
      case 'danger':
        return 'stats-card-danger';
      default:
        return 'stats-card-primary';
    }
  };

  return (
    <div className={`stats-card ${getColorClass()}`} onClick={onClick}>
      <div className="stats-card-icon">
        <i className={icon}></i>
      </div>
      <div className="stats-card-content">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
        {subtitle && <span className="stats-subtitle">{subtitle}</span>}
        {trend && (
          <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`}></i>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;