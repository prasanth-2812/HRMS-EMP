import React, { useState } from 'react';

interface HistoryTagsModalProps {
  onClose: () => void;
}

const HistoryTagsModal: React.FC<HistoryTagsModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    enableHistoryTracking: true,
    retentionPeriod: '365',
    trackUserActions: true,
    trackDataChanges: true,
    trackLoginActivity: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('History Tags Settings:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>History Tags</h2>
          <p>Configure history tracking and tagging settings</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="enableHistoryTracking"
                    checked={formData.enableHistoryTracking}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Enable History Tracking</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="retentionPeriod">Retention Period (Days)</label>
              <select
                id="retentionPeriod"
                name="retentionPeriod"
                value={formData.retentionPeriod}
                onChange={handleInputChange}
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">1 Year</option>
                <option value="730">2 Years</option>
                <option value="-1">Unlimited</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tracking Options</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="trackUserActions"
                    checked={formData.trackUserActions}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Track User Actions</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="trackDataChanges"
                    checked={formData.trackDataChanges}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Track Data Changes</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="trackLoginActivity"
                    checked={formData.trackLoginActivity}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Track Login Activity</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HistoryTagsModal;