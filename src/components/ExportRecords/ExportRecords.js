// src/components/ExportRecords/ExportRecords.js
import React from 'react';
import './ExportRecords.css';

const ExportRecords = ({ records }) => {
  const exportAsPDF = () => { alert('PDF export would download here'); };
  const exportAsCSV = () => { alert('CSV export would download here'); };
  const shareWithDoctor = () => { alert('Share with doctor feature'); };
  const printRecords = () => { window.print(); };

  return (
    <div className="export-records-container">
      <h2><i className="fas fa-download"></i> Export Medical Records</h2>
      <div className="export-options">
        <button className="export-btn pdf" onClick={exportAsPDF}><i className="fas fa-file-pdf"></i> Export as PDF</button>
        <button className="export-btn csv" onClick={exportAsCSV}><i className="fas fa-file-excel"></i> Export as CSV</button>
        <button className="export-btn share" onClick={shareWithDoctor}><i className="fas fa-share-alt"></i> Share with Doctor</button>
        <button className="export-btn print" onClick={printRecords}><i className="fas fa-print"></i> Print</button>
      </div>
      <div className="records-preview"><h3>Available Records</h3><ul><li>📋 Medical History - Last updated: Apr 5, 2026</li><li>💊 Prescriptions - 3 active prescriptions</li><li>🔬 Lab Results - 2 results available</li><li>📅 Appointments - 5 total appointments</li></ul></div>
    </div>
  );
};

export default ExportRecords;