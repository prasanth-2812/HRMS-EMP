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
            <div className="form-group">
              <label htmlFor="employeeType">Employee type:</label>
              <input
                type="text"
                id="employeeType"
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
                placeholder="Employee type"
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
                <option value="Prasanth Technologies">Prasanth Technologies</option>
                {companyOptions.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="employee-type-form" 
            className="btn btn-primary"
          >
            {isEditing ? 'Update' : 'Save'}
          </button>
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
          <div className="table-header">
            <h3>Employee Types</h3>
            <button 
              className="btn btn-primary"
              onClick={handleCreateNew}
            >
              + Create
            </button>
          </div>
          
          {loading && (
            <div className="loading-container">
              Loading...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && employeeTypes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <p>There are no employee types at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Type</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeTypes.map(type => (
                    <tr key={type.id}>
                      <td>{type.employeeType}</td>
                      <td>{type.company}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(type)}
                            title="Edit"
                            disabled={loading}
                          >
                            <ion-icon name="create-outline"></ion-icon>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(type.id)}
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

export default EmployeeTypeModal;