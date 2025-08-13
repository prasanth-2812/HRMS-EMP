import React, { useState } from 'react';
import './GeneralSettingsForm.css';

const GeneralSettingsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    announcementExpireDays: '30',
    defaultRecordsPerPage: '10',
    restrictLoginAccount: false,
    restrictProfileEdit: false,
    resignationRequest: false,
    resignationRequestId: '',
    timeRunner: true,
    atWorkTracker: false,
    defaultNotificationPeriod: '30',
    prefixId: 'PH',
    companyName: 'Prasanth Technologies',
    bonusUnit: '1',
    leaveUnit: '1',
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
    console.log('General Settings:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="general-settings-form">
      <div className="general-settings-header">
        <h2>General Settings</h2>
        <p>Configure general system settings for your HRMS</p>
      </div>

      <form onSubmit={handleSubmit} className="general-settings-content">
        {/* Announcement Expire */}
        <div className="form-section">
          <h3>Announcement Expire</h3>
          <div className="form-group">
            <label htmlFor="announcementExpireDays">General Expire Days</label>
            <div className="input-with-button">
              <input
                type="number"
                id="announcementExpireDays"
                name="announcementExpireDays"
                value={formData.announcementExpireDays}
                onChange={handleInputChange}
                min="1"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Default Records Per Page */}
        <div className="form-section">
          <h3>Default Records Per Page</h3>
          <div className="form-group">
            <label htmlFor="defaultRecordsPerPage">Pagination</label>
            <div className="input-with-button">
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
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Employee Account Restrictions */}
        <div className="form-section">
          <h3>Employee Account Restrictions</h3>
          <div className="form-group">
            <label>Restrict Login Account</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="restrictLoginAccount"
                  checked={formData.restrictLoginAccount}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Restrict Profile Edit</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="restrictProfileEdit"
                  checked={formData.restrictProfileEdit}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Resignation Request */}
        <div className="form-section">
          <h3>Resignation Request</h3>
          <div className="form-group">
            <label>Resignation Request</label>
            <div className="input-with-button">
              <input
                type="text"
                name="resignationRequestId"
                value={formData.resignationRequestId}
                onChange={handleInputChange}
                placeholder="Enter ID"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Time Runner */}
        <div className="form-section">
          <h3>Time Runner</h3>
          <div className="form-group">
            <label>At Work Tracker</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="atWorkTracker"
                  checked={formData.atWorkTracker}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notice Period */}
        <div className="form-section">
          <h3>Notice Period</h3>
          <div className="form-group">
            <label htmlFor="defaultNotificationPeriod">Default Notice Period</label>
            <div className="input-with-button">
              <input
                type="number"
                id="defaultNotificationPeriod"
                name="defaultNotificationPeriod"
                value={formData.defaultNotificationPeriod}
                onChange={handleInputChange}
                min="1"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Badge Prefix */}
        <div className="form-section">
          <h3>Badge Prefix</h3>
          <div className="form-group">
            <label htmlFor="prefixId">Prefix</label>
            <div className="input-with-button">
              <input
                type="text"
                id="prefixId"
                name="prefixId"
                value={formData.prefixId}
                onChange={handleInputChange}
                placeholder="Enter prefix"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company</label>
            <div className="input-with-button">
              <select
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              >
                <option value="Prasanth Technologies">Prasanth Technologies</option>
              </select>
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Encashment Redeem Condition */}
        <div className="form-section">
          <h3>Encashment Redeem Condition</h3>
          <div className="form-group">
            <label htmlFor="bonusUnit">Bonus Unit</label>
            <div className="input-with-button">
              <input
                type="number"
                id="bonusUnit"
                name="bonusUnit"
                value={formData.bonusUnit}
                onChange={handleInputChange}
                min="1"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="leaveUnit">Leave Unit</label>
            <div className="input-with-button">
              <input
                type="number"
                id="leaveUnit"
                name="leaveUnit"
                value={formData.leaveUnit}
                onChange={handleInputChange}
                min="1"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Employee History Tracking */}
        <div className="form-section">
          <h3>Employee History Tracking</h3>
          <div className="form-group">
            <label>Tracking Fields</label>
            <div className="input-with-button">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="trackingFields"
                  checked={formData.trackingFields}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
          <div className="form-group">
            <label>Work Information Tracking</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="workInformationTracking"
                  checked={formData.workInformationTracking}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="form-section">
          <h3>Currency</h3>
          <div className="form-group">
            <label htmlFor="currencySymbol">Currency Symbol</label>
            <div className="input-with-button">
              <input
                type="text"
                id="currencySymbol"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleInputChange}
                placeholder="$"
              />
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <div className="input-with-button">
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              >
                <option value="PostFix">PostFix</option>
                <option value="PreFix">PreFix</option>
              </select>
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <div className="input-with-button">
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              >
                <option value="Prasanth Technologies">Prasanth Technologies</option>
              </select>
              <button type="button" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettingsForm;