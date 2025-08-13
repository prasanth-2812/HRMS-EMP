import React, { useState } from 'react';

interface AccessibilityRestrictionModalProps {
  onClose: () => void;
}

const AccessibilityRestrictionModal: React.FC<AccessibilityRestrictionModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    enableScreenReader: false,
    highContrast: false,
    largeText: false,
    keyboardNavigation: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Accessibility Restriction Settings:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Accessibility Restriction</h2>
          <p>Configure accessibility settings and restrictions</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Accessibility Options</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="enableScreenReader"
                    checked={formData.enableScreenReader}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Enable Screen Reader Support</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="highContrast"
                    checked={formData.highContrast}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>High Contrast Mode</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="largeText"
                    checked={formData.largeText}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Large Text</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="keyboardNavigation"
                    checked={formData.keyboardNavigation}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Keyboard Navigation</span>
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

export default AccessibilityRestrictionModal;