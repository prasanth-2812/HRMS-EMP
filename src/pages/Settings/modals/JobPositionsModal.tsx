import React, { useState, useEffect } from 'react';
import { 
  JobPosition, 
  Department,
  getJobPositions, 
  createJobPosition, 
  updateJobPosition, 
  deleteJobPosition,
  getDepartments
} from '../../../services/baseService';

interface JobPositionsModalProps {
  onClose: () => void;
}

const JobPositionsModal: React.FC<JobPositionsModalProps> = ({ onClose }) => {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    job_position: '',
    department_id: ''
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchJobPositions();
    fetchDepartments();
  }, []);

  const fetchJobPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobPositions();
      setPositions(response.results);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching job positions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.results);
    } catch (err: any) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await updateJobPosition(isEditing, {
          ...formData,
          department_id: parseInt(formData.department_id)
        });
        showNotification('Job position updated successfully!');
      } else {
        await createJobPosition({
          ...formData,
          department_id: parseInt(formData.department_id)
        });
        showNotification('Job position created successfully!');
      }
      
      // Reset form and refresh list
      setFormData({ job_position: '', department_id: '' });
      setShowCreateForm(false);
      setIsEditing(null);
      await fetchJobPositions();
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving job position:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (position: JobPosition) => {
    setFormData({
      job_position: position.job_position,
      department_id: position.department_id?.toString() || ''
    });
    setIsEditing(position.id!);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job position?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteJobPosition(id);
        showNotification('Job position deleted successfully!');
        await fetchJobPositions();
      } catch (err: any) {
        setError(err.message);
        console.error('Error deleting job position:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - you can replace with your toast system
    alert(message);
  };

  const handleCreateNew = () => {
    setIsEditing(null);
    setFormData({
      job_position: '',
      department_id: ''
    });
    setError(null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      job_position: '',
      department_id: ''
    });
    setError(null);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Job Position' : 'Create Job Position'}</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="job_position">Job Position:</label>
                <input
                  type="text"
                  id="job_position"
                  name="job_position"
                  value={formData.job_position}
                  onChange={handleInputChange}
                  placeholder="Job Position"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department_id">Department:</label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.department}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Job Position</h2>
          <button className="btn btn-primary" onClick={handleCreateNew} style={{ marginRight: '10px' }}>
            + Create
          </button>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: '#64748b'
            }}>
              <p>Loading job positions...</p>
            </div>
          ) : error ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: '#ef4444'
            }}>
              <p>Error: {error}</p>
            </div>
          ) : positions.length === 0 ? (
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
                <ion-icon name="briefcase-outline" style={{ fontSize: '32px', color: '#94a3b8' }}></ion-icon>
              </div>
              <p>There is no job position at this moment.</p>
            </div>
          ) : (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job Position</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(position => {
                    const department = departments.find(d => d.id === position.department_id);
                    return (
                      <tr key={position.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>{department?.department || 'Unknown'}</td>
                        <td style={{ padding: '12px' }}>{position.job_position}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(position)}
                              disabled={loading}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                color: loading ? '#94a3b8' : '#64748b',
                                padding: '4px'
                              }}
                              title="Edit"
                            >
                              <ion-icon name="create-outline"></ion-icon>
                            </button>
                            <button
                              onClick={() => handleDelete(position.id!)}
                              disabled={loading}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                color: loading ? '#94a3b8' : '#ef4444',
                                padding: '4px'
                              }}
                            title="Delete"
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPositionsModal;