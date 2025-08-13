import React, { useState } from 'react';

interface GdriveBackupModalProps {
  onClose: () => void;
}

const GdriveBackupModal: React.FC<GdriveBackupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    enableAutoBackup: false,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30',
    includeAttachments: true,
    includeReports: true,
    googleDriveConnected: false
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
    console.log('Gdrive Backup Settings:', formData);
    onClose();
  };

  const handleConnectGoogleDrive = () => {
    console.log('Connecting to Google Drive...');
    setFormData(prev => ({ ...prev, googleDriveConnected: true }));
    alert('Google Drive connected successfully!');
  };

  const handleDisconnectGoogleDrive = () => {
    console.log('Disconnecting from Google Drive...');
    setFormData(prev => ({ ...prev, googleDriveConnected: false }));
  };

  const handleBackupNow = () => {
    console.log('Starting manual backup...');
    alert('Backup started successfully!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Google Drive Backup</h2>
          <p>Configure automatic backup to Google Drive</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Google Drive Connection</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                {formData.googleDriveConnected ? (
                  <>
                    <span style={{ color: '#28a745' }}>✓ Connected</span>
                    <button type="button" className="btn btn-secondary" onClick={handleDisconnectGoogleDrive}>
                      Disconnect
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#dc3545' }}>✗ Not Connected</span>
                    <button type="button" className="btn btn-primary" onClick={handleConnectGoogleDrive}>
                      Connect Google Drive
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="enableAutoBackup"
                    checked={formData.enableAutoBackup}
                    onChange={handleInputChange}
                    disabled={!formData.googleDriveConnected}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Enable Automatic Backup</span>
              </div>
            </div>

            {formData.enableAutoBackup && (
              <>
                <div className="form-group">
                  <label htmlFor="backupFrequency">Backup Frequency</label>
                  <select
                    id="backupFrequency"
                    name="backupFrequency"
                    value={formData.backupFrequency}
                    onChange={handleInputChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="backupTime">Backup Time</label>
                  <input
                    type="time"
                    id="backupTime"
                    name="backupTime"
                    value={formData.backupTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="retentionDays">Retention Period (Days)</label>
                  <select
                    id="retentionDays"
                    name="retentionDays"
                    value={formData.retentionDays}
                    onChange={handleInputChange}
                  >
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Backup Content</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="includeAttachments"
                    checked={formData.includeAttachments}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Include Attachments</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="includeReports"
                    checked={formData.includeReports}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Include Reports</span>
              </div>
            </div>

            {formData.googleDriveConnected && (
              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={handleBackupNow}>
                  Backup Now
                </button>
              </div>
            )}

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

export default GdriveBackupModal;