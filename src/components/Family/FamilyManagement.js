// src/components/Family/FamilyManagement.js
import React, { useState } from 'react';
import './FamilyManagement.css';

const FamilyManagement = ({ currentUser }) => {
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'John Johnson', relationship: 'Spouse', age: 42, access: 'Full', avatar: '👨' },
    { id: 2, name: 'Emma Johnson', relationship: 'Daughter', age: 12, access: 'Limited', avatar: '👧' },
    { id: 3, name: 'Robert Johnson', relationship: 'Father', age: 68, access: 'View Only', avatar: '👴' }
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('View Only');

  const addFamilyMember = () => {
    if (inviteEmail) {
      alert(`Invitation sent to ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail('');
    }
  };

  const removeMember = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  return (
    <div className="family-management">
      <div className="family-header"><h2><i className="fas fa-users"></i> Family Access</h2><button className="btn-primary" onClick={() => setShowInviteModal(true)}><i className="fas fa-user-plus"></i> Invite Member</button></div>
      
      <div className="family-members">{familyMembers.map(member => (<div key={member.id} className="member-card"><div className="member-avatar">{member.avatar}</div><div className="member-info"><h3>{member.name}</h3><p>{member.relationship} • Age: {member.age}</p><span className={`access-badge ${member.access.toLowerCase().replace(' ', '-')}`}>{member.access} Access</span></div><div className="member-actions"><button className="edit-btn"><i className="fas fa-edit"></i></button><button className="remove-btn" onClick={() => removeMember(member.id)}><i className="fas fa-trash"></i></button></div></div>))}</div>

      <div className="shared-records"><h3><i className="fas fa-share-alt"></i> Shared Records</h3><div className="shared-list"><label><input type="checkbox" defaultChecked /> Lab Results</label><label><input type="checkbox" defaultChecked /> Prescriptions</label><label><input type="checkbox" defaultChecked /> Appointment History</label><label><input type="checkbox" /> Medical Records</label><label><input type="checkbox" /> Vaccinations</label></div></div>

      {showInviteModal && (<div className="modal-overlay" onClick={() => setShowInviteModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><div className="modal-header"><h3>Invite Family Member</h3><button onClick={() => setShowInviteModal(false)}>×</button></div><div className="modal-body"><div className="form-group"><label>Email Address</label><input type="email" placeholder="Enter email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} /></div><div className="form-group"><label>Access Level</label><select value={inviteRole} onChange={e => setInviteRole(e.target.value)}><option>Full Access</option><option>Limited Access</option><option>View Only</option></select></div></div><div className="modal-footer"><button className="btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button><button className="btn-primary" onClick={addFamilyMember}>Send Invite</button></div></div></div>)}
    </div>
  );
};

export default FamilyManagement;