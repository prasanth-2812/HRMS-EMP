import React, { useState, useEffect } from 'react';
import { 
  JobRole, 
  JobPosition,
  getJobRoles, 
  getJobPositions,
  createJobRole, 
  updateJobRole, 
  deleteJobRole 
} from '../../../services/baseService';

interface JobRoleModalProps {
  onClose: () => void;
}

const JobRoleModal: React.FC<JobRoleModalProps> = ({ onClose }) => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    job_position_id: '',
    job_role: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchJobRoles();
    fetchJobPositions();
  }, []);

  const fetchJobRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobRoles();
      setRoles(response.results);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching job roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPositions = async () => {
    try {
      const response = await getJobPositions();
      setJobPositions(response.results);
    } catch (err: any) {
      console.error('Error fetching job positions:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        job_position_id: parseInt(formData.job_position_id),
        job_role: formData.job_role || undefined
      };
      
      if (isEditing) {
        await updateJobRole(isEditing, submitData);
        showNotification('Job role updated successfully!');
      } else {
        await createJobRole(submitData);
        showNotification('Job role created successfully!');
      }
      
      // Reset form and refresh list
      setFormData({ job_position_id: '', job_role: '' });
      setShowCreateForm(false);
      setIsEditing(null);
      await fetchJobRoles();
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving job role:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - you can replace with your toast system
    alert(message);
  };

  const handleEdit = (role: JobRole) => {
    setFormData({ 
      job_position_id: role.job_position_id.toString(),
      job_role: role.job_role || ''
    });
    setIsEditing(role.id!);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job role?')) {
      try {
        setLoading(true);
        await deleteJobRole(id);
        showNotification('Job role deleted successfully!');
        await fetchJobRoles();
      } catch (err: any) {
        setError(err.message);
        console.error('Error deleting job role:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateNew = () => {
    setFormData({ job_position_id: '', job_role: '' });
    setIsEditing(null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setFormData({ job_position_id: '', job_role: '' });
    setIsEditing(null);
    setShowCreateForm(false);
    setError(null);
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Job Role' : 'Create Job Role'}</h2>
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
                <label htmlFor="job_position_id">Job Position:</label>
                <select
                  id="job_position_id"
                  name="job_position_id"
                  value={formData.job_position_id}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                >
                  <option value="">Select Job Position</option>
                  {jobPositions.map(position => (
                    <option key={position.id} value={position.id}>{position.job_position}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="job_role">Job Role:</label>
                <input
                  type="text"
                  id="job_role"
                  name="job_role"
                  value={formData.job_role}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Enter job role (optional)"
                />
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
          <h2>Job Role</h2>
          <button className="btn btn-primary" onClick={handleCreateNew} style={{ marginRight: '10px' }}>
            + Create
          </button>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#64748b'
            }}>
              <div>Loading job roles...</div>
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              Error: {error}
            </div>
          )}
          
          {!loading && !error && roles.length === 0 ? (
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
                <ion-icon name="people-outline" style={{ fontSize: '32px', color: '#94a3b8' }}></ion-icon>
              </div>
              <p>There is no job role at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job Position</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job Role</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => {
                    const jobPosition = jobPositions.find(pos => pos.id === role.job_position_id);
                    return (
                      <tr key={role.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>{jobPosition?.job_position || 'Unknown'}</td>
                        <td style={{ padding: '12px' }}>{role.job_role || 'Auto-generated'}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(role)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#64748b',
                                padding: '4px'
                              }}
                              title="Edit"
                              disabled={loading}
                            >
                              <ion-icon name="create-outline"></ion-icon>
                            </button>
                            <button
                              onClick={() => handleDelete(role.id!)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444',
                                padding: '4px'
                              }}
                              title="Delete"
                              disabled={loading}
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

export default JobRoleModal;