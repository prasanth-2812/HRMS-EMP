import React, { useState } from 'react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  isActive: boolean;
}

interface JobPositionsModalProps {
  onClose: () => void;
}

const JobPositionsModal: React.FC<JobPositionsModalProps> = ({ onClose }) => {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    isActive: true
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations'];

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
      setPositions(prev => prev.map(pos => 
        pos.id === isEditing ? { ...pos, ...formData } : pos
      ));
      setIsEditing(null);
    } else {
      const newPosition: JobPosition = {
        id: Date.now().toString(),
        ...formData
      };
      setPositions(prev => [...prev, newPosition]);
    }

    setFormData({ title: '', department: '', description: '', isActive: true });
  };

  const handleEdit = (position: JobPosition) => {
    setFormData({
      title: position.title,
      department: position.department,
      description: position.description,
      isActive: position.isActive
    });
    setIsEditing(position.id);
  };

  const handleDelete = (id: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Job Positions</h2>
          <p>Manage job positions in your organization</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label htmlFor="title">Position Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter position title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter position description"
                rows={3}
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
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setIsEditing(null);
                  setFormData({ title: '', department: '', description: '', isActive: true });
                }}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Position' : 'Add Position'}
              </button>
            </div>
          </form>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Existing Positions</h3>
            
            {positions.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>
                No positions found. Add your first position above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {positions.map(position => (
                  <div
                    key={position.id}
                    style={{
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: position.isActive ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                          {position.title}
                          <span style={{ 
                            marginLeft: '8px', 
                            padding: '2px 8px', 
                            backgroundColor: '#dbeafe', 
                            color: '#1e40af', 
                            borderRadius: '4px', 
                            fontSize: '12px' 
                          }}>
                            {position.department}
                          </span>
                        </h4>
                        {position.description && (
                          <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>
                            {position.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(position)}
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
                          onClick={() => handleDelete(position.id)}
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

export default JobPositionsModal;