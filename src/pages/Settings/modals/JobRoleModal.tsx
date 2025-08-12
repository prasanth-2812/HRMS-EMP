import React, { useState } from 'react';

interface JobRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

interface JobRoleModalProps {
  onClose: () => void;
}

const JobRoleModal: React.FC<JobRoleModalProps> = ({ onClose }) => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isActive: true
  });

  const availablePermissions = [
    'View Employees', 'Edit Employees', 'Delete Employees',
    'View Attendance', 'Edit Attendance', 'View Reports',
    'Manage Payroll', 'Manage Leaves', 'System Admin'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: JobRole = {
      id: Date.now().toString(),
      ...formData
    };
    setRoles(prev => [...prev, newRole]);
    setFormData({ name: '', description: '', permissions: [], isActive: true });
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Job Roles</h2>
          <p>Define roles and permissions</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Role Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter role description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Permissions</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {availablePermissions.map(permission => (
                  <label key={permission} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    <span style={{ fontSize: '14px' }}>{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Role
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobRoleModal;