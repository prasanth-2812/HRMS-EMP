import React, { useState, useEffect } from 'react';
import { 
  Department, 
  Company,
  getDepartments, 
  getCompanies,
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../../../services/baseService';

interface DepartmentModalProps {
  onClose: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ onClose }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    company_id: ''
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Fetch departments and companies on component mount
  useEffect(() => {
    fetchDepartments();
    fetchCompanies();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDepartments();
      setDepartments(response.results);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.results);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
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
      
      const submitData = {
        department: formData.department,
        ...(formData.company_id && { company_id: [parseInt(formData.company_id)] })
      };
      
      if (isEditing) {
        await updateDepartment(isEditing, submitData);
        showNotification('Department updated successfully!');
      } else {
        await createDepartment(submitData);
        showNotification('Department created successfully!');
      }
      
      // Reset form and refresh list
      setFormData({ department: '', company_id: '' });
      setShowCreateForm(false);
      setIsEditing(null);
      await fetchDepartments();
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving department:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({
      department: department.department,
      company_id: department.company_id ? department.company_id[0]?.toString() || '' : ''
    });
    setIsEditing(department.id!);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteDepartment(id);
        showNotification('Department deleted successfully!');
        await fetchDepartments();
      } catch (err: any) {
        setError(err.message);
        console.error('Error deleting department:', err);
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
    setFormData({ department: '', company_id: '' });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ department: '', company_id: '' });
    setShowCreateForm(false);
    setError(null);
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Department' : 'Create Department'}</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '6px', 
                  color: '#dc2626',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="department">Department:</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company_id">Company:</label>
                <select
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Select Company (Optional)</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.company}
                    </option>
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
          <h2>Department</h2>
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
              <div>Loading departments...</div>
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
          
          {!loading && !error && departments.length === 0 ? (
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
              <p>There is no department at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department Name</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(department => (
                    <tr key={department.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{department.department}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(department)}
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
                            <ion-icon name="create-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                          <button
                            onClick={() => handleDelete(department.id!)}
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
                            <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon>
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

export default DepartmentModal;