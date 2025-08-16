import React, { useState, useEffect } from 'react';

interface EmployeeTypeData {
  id: number;
  employeeType: string;
  company?: string;
}

interface EmployeeTypeModalProps {
  onClose: () => void;
}

const EmployeeTypeModal: React.FC<EmployeeTypeModalProps> = ({ onClose }) => {
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeTypeData[]>([
    {
      id: 1,
      employeeType: 'Full-time',
      company: 'Prasanth Technologies'
    },
    {
      id: 2,
      employeeType: 'Part-time',
      company: 'Prasanth Technologies'
    },
    {
      id: 3,
      employeeType: 'Contract',
      company: 'Prasanth Technologies'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeType: '',
    company: ''
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Dummy company options
  const companyOptions = [
    'Prasanth Technologies',
    'Tech Corp',
    'Innovation Ltd',
    'StartUp Inc',
    'Global Solutions',
    'Digital Dynamics'
  ];

  useEffect(() => {
    // Component initialization - no need to fetch data as we're using dummy data
  }, []);

  const handleEdit = (employeeType: EmployeeTypeData) => {
    setFormData({
      employeeType: employeeType.employeeType,
      company: employeeType.company || ''
    });
    setIsEditing(employeeType.id);
    setShowCreateForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee type?')) {
      setEmployeeTypes(prev => prev.filter(type => type.id !== id));
      showNotification('Employee type deleted successfully!');
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - you can replace with your toast system
    alert(message);
  };

  const handleCreateNew = () => {
    setIsEditing(null);
    setFormData({
      employeeType: '',
      company: ''
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      employeeType: '',
      company: ''
    });
    setShowCreateForm(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing employee type
      setEmployeeTypes(prev => prev.map(type => 
        type.id === isEditing 
          ? { ...formData, id: isEditing }
          : type
      ));
      showNotification('Employee type updated successfully!');
    } else {
      // Create new employee type
      const newEmployeeType: EmployeeTypeData = {
        ...formData,
        id: Math.max(...employeeTypes.map(t => t.id), 0) + 1
      };
      setEmployeeTypes(prev => [...prev, newEmployeeType]);
      showNotification('Employee type created successfully!');
    }
    
    handleCancel();
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Employee Type' : 'Create Employee Type'}</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        
        <div className="modal-body">
          <form id="employee-type-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="employeeType" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Employee type:
              </label>
              <input
                type="text"
                id="employeeType"
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
                placeholder="Employee type"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="company" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Company:
              </label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Prasanth Technologies">Prasanth Technologies</option>
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
            {isEditing ? 'Update employee type information' : 'Create new employee type'}
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
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // List view
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Employee Type</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Employee Types</h3>
            <button 
              onClick={handleCreateNew}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Create
            </button>
          </div>
          
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              Loading...
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '6px', 
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              Error: {error}
            </div>
          )}
          
          {!loading && !error && employeeTypes.length === 0 ? (
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
                <ion-icon name="people-outline" style={{ fontSize: '32px', color: '#94a3b8' }}></ion-icon>
              </div>
              <p>There are no employee types at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Employee Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Company</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeTypes.map(type => (
                    <tr key={type.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{type.employeeType}</td>
                      <td style={{ padding: '12px' }}>{type.company}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(type)}
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
                            <ion-icon name="create-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
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
                            <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon>
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

export default EmployeeTypeModal;