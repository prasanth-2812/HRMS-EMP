import React, { useState, useEffect } from 'react';

interface DisciplinaryActionTypeData {
  id: number;
  title: string;
  type: string;
  loginBlock: boolean;
  company?: string;
}

interface DisciplinaryActionTypeModalProps {
  onClose: () => void;
}

const DisciplinaryActionTypeModal: React.FC<DisciplinaryActionTypeModalProps> = ({ onClose }) => {
  // State for list view and form management
  const [actionTypes, setActionTypes] = useState<DisciplinaryActionTypeData[]>([
    { id: 1, title: 'Warning', type: 'Warning', loginBlock: false, company: 'Tech Corp' },
    { id: 2, title: 'sdsds', type: 'Warning', loginBlock: false, company: 'Innovation Ltd' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    loginBlock: false,
    company: ''
  });

  // Dummy disciplinary action type options
  const typeOptions = [
    'Warning',
    'Suspension',
    'Dismissal',
    'Corrective Action',
    'Performance Review',
    'Probation'
  ];

  // Dummy company options
  const companyOptions = [
    'Tech Corp',
    'Innovation Ltd',
    'StartUp Inc',
    'Global Solutions',
    'Digital Dynamics'
  ];

  // Handler functions for list view operations
  const handleEdit = (actionType: DisciplinaryActionTypeData) => {
    setFormData({
      title: actionType.title,
      type: actionType.type,
      loginBlock: actionType.loginBlock,
      company: actionType.company || ''
    });
    setEditingId(actionType.id);
    setIsEditing(true);
    setShowCreateForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this disciplinary action type?')) {
      setActionTypes(prev => prev.filter(item => item.id !== id));
      showNotification('Disciplinary action type deleted successfully!');
    }
  };

  const showNotification = (message: string) => {
    // TODO: Implement proper notification system
    alert(message);
  };

  const handleCreateNew = () => {
    setFormData({ title: '', type: '', loginBlock: false, company: '' });
    setIsEditing(false);
    setEditingId(null);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setFormData({ title: '', type: '', loginBlock: false, company: '' });
    setIsEditing(false);
    setEditingId(null);
    setShowCreateForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingId) {
      // Update existing action type
      setActionTypes(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData }
          : item
      ));
      showNotification('Disciplinary action type updated successfully!');
    } else {
      // Create new action type
      const newActionType: DisciplinaryActionTypeData = {
        id: Math.max(...actionTypes.map(item => item.id), 0) + 1,
        ...formData
      };
      setActionTypes(prev => [...prev, newActionType]);
      showNotification('Disciplinary action type created successfully!');
    }
    
    handleCancel();
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
              <label htmlFor="type">Type <span className="required">*</span>:</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {typeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company:</label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              >
                <option value="">Select Company (Optional)</option>
                {companyOptions.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="loginBlock"
                  checked={formData.loginBlock}
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
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: 'white',
                marginRight: '12px'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="disciplinary-action-type-form" 
              className="btn btn-primary"
              style={{
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white'
              }}
            >
              {isEditing ? '✓ UPDATE' : '+ CREATE'}
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
              style={{
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white'
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
                    <th>Type</th>
                    <th>Login block</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actionTypes.map(actionType => (
                    <tr key={actionType.id}>
                      <td>{actionType.title}</td>
                      <td>{actionType.type}</td>
                      <td>{actionType.loginBlock ? 'Yes' : 'No'}</td>
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
                              marginRight: '8px'
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
                              color: 'white'
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