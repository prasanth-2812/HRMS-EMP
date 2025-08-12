import React, { useState } from 'react';

interface GeneralSettingsModalProps {
  onClose: () => void;
}

const GeneralSettingsModal: React.FC<GeneralSettingsModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    announcementExpireDays: '30',
    defaultRecordsPerPage: '10',
    restrictLoginAccount: false,
    restrictProfileEdit: false,
    resignationRequest: false,
    timeRunner: true,
    defaultNotificationPeriod: '30',
    prefixId: 'PH',
    companyName: 'Prasanth Technologies',
    bonusUnit: '1',
    leaveUnit: 'Account',
    trackingFields: false,
    workInformationTracking: false,
    currencySymbol: '$',
    position: 'PostFix',
    company: 'Prasanth Technologies'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('General Settings:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>General Settings</h2>
          <p>Configure general system settings</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="announcementExpireDays">Announcement Expire Days</label>
              <input
                type="number"
                id="announcementExpireDays"
                name="announcementExpireDays"
                value={formData.announcementExpireDays}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="defaultRecordsPerPage">Default Records Per Page</label>
              <select
                id="defaultRecordsPerPage"
                name="defaultRecordsPerPage"
                value={formData.defaultRecordsPerPage}
                onChange={handleInputChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employee Account Restrictions</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="restrictLoginAccount"
                    checked={formData.restrictLoginAccount}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Restrict Login Account</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="restrictProfileEdit"
                    checked={formData.restrictProfileEdit}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Restrict Profile Edit</span>
              </div>
            </div>

            <div className="form-group">
              <label>Resignation Request</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="resignationRequest"
                    checked={formData.resignationRequest}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Enable Resignation Request</span>
              </div>
            </div>

            <div className="form-group">
              <label>Time Runner</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="timeRunner"
                    checked={formData.timeRunner}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>At Work Tracker</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="defaultNotificationPeriod">Default Notice Period</label>
              <input
                type="number"
                id="defaultNotificationPeriod"
                name="defaultNotificationPeriod"
                value={formData.defaultNotificationPeriod}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prefixId">Badge Prefix</label>
              <input
                type="text"
                id="prefixId"
                name="prefixId"
                value={formData.prefixId}
                onChange={handleInputChange}
                placeholder="Enter prefix"
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company</label>
              <select
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              >
                <option value="Prasanth Technologies">Prasanth Technologies</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employee History Tracking</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="trackingFields"
                    checked={formData.trackingFields}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Tracking Fields</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="workInformationTracking"
                    checked={formData.workInformationTracking}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Work Information Tracking</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currencySymbol">Currency Symbol</label>
              <input
                type="text"
                id="currencySymbol"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleInputChange}
                placeholder="$"
              />
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

export default GeneralSettingsModal;