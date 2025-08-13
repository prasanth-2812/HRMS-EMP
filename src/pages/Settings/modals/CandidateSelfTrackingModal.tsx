import React, { useState } from 'react';

interface CandidateSelfTrackingModalProps {
  onClose: () => void;
}

const CandidateSelfTrackingModal: React.FC<CandidateSelfTrackingModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    enableSelfTracking: true,
    allowStatusUpdate: true,
    notifyOnUpdate: false,
    trackingFields: ['status', 'documents', 'interview_feedback']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Candidate Self Tracking settings:', settings);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Candidate Self Tracking</h2>
          <p>Configure candidate self-tracking settings</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enable Self Tracking</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableSelfTracking}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableSelfTracking: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Allow candidates to track their application status</span>
              </div>
            </div>

            <div className="form-group">
              <label>Allow Status Updates</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.allowStatusUpdate}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowStatusUpdate: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Allow candidates to update their information</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateSelfTrackingModal;