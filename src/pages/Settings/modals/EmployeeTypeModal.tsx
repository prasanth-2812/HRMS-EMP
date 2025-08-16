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

interface EmployeeTypeModalProps {
  onClose: () => void;
}

const EmployeeTypeModal: React.FC<EmployeeTypeModalProps> = ({ onClose }) => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    job_position: '',
    department_id: ''
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    fetchJobPositions();
    fetchDepartments();
  }, []);

  const fetchJobPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobPositions();
      setJobPositions(response.results);
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

  const getDepartmentName = (departmentId: number): string => {
    const department = departments.find(d => d.id === departmentId);
    return department?.department || 'Unknown Department';
  };

  const handleEdit = (jobPosition: JobPosition) => {
    setFormData({
      job_position: jobPosition.job_position,
      department_id: jobPosition.department_id.toString()
    });
    setIsEditing(jobPosition.id!);
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
    setFormData({
      job_position: '',
      department_id: ''
    });
    setIsEditing(null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setFormData({
      job_position: '',
      department_id: ''
    });
    setIsEditing(null);
    setShowCreateForm(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'department_id' ? value : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.job_position.trim() || !formData.department_id) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const jobPositionData = {
        job_position: formData.job_position.trim(),
        department_id: parseInt(formData.department_id)
      };
      
      if (isEditing) {
        // Update existing job position
        await updateJobPosition(isEditing, jobPositionData);
        showNotification('Job position updated successfully!');
      } else {
        // Create new job position
        await createJobPosition(jobPositionData);
        showNotification('Job position created successfully!');
      }
      
      await fetchJobPositions();
      handleCancel();
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving job position:', err);
    } finally {
      setLoading(false);
    }
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
          <form id="employee-type-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="job_position">Job Position *</label>
              <input
                type="text"
                id="job_position"
                name="job_position"
                value={formData.job_position}
                onChange={handleInputChange}
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: loading ? '#f8f9fa' : 'white'
                }}
                placeholder="Enter job position"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department_id">Department *</label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: loading ? '#f8f9fa' : 'white'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>{department.department}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="employee-type-form" 
            className="btn btn-primary"
          >
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
    );
  }

  // List view
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Job Position</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="table-header">
            <h3>Job Positions</h3>
            <button 
              className="btn btn-primary"
              onClick={handleCreateNew}
            >
              + Create
            </button>
          </div>
          
          {loading && (
            <div className="loading-container">
              Loading...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && jobPositions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <p>There are no job positions at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job Position</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPositions.map(position => (
                    <tr key={position.id}>
                      <td>{position.job_position}</td>
                      <td>{getDepartmentName(position.department_id)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(position)}
                            title="Edit"
                            disabled={loading}
                          >
                            <ion-icon name="create-outline"></ion-icon>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(position.id!)}
                            title="Delete"
                            disabled={loading}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTypeModal;