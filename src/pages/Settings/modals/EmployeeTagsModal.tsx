import React, { useState, useEffect } from 'react';
import { getAllEmployeeTags, createEmployeeTag, updateEmployeeTag, deleteEmployeeTag } from '../../../services/employeeService';

interface EmployeeTag {
  id: number;
  title: string;
  color: string;
  created_at?: string;
  is_active?: boolean;
}

interface EmployeeTagsModalProps {
  onClose: () => void;
  editingItem?: EmployeeTag | null;
}

const EmployeeTagsModal: React.FC<EmployeeTagsModalProps> = ({ onClose, editingItem }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    color: '#3b82f6'
  });
  const [employeeTags, setEmployeeTags] = useState<EmployeeTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<EmployeeTag | null>(null);

  // Predefined color options
  const colorOptions = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6b7280', // Gray
    '#14b8a6', // Teal
    '#a855f7', // Violet
    '#22c55e', // Green-500
    '#eab308', // Yellow-500
    '#dc2626', // Red-600
    '#7c3aed', // Violet-600
    '#0891b2', // Cyan-600
    '#65a30d', // Lime-600
    '#ea580c', // Orange-600
    '#be185d'  // Pink-700
  ];

  const fetchEmployeeTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await getAllEmployeeTags();
      if (response.data) {
        setEmployeeTags(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee tags');
      console.error('Error fetching employee tags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTags();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        color: editingItem.color
      });
      setIsEditing(editingItem);
      setShowCreateForm(true);
    }
  }, [editingItem]);

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setFormData({ title: '', color: '#3b82f6' });
    setIsEditing(null);
  };

  const handleBackToList = () => {
    setShowCreateForm(false);
    setFormData({ title: '', color: '#3b82f6' });
    setIsEditing(null);
  };

  const handleEdit = (tag: EmployeeTag) => {
    setFormData({
      title: tag.title,
      color: tag.color
    });
    setIsEditing(tag);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee tag?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteEmployeeTag(id);
      await fetchEmployeeTags(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee tag');
      console.error('Error deleting employee tag:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await updateEmployeeTag(isEditing.id, formData);
      } else {
        await createEmployeeTag(formData);
      }
      
      await fetchEmployeeTags(); // Refresh the list
      setShowCreateForm(false);
      setFormData({ title: '', color: '#3b82f6' });
      setIsEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save employee tag');
      console.error('Error saving employee tag:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (showCreateForm) {
      setShowCreateForm(false);
      setFormData({ title: '', color: '#3b82f6' });
      setIsEditing(null);
    } else {
      onClose();
    }
  };

  // Render list view
  if (!showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
          <div className="modal-header">
            <h2>Employee Tags</h2>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            
            <div className="table-header">
              <h3>Manage Employee Tags</h3>
              <button 
                className="btn btn-primary"
                onClick={handleCreateClick}
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
            
            <div className="table-container">
              {loading && employeeTags.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  Loading employee tags...
                </div>
              ) : (
                <>
                  <div className="table-header-row">
                    <div>Title</div>
                    <div>Color</div>
                    <div>Actions</div>
                  </div>
                  
                  {employeeTags.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No employee tags found. Create your first tag!
                    </div>
                  ) : (
                    employeeTags.map((tag) => (
                      <div key={tag.id} className="table-row">
                        <div>{tag.title}</div>
                        <div>
                          <div className="color-indicator" style={{ backgroundColor: tag.color }}></div>
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-primary" 
                            onClick={() => handleEdit(tag)}
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
                            onClick={() => handleDelete(tag.id)}
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
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn btn-secondary"
              onClick={onClose}
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: 'white'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render create/edit form
  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleBackToList}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
            <h2>{editingItem ? 'Edit Employee Tag' : 'Create Employee Tag'}</h2>
          </div>
          <button className="modal-close" onClick={handleCancel}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form id="employee-tag-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title <span style={{ color: '#ef4444' }}>*</span>:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter tag title"
                disabled={loading}
                required
                style={{
                  opacity: loading ? 0.6 : 1
                }}
              />
            </div>

            <div className="form-group">
              <label>Color <span style={{ color: '#ef4444' }}>*</span>:</label>
              
              {/* Color Input */}
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: 'transparent',
                    opacity: loading ? 0.6 : 1
                  }}
                />
                <span style={{ 
                  marginLeft: '12px', 
                  fontFamily: 'monospace', 
                  fontSize: '14px', 
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {formData.color.toUpperCase()}
                </span>
              </div>

              {/* Color Palette */}
              <div style={{ marginTop: '12px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  marginBottom: '8px', 
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Quick Color Selection:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: '8px',
                  maxWidth: '400px'
                }}>
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      disabled={loading}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid #1f2937' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: formData.color === color 
                          ? '0 4px 12px rgba(0,0,0,0.3)' 
                          : '0 2px 4px rgba(0,0,0,0.1)',
                        transform: formData.color === color ? 'scale(1.1)' : 'scale(1)',
                        opacity: loading ? 0.6 : 1
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div style={{ marginTop: '20px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  marginBottom: '8px', 
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Preview:
                </label>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: formData.color,
                  color: '#ffffff',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  <ion-icon name="pricetag-outline"></ion-icon>
                  {formData.title || 'Tag Title'}
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
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
            form="employee-tag-form" 
            className="btn btn-primary"
            disabled={loading}
            style={{
              backgroundColor: '#dc3545',
              borderColor: '#dc3545',
              color: 'white',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTagsModal;