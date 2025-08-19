import React, { useState, useEffect } from 'react';
import {
  getAllDisciplinaryActionTypes,
  getDisciplinaryActionTypeById,
  createDisciplinaryActionType,
  updateDisciplinaryActionType,
  deleteDisciplinaryActionType
} from '../../../services/employeeService';

interface DisciplinaryActionType {
  id: number;
  title: string;
  action_type: 'warning' | 'suspension' | 'dismissal';
  block_option: boolean;
  created_at?: string;
  is_active?: boolean;
}

interface DisciplinaryActionTypeModalProps {
  onClose: () => void;
}

const DisciplinaryActionTypeModal: React.FC<DisciplinaryActionTypeModalProps> = ({ onClose }) => {
  // State for list view and form management
  const [actionTypes, setActionTypes] = useState<DisciplinaryActionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState<DisciplinaryActionType | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    action_type: '' as 'warning' | 'suspension' | 'dismissal' | '',
    block_option: false
  });

  // Action type options based on backend model choices
  const actionTypeOptions = [
    { value: 'warning', label: 'Warning' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'dismissal', label: 'Dismissal' }
  ];

  // Fetch action types from API
  const fetchActionTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await getAllDisciplinaryActionTypes();
      if (response?.data?.results) {
        setActionTypes(response.data.results);
      } else if (Array.isArray(response?.data)) {
        setActionTypes(response.data);
      } else if (response?.data) {
        setActionTypes([response.data]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch action types');
      console.error('Error fetching action types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchActionTypes();
  }, []);

  const showNotification = (message: string) => {
    // TODO: Implement proper notification system
    alert(message);
  };

  // Handler functions for list view operations
  const handleEdit = (actionType: DisciplinaryActionType) => {
    setFormData({
      title: actionType.title,
      action_type: actionType.action_type,
      block_option: actionType.block_option
    });
    setIsEditing(actionType);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this disciplinary action type?')) {
      try {
        setLoading(true);
        await deleteDisciplinaryActionType(id);
        await fetchActionTypes(); // Refresh the list
        showNotification('Action type deleted successfully');
      } catch (err: any) {
        setError(err.message || 'Failed to delete action type');
        console.error('Error deleting action type:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateNew = () => {
    setFormData({
      title: '',
      action_type: '' as 'warning' | 'suspension' | 'dismissal' | '',
      block_option: false
    });
    setIsEditing(null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      action_type: '' as 'warning' | 'suspension' | 'dismissal' | '',
      block_option: false
    });
    setIsEditing(null);
    setShowCreateForm(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.action_type) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        // Update existing action type
        await updateDisciplinaryActionType(isEditing.id, formData);
        showNotification('Action type updated successfully');
      } else {
        // Create new action type
        await createDisciplinaryActionType(formData);
        showNotification('Action type created successfully');
      }
      
      await fetchActionTypes(); // Refresh the list
      handleCancel();
    } catch (err: any) {
      setError(err.message || 'Failed to save action type');
      console.error('Error saving action type:', err);
    } finally {
      setLoading(false);
    }
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Disciplinary Action Type' : 'Create Disciplinary Action Type'}</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        
        <div className="modal-body">
          <form id="disciplinary-action-type-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title <span className="required">*</span>:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="action_type">Action Type <span className="required">*</span>:</label>
              <select
                id="action_type"
                name="action_type"
                value={formData.action_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Action Type</option>
                {actionTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="block_option"
                  checked={formData.block_option}
                  onChange={handleInputChange}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title">Enable login block</span>
                  <div className="checkbox-description">
                    If enabled, employees log in will be blocked based on period of suspension or dismissal.
                  </div>
                </div>
              </label>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <div className="footer-description">
            {isEditing ? 'Update disciplinary action type information' : 'Create new disciplinary action type'}
          </div>
          <div className="footer-buttons">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCancel}
              disabled={loading}
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: 'white',
                marginRight: '12px',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="disciplinary-action-type-form" 
              className="btn btn-primary"
              disabled={loading}
              style={{
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Saving...' : (isEditing ? '✓ UPDATE' : '+ CREATE')}
            </button>
          </div>
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
          <h2>Action Type</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="table-header">
            <h3>Action Types</h3>
            <button 
              className="btn btn-primary"
              onClick={handleCreateNew}
              disabled={loading}
              style={{
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white',
                opacity: loading ? 0.6 : 1
              }}
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
          
          {!loading && !error && actionTypes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ion-icon name="warning-outline"></ion-icon>
              </div>
              <p>There are no action types at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Action Type</th>
                    <th>Block Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actionTypes.map(actionType => (
                    <tr key={actionType.id}>
                      <td>{actionType.title}</td>
                      <td style={{ textTransform: 'capitalize' }}>{actionType.action_type}</td>
                      <td>{actionType.block_option ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(actionType)}
                            title="Edit"
                            disabled={loading}
                            style={{
                              backgroundColor: '#6c757d',
                              borderColor: '#6c757d',
                              color: 'white',
                              marginRight: '8px',
                              opacity: loading ? 0.6 : 1
                            }}
                          >
                            <ion-icon name="create-outline"></ion-icon>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(actionType.id)}
                            title="Delete"
                            disabled={loading}
                            style={{
                              backgroundColor: '#dc3545',
                              borderColor: '#dc3545',
                              color: 'white',
                              opacity: loading ? 0.6 : 1
                            }}
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

export default DisciplinaryActionTypeModal;