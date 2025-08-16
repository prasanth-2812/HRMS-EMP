import React, { useState, useEffect } from 'react';

interface EmployeeTypeData {
  id: number;
  employeeType: string;
  company?: string;
}

interface EmployeeTypeModalProps {
  onClose: () => void;
  editingItem?: EmployeeTypeData | null;
}

const EmployeeTypeModal: React.FC<EmployeeTypeModalProps> = ({ onClose, editingItem }) => {
  const [formData, setFormData] = useState({
    employeeType: '',
    company: ''
  });

  // Dummy company options
  const companyOptions = [
    'Tech Corp',
    'Innovation Ltd',
    'StartUp Inc',
    'Global Solutions',
    'Digital Dynamics'
  ];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        employeeType: editingItem.employeeType,
        company: editingItem.company || ''
      });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Employee Type form data:', formData);
    // TODO: Implement save functionality
    onClose();
  };

  const handleCancel = () => {
    setFormData({ employeeType: '', company: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Employee Type' : 'Create Employee Type'}</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form id="employee-type-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employeeType">Employee Type <span style={{ color: '#ef4444' }}>*</span>:</label>
              <input
                type="text"
                id="employeeType"
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
                placeholder="Enter employee type"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company:</label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              >
                <option value="">Select Company (Optional)</option>
                {companyOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
            {editingItem ? 'Update employee type information' : 'Create new employee type'}
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
              form="employee-type-form" 
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
              {editingItem ? '✓ UPDATE' : '+ CREATE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTypeModal;