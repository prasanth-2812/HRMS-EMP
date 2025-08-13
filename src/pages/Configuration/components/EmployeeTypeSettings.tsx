import React, { useState } from 'react';

interface EmployeeType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface EmployeeTypeSettingsProps {
  onClose?: () => void;
}

const EmployeeTypeSettings: React.FC<EmployeeTypeSettingsProps> = ({ onClose }) => {
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([
    { id: 1, name: 'Full-time', description: 'Regular full-time employees', isActive: true },
    { id: 2, name: 'Part-time', description: 'Part-time employees', isActive: true },
    { id: 3, name: 'Contract', description: 'Contract-based employees', isActive: true },
    { id: 4, name: 'Intern', description: 'Internship positions', isActive: true }
  ]);

  const [newType, setNewType] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeType: EmployeeType = {
      id: Date.now(),
      ...newType
    };
    setEmployeeTypes(prev => [...prev, employeeType]);
    setNewType({ name: '', description: '', isActive: true });
    setShowAddForm(false);
  };

  const handleDeleteType = (id: number) => {
    setEmployeeTypes(prev => prev.filter(type => type.id !== id));
  };

  const toggleTypeStatus = (id: number) => {
    setEmployeeTypes(prev => prev.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Employee Type Settings</h2>
        <p>Manage different types of employee classifications</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Type
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Employee Type</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddType} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Type Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newType.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newType.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newType.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Type
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="types-list">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeTypes.map(type => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{type.description}</td>
                  <td>
                    <span className={`status ${type.isActive ? 'active' : 'inactive'}`}>
                      {type.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toggleTypeStatus(type.id)}
                    >
                      {type.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteType(type.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTypeSettings;