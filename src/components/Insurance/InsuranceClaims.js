// src/components/Insurance/InsuranceClaims.js
import React, { useState } from 'react';
import './InsuranceClaims.css';

const InsuranceClaims = () => {
  const [claims, setClaims] = useState([
    { id: 1, date: '2026-03-15', amount: 150, status: 'approved', description: 'Cardiology Consultation', provider: 'Dr. Sarah Moraa' },
    { id: 2, date: '2026-03-20', amount: 85, status: 'pending', description: 'Blood Work', provider: 'LabCorp' },
    { id: 3, date: '2026-02-10', amount: 200, status: 'paid', description: 'Annual Physical', provider: 'Dr. Amina Khan' }
  ]);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = { approved: 'success', pending: 'warning', paid: 'info' };
    return <span className={`claim-status ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="insurance-claims">
      <div className="claims-header"><h2><i className="fas fa-file-invoice-dollar"></i> Insurance Claims</h2><button className="btn-primary" onClick={() => setShowClaimModal(true)}><i className="fas fa-plus"></i> Submit Claim</button></div>
      
      <div className="claims-summary"><div className="summary-card"><span>Total Claims</span><strong>{claims.length}</strong></div><div className="summary-card"><span>Approved</span><strong>{claims.filter(c => c.status === 'approved').length}</strong></div><div className="summary-card"><span>Pending</span><strong>{claims.filter(c => c.status === 'pending').length}</strong></div><div className="summary-card"><span>Total Amount</span><strong>Ksh{claims.reduce((sum, c) => sum + c.amount, 0)}</strong></div></div>

      <div className="claims-table">{claims.map(claim => (<div key={claim.id} className="claim-row"><div><strong>{claim.description}</strong><p>{claim.provider} • {new Date(claim.date).toLocaleDateString()}</p></div><div>Ksh{claim.amount}</div><div>{getStatusBadge(claim.status)}</div><div><button className="view-details">View Details</button></div></div>))}</div>

      {showClaimModal && (<div className="modal-overlay" onClick={() => setShowClaimModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><div className="modal-header"><h3>Submit Insurance Claim</h3><button onClick={() => setShowClaimModal(false)}>×</button></div><div className="modal-body"><div className="form-group"><label>Service Date</label><input type="date" /></div><div className="form-group"><label>Service Type</label><select><option>Consultation</option><option>Lab Test</option><option>Procedure</option><option>Prescription</option></select></div><div className="form-group"><label>Provider Name</label><input type="text" placeholder="Doctor or facility name" /></div><div className="form-group"><label>Amount (Ksh)</label><input type="number" placeholder="0.00" /></div><div className="form-group"><label>Upload Receipt</label><input type="file" /></div></div><div className="modal-footer"><button className="btn-secondary" onClick={() => setShowClaimModal(false)}>Cancel</button><button className="btn-primary">Submit Claim</button></div></div></div>)}
    </div>
  );
};

export default InsuranceClaims;