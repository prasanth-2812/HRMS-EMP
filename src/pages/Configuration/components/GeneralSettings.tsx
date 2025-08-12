import React, { useState } from 'react';

interface GeneralSettingsProps {
  onClose?: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    companyName: '',
    timezone: '',
    dateFormat: '',
    currency: '',
    language: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('General settings saved:', settings);
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>General Settings</h2>
        <p>Configure basic system settings</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={settings.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={settings.timezone}
            onChange={handleInputChange}
          >
            <option value="">Select timezone</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dateFormat">Date Format</label>
          <select
            id="dateFormat"
            name="dateFormat"
            value={settings.dateFormat}
            onChange={handleInputChange}
          >
            <option value="">Select date format</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={settings.currency}
            onChange={handleInputChange}
          >
            <option value="">Select currency</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="INR">INR - Indian Rupee</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleInputChange}
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
          {onClose && (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;