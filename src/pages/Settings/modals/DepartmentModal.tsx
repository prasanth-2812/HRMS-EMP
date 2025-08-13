import React, { useState } from 'react';

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  isActive: boolean;
}

interface DepartmentModalProps {
  onClose: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ onClose }) => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'HR',
      description: 'Human Resources Department',
      manager: 'John Doe',
      isActive: true
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    isActive: true
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      setDepartments(prev => prev.map(dept => 
        dept.id === isEditing 
          ? { ...dept, ...formData }
          : dept
      ));
      setIsEditing(null);
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...formData
      };
      setDepartments(prev => [...prev, newDepartment]);
    }

    setFormData({
      name: '',
      description: '',
      manager: '',
      isActive: true
    });
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      isActive: department.isActive
    });
    setIsEditing(department.id);
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({
      name: '',
      description: '',
      manager: '',
      isActive: true
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Department Management</h2>
          <p>Manage organizational departments</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label htmlFor="name">Department Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manager">Department Manager</label>
              <input
                type="text"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                placeholder="Enter manager name"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span>Active</span>
              </div>
            </div>

            <div className="form-actions">
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </form>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Existing Departments</h3>
            
            {departments.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>
                No departments found. Add your first department above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {departments.map(department => (
                  <div
                    key={department.id}
                    style={{
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: department.isActive ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                          {department.name}
                          {!department.isActive && (
                            <span style={{ 
                              marginLeft: '8px', 
                              padding: '2px 8px', 
                              backgroundColor: '#fef3c7', 
                              color: '#92400e', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}>
                              Inactive
                            </span>
                          )}
                        </h4>
                        {department.description && (
                          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>
                            {department.description}
                          </p>
                        )}
                        {department.manager && (
                          <p style={{ margin: '0', fontSize: '13px', color: '#475569' }}>
                            Manager: {department.manager}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(department)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;