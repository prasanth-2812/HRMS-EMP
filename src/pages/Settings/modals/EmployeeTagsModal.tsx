import React, { useState, useEffect } from 'react';

interface EmployeeTagData {
  id: number;
  title: string;
  color: string;
}

interface EmployeeTagsModalProps {
  onClose: () => void;
  editingItem?: EmployeeTagData | null;
}

const EmployeeTagsModal: React.FC<EmployeeTagsModalProps> = ({ onClose, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    color: '#3b82f6'
  });

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

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        color: editingItem.color
      });
    }
  }, [editingItem]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Employee Tag form data:', formData);
    // TODO: Implement save functionality
    onClose();
  };

  const handleCancel = () => {
    setFormData({ title: '', color: '#3b82f6' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Employee Tag' : 'Create Employee Tag'}</h2>
          <button className="modal-close" onClick={onClose}>
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
                required
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
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent'
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
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid #1f2937' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: formData.color === color 
                          ? '0 4px 12px rgba(0,0,0,0.3)' 
                          : '0 2px 4px rgba(0,0,0,0.1)',
                        transform: formData.color === color ? 'scale(1.1)' : 'scale(1)'
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
        
        <div className="modal-footer" style={{ 
          padding: '24px', 
          borderTop: '2px solid #e2e8f0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '16px', 
          backgroundColor: '#f8fafc', 
          flexShrink: 0, 
          boxShadow: '0 -6px 20px rgba(0,0,0,0.1)',
          borderRadius: '0 0 12px 12px',
          minHeight: '120px',
          position: 'sticky',
          bottom: 0,
          zIndex: 100
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
            {editingItem ? 'Update employee tag information' : 'Create new employee tag'}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCancel}
              style={{ 
                minWidth: '120px', 
                height: '48px',
                fontSize: '15px',
                fontWeight: '600',
                border: '2px solid #6b7280',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="employee-tag-form" 
              className="btn btn-primary" 
              style={{ 
                minWidth: '140px', 
                height: '48px',
                fontSize: '15px',
                fontWeight: '700',
                backgroundColor: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              {editingItem ? '✓ UPDATE' : '+ CREATE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTagsModal;