import React, { useState } from 'react';

interface UserGroupModalProps {
  onClose: () => void;
}

const UserGroupModal: React.FC<UserGroupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    permissions: {
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canViewReports: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User Group Settings:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Group</h2>
          <p>Manage user groups and permissions</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Enter group name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter group description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Group Permissions</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="canCreateUsers"
                    checked={formData.permissions.canCreateUsers}
                    onChange={handlePermissionChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Can Create Users</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="canEditUsers"
                    checked={formData.permissions.canEditUsers}
                    onChange={handlePermissionChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Can Edit Users</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="canDeleteUsers"
                    checked={formData.permissions.canDeleteUsers}
                    onChange={handlePermissionChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Can Delete Users</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="canViewReports"
                    checked={formData.permissions.canViewReports}
                    onChange={handlePermissionChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Can View Reports</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserGroupModal;