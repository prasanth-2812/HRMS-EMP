import React, { useState } from 'react';

interface MailServerModalProps {
  onClose: () => void;
}

const MailServerModal: React.FC<MailServerModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    encryption: 'TLS',
    fromEmail: '',
    fromName: '',
    testEmail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mail Server Settings:', formData);
    onClose();
  };

  const handleTestEmail = () => {
    console.log('Testing email configuration...');
    alert('Test email sent successfully!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Mail Server</h2>
          <p>Configure SMTP mail server settings</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="smtpHost">SMTP Host</label>
              <input
                type="text"
                id="smtpHost"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleInputChange}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="smtpPort">SMTP Port</label>
              <input
                type="number"
                id="smtpPort"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleInputChange}
                placeholder="587"
              />
            </div>

            <div className="form-group">
              <label htmlFor="encryption">Encryption</label>
              <select
                id="encryption"
                name="encryption"
                value={formData.encryption}
                onChange={handleInputChange}
              >
                <option value="TLS">TLS</option>
                <option value="SSL">SSL</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="smtpUsername">SMTP Username</label>
              <input
                type="text"
                id="smtpUsername"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleInputChange}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="smtpPassword">SMTP Password</label>
              <input
                type="password"
                id="smtpPassword"
                name="smtpPassword"
                value={formData.smtpPassword}
                onChange={handleInputChange}
                placeholder="Your app password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fromEmail">From Email</label>
              <input
                type="email"
                id="fromEmail"
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleInputChange}
                placeholder="noreply@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fromName">From Name</label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={formData.fromName}
                onChange={handleInputChange}
                placeholder="Company HRMS"
              />
            </div>

            <div className="form-group">
              <label htmlFor="testEmail">Test Email</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  id="testEmail"
                  name="testEmail"
                  value={formData.testEmail}
                  onChange={handleInputChange}
                  placeholder="test@example.com"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleTestEmail}>
                  Test
                </button>
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

export default MailServerModal;