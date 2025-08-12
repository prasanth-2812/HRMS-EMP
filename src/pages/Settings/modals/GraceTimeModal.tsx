import React, { useState } from 'react';

interface GraceTimeModalProps {
  onClose: () => void;
}

const GraceTimeModal: React.FC<GraceTimeModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    // Add specific settings for this modal
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Grace Time settings:', settings);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Grace Time</h2>
          <p>Configure grace time settings for attendance</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enable Grace Time</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Enable this feature</span>
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

export default GraceTimeModal;
