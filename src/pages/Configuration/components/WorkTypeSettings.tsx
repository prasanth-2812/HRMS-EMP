import React, { useState } from 'react';

interface WorkType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface WorkTypeSettingsProps {
  onClose?: () => void;
}

const WorkTypeSettings: React.FC<WorkTypeSettingsProps> = ({ onClose }) => {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([
    { id: 1, name: 'Remote', description: 'Work from home or remote location', isActive: true },
    { id: 2, name: 'On-site', description: 'Work from office premises', isActive: true },
    { id: 3, name: 'Hybrid', description: 'Combination of remote and on-site work', isActive: true },
    { id: 4, name: 'Field Work', description: 'Work at client locations or field', isActive: true }
  ]);

  const [newWorkType, setNewWorkType] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewWorkType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddWorkType = (e: React.FormEvent) => {
    e.preventDefault();
    const workType: WorkType = {
      id: Date.now(),
      ...newWorkType
    };
    setWorkTypes(prev => [...prev, workType]);
    setNewWorkType({ name: '', description: '', isActive: true });
    setShowAddForm(false);
  };

  const handleDeleteWorkType = (id: number) => {
    setWorkTypes(prev => prev.filter(type => type.id !== id));
  };

  const toggleWorkTypeStatus = (id: number) => {
    setWorkTypes(prev => prev.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Work Type Settings</h2>
        <p>Manage different work arrangements and locations</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Work Type
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Work Type</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddWorkType} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Work Type Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newWorkType.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newWorkType.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newWorkType.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Work Type
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

      <div className="work-types-list">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Work Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workTypes.map(type => (
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
                      onClick={() => toggleWorkTypeStatus(type.id)}
                    >
                      {type.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteWorkType(type.id)}
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

export default WorkTypeSettings;