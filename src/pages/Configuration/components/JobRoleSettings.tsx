import React, { useState } from 'react';

interface JobRole {
  id: number;
  name: string;
  jobPosition: string;
  description: string;
  isActive: boolean;
}

interface JobRoleSettingsProps {
  onClose?: () => void;
}

const JobRoleSettings: React.FC<JobRoleSettingsProps> = ({ onClose }) => {
  const [roles, setRoles] = useState<JobRole[]>([
    { id: 1, name: 'Senior Developer', jobPosition: 'Software Engineer', description: 'Lead development projects', isActive: true },
    { id: 2, name: 'Junior Developer', jobPosition: 'Software Engineer', description: 'Support development tasks', isActive: true },
    { id: 3, name: 'HR Coordinator', jobPosition: 'HR Manager', description: 'Coordinate HR activities', isActive: true }
  ]);

  const [newRole, setNewRole] = useState({
    name: '',
    jobPosition: '',
    description: '',
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const jobPositions = [
    'Software Engineer',
    'HR Manager',
    'Marketing Specialist',
    'Sales Representative',
    'Project Manager'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewRole(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const role: JobRole = {
      id: Date.now(),
      ...newRole
    };
    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', jobPosition: '', description: '', isActive: true });
    setShowAddForm(false);
  };

  const handleDeleteRole = (id: number) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  const toggleRoleStatus = (id: number) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, isActive: !role.isActive } : role
    ));
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Job Role Settings</h2>
        <p>Manage job roles and their assignments</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Role
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Job Role</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddRole} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Role Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRole.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobPosition">Job Position</label>
                <select
                  id="jobPosition"
                  name="jobPosition"
                  value={newRole.jobPosition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select job position</option>
                  {jobPositions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newRole.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newRole.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Role
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

      <div className="roles-list">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Job Position</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.jobPosition}</td>
                  <td>{role.description}</td>
                  <td>
                    <span className={`status ${role.isActive ? 'active' : 'inactive'}`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toggleRoleStatus(role.id)}
                    >
                      {role.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRole(role.id)}
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

export default JobRoleSettings;