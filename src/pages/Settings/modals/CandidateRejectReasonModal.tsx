import React, { useState } from 'react';

interface CandidateRejectReasonModalProps {
  onClose: () => void;
}

const CandidateRejectReasonModal: React.FC<CandidateRejectReasonModalProps> = ({ onClose }) => {
  const [reasons, setReasons] = useState([
    'Insufficient experience',
    'Skills mismatch',
    'Salary expectations too high',
    'Position filled',
    'Failed technical assessment'
  ]);
  const [newReason, setNewReason] = useState('');

  const handleAddReason = () => {
    if (newReason.trim()) {
      setReasons(prev => [...prev, newReason.trim()]);
      setNewReason('');
    }
  };

  const handleRemoveReason = (index: number) => {
    setReasons(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Candidate Reject Reasons</h2>
          <p>Manage rejection reasons for candidates</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Add New Reason</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Enter rejection reason"
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddReason}>
                Add
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Current Reasons</label>
            <div style={{ marginTop: '8px' }}>
              {reasons.map((reason, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '4px' }}>
                  <span>{reason}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveReason(index)}
                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRejectReasonModal;