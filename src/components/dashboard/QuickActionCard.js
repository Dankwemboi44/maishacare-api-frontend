// components/dashboard/QuickActionCard.js
import React from 'react';

const QuickActionCard = ({ icon, title, description, onClick }) => {
  return (
    <div className="quick-action" onClick={onClick}>
      <div className="quick-action-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default QuickActionCard;