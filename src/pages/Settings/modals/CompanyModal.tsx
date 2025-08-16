import React, { useState, useEffect } from 'react';
import { 
  Company, 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '../../../services/baseService';

interface CompanyModalProps {
  onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ onClose }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    icon: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCompanies();
      setCompanies(response.results);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let submitData: any;
      
      if (selectedFile) {
        // Use FormData for file upload
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('company', formData.company);
        formDataToSubmit.append('address', formData.address);
        formDataToSubmit.append('country', formData.country);
        formDataToSubmit.append('state', formData.state);
        formDataToSubmit.append('city', formData.city);
        formDataToSubmit.append('zip', formData.zip);
        formDataToSubmit.append('icon', selectedFile);
        submitData = formDataToSubmit;
      } else {
        // Use regular JSON payload
        const { icon, ...dataWithoutIcon } = formData;
        submitData = dataWithoutIcon;
      }
      
      if (isEditing) {
        await updateCompany(isEditing, submitData);
        showNotification('Company updated successfully!');
      } else {
        await createCompany(submitData);
        showNotification('Company created successfully!');
      }
      
      // Reset form and refresh list
      setFormData({
        company: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        icon: ''
      });
      setSelectedFile(null);
      setShowCreateForm(false);
      setIsEditing(null);
      await fetchCompanies();
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      company: company.company,
      address: company.address,
      country: company.country,
      state: company.state,
      city: company.city,
      zip: company.zip,
      icon: company.icon || ''
    });
    setIsEditing(company.id!);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteCompany(id);
        showNotification('Company deleted successfully!');
        await fetchCompanies();
      } catch (err: any) {
        setError(err.message);
        console.error('Error deleting company:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - you can replace with your toast system
    alert(message);
  };

  const handleCancel = () => {
    setFormData({
      company: '',
      address: '',
      country: '',
      state: '',
      city: '',
      zip: '',
      icon: ''
    });
    setSelectedFile(null);
    setShowCreateForm(false);
    setIsEditing(null);
    setError(null);
  };

  const handleCreateNew = () => {
    setFormData({
      company: '',
      address: '',
      country: '',
      state: '',
      city: '',
      zip: '',
      icon: ''
    });
    setIsEditing(null);
    setShowCreateForm(true);
  };



  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '600px' }}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Company' : 'Create Company'}</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body" style={{ flex: '1', overflowY: 'auto', padding: '20px', maxHeight: 'calc(80vh - 250px)' }}>
            <form id="company-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company">Company Name:</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Company Address"
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zip">Zip:</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="icon">Company Icon:</label>
                <input
                  type="file"
                  id="icon"
                  name="icon"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                  }}
                />
                {selectedFile && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

            </form>
          </div>
          
          <div className="modal-footer" style={{ 
            padding: '24px', 
            borderTop: '2px solid #e2e8f0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '16px', 
            backgroundColor: '#f8fafc', 
            flexShrink: 0, 
            boxShadow: '0 -6px 20px rgba(0,0,0,0.1)',
            borderRadius: '0 0 12px 12px',
            minHeight: '120px',
            position: 'sticky',
            bottom: 0,
            zIndex: 100
          }}>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
              {isEditing ? 'Update company information' : 'Create new company'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancel}
                style={{ 
                  minWidth: '120px', 
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: '600',
                  border: '2px solid #6b7280',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="company-form" 
                className="btn btn-primary" 
                style={{ 
                  minWidth: '140px', 
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: '700',
                  backgroundColor: '#2563eb',
                  border: '2px solid #2563eb',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#ffffff',
                  transition: 'all 0.2s ease'
                }}
              >
                {isEditing ? '✓ UPDATE' : '+ CREATE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Company</h2>
          <button className="btn btn-primary" onClick={handleCreateNew} style={{ marginRight: '10px' }}>
            + Create
          </button>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#64748b'
            }}>
              <div>Loading companies...</div>
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              Error: {error}
            </div>
          )}
          
          {!loading && !error && companies.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: '#64748b'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px'
              }}>
                <ion-icon name="business-outline" style={{ fontSize: '32px', color: '#94a3b8' }}></ion-icon>
              </div>
              <p>There is no company at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Company Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Address</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Location</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{company.company}</td>
                      <td style={{ padding: '12px' }}>{company.address}</td>
                      <td style={{ padding: '12px' }}>{company.city}, {company.state}, {company.country}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(company)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748b',
                              padding: '4px'
                            }}
                            title="Edit"
                            disabled={loading}
                          >
                            <ion-icon name="create-outline"></ion-icon>
                          </button>
                          <button
                            onClick={() => handleDelete(company.id!)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                              padding: '4px'
                            }}
                            title="Delete"
                            disabled={loading}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;