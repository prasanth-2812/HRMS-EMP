import React, { useState } from 'react';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  description: string;
  isActive: boolean;
}

interface JobPositionSettingsProps {
  onClose?: () => void;
}

const JobPositionSettings: React.FC<JobPositionSettingsProps> = ({ onClose }) => {
  const [positions, setPositions] = useState<JobPosition[]>([
    { id: 1, title: 'Software Engineer', department: 'IT', description: 'Develops software applications', isActive: true },
    { id: 2, title: 'HR Manager', department: 'HR', description: 'Manages human resources', isActive: true },
    { id: 3, title: 'Marketing Specialist', department: 'Marketing', description: 'Handles marketing campaigns', isActive: true }
  ]);

  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    description: '',
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewPosition(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const position: JobPosition = {
      id: Date.now(),
      ...newPosition
    };
    setPositions(prev => [...prev, position]);
    setNewPosition({ title: '', department: '', description: '', isActive: true });
    setShowAddForm(false);
  };

  const handleDeletePosition = (id: number) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
  };

  const togglePositionStatus = (id: number) => {
    setPositions(prev => prev.map(pos => 
      pos.id === id ? { ...pos, isActive: !pos.isActive } : pos
    ));
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Job Position Settings</h2>
        <p>Manage job positions in your organization</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Position
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Job Position</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddPosition} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Position Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPosition.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={newPosition.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newPosition.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newPosition.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Position
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

      <div className="positions-list">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Position Title</th>
                <th>Department</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(position => (
                <tr key={position.id}>
                  <td>{position.title}</td>
                  <td>{position.department}</td>
                  <td>{position.description}</td>
                  <td>
                    <span className={`status ${position.isActive ? 'active' : 'inactive'}`}>
                      {position.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => togglePositionStatus(position.id)}
                    >
                      {position.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePosition(position.id)}
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

export default JobPositionSettings;