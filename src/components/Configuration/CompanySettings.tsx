import React, { useState } from 'react';

interface CompanySettingsProps {
  onClose?: () => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ onClose }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    registrationNumber: '',
    logo: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Company settings saved:', companyData);
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Company Settings</h2>
        <p>Manage your company information and details</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleInputChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Company Logo</label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={companyData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={companyData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={companyData.website}
              onChange={handleInputChange}
              placeholder="https://www.example.com"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Address Information</h3>
          
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <textarea
              id="address"
              name="address"
              value={companyData.address}
              onChange={handleInputChange}
              placeholder="Enter street address"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={companyData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={companyData.state}
                onChange={handleInputChange}
                placeholder="Enter state or province"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={companyData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP or postal code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={companyData.country}
                onChange={handleInputChange}
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Legal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxId">Tax ID</label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={companyData.taxId}
                onChange={handleInputChange}
                placeholder="Enter tax identification number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={companyData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Enter company registration number"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Company Settings
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

export default CompanySettings;