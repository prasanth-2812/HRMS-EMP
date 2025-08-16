import React, { useState, useEffect } from 'react';

interface DisciplinaryActionTypeData {
  id: number;
  title: string;
  type: string;
  loginBlock: boolean;
  company?: string;
}

interface DisciplinaryActionTypeModalProps {
  onClose: () => void;
  editingItem?: DisciplinaryActionTypeData | null;
}

const DisciplinaryActionTypeModal: React.FC<DisciplinaryActionTypeModalProps> = ({ onClose, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    loginBlock: false,
    company: ''
  });

  // Dummy disciplinary action type options
  const typeOptions = [
    'Warning',
    'Suspension',
    'Dismissal',
    'Corrective Action',
    'Performance Review',
    'Probation'
  ];

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
        title: editingItem.title,
        type: editingItem.type,
        loginBlock: editingItem.loginBlock,
        company: editingItem.company || ''
      });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Disciplinary Action Type form data:', formData);
    // TODO: Implement save functionality
    onClose();
  };

  const handleCancel = () => {
    setFormData({ title: '', type: '', loginBlock: false, company: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Disciplinary Action Type' : 'Create Disciplinary Action Type'}</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form id="disciplinary-action-type-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title <span style={{ color: '#ef4444' }}>*</span>:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type <span style={{ color: '#ef4444' }}>*</span>:</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {typeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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

            <div className="form-group">
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="loginBlock"
                  checked={formData.loginBlock}
                  onChange={handleInputChange}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <span style={{ fontWeight: '500' }}>Enable login block</span>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                    If enabled, employees log in will be blocked based on period of suspension or dismissal.
                  </div>
                </div>
              </label>
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
            {editingItem ? 'Update disciplinary action type information' : 'Create new disciplinary action type'}
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
              form="disciplinary-action-type-form" 
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

export default DisciplinaryActionTypeModal;