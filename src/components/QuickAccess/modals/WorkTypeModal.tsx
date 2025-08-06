import React, { useState } from 'react';
import '../QuickAccess.css';

interface WorkTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const WorkTypeModal: React.FC<WorkTypeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    workTypeName: '',
    description: '',
    isActive: true,
    workingHours: '',
    breakTime: '',
    overtimeRate: '',
    category: 'full-time'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.workTypeName.trim()) {
      if (onSuccess) {
        onSuccess('Please enter a work type name');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        workTypeName: '',
        description: '',
        isActive: true,
        workingHours: '',
        breakTime: '',
        overtimeRate: '',
        category: 'full-time'
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Work type created successfully!');
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-worktype-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title">Create Work Type</h2>
          <button 
            className="oh-modal-close" 
            aria-label="Close"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="oh-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="oh-form-grid">
              <div className="oh-form-group">
                <label className="oh-form-label">Work Type Name <span className="oh-required">*</span></label>
                <input
                  type="text"
                  id="workTypeName"
                  name="workTypeName"
                  value={formData.workTypeName}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                  placeholder="Enter work type name"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Category <span className="oh-required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="intern">Intern</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Working Hours per Day</label>
                <input
                  type="number"
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="8"
                  step="0.5"
                  min="0"
                  max="24"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Break Time (minutes)</label>
                <input
                  type="number"
                  id="breakTime"
                  name="breakTime"
                  value={formData.breakTime}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="60"
                  min="0"
                  max="480"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Overtime Rate Multiplier</label>
                <input
                  type="number"
                  id="overtimeRate"
                  name="overtimeRate"
                  value={formData.overtimeRate}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="1.5"
                  step="0.1"
                  min="1"
                  max="5"
                />
              </div>

              <div className="oh-form-group oh-form-group--full-width">
                <label className="oh-form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="oh-form-textarea"
                  placeholder="Enter work type description..."
                />
              </div>

              <div className="oh-form-group oh-form-group--full-width">
                <label className="oh-checkbox-label">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="oh-checkbox"
                  />
                  <span className="oh-checkbox-text">Active (employees can be assigned to this work type)</span>
                </label>
              </div>
            </div>

            <div className="oh-modal-footer">
              <button type="button" className="oh-btn oh-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="oh-btn oh-btn--primary">
                Create Work Type
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkTypeModal;
