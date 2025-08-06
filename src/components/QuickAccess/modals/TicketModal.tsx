import React, { useState } from 'react';
import '../QuickAccess.css';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    assignedTo: '',
    description: '',
    attachment: null as File | null
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      if (onSuccess) {
        onSuccess('Please enter a ticket title');
      }
      return;
    }
    
    if (!formData.category.trim()) {
      if (onSuccess) {
        onSuccess('Please select a category');
      }
      return;
    }
    
    if (!formData.description.trim()) {
      if (onSuccess) {
        onSuccess('Please provide a description');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        assignedTo: '',
        description: '',
        attachment: null
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Ticket created successfully!');
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        attachment: e.target.files[0]
      });
    }
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title" id="createTitle">
            Create Ticket
          </h2>
          <button 
            className="oh-modal-close" 
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="oh-modal-body">
          <form onSubmit={handleSubmit} className="oh-form-grid">
            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="title">Ticket Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="oh-form-input"
                placeholder="Enter ticket title"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="">Select Category</option>
                <option value="technical">Technical Support</option>
                <option value="hr">HR Related</option>
                <option value="payroll">Payroll Issue</option>
                <option value="leave">Leave Related</option>
                <option value="equipment">Equipment Request</option>
                <option value="access">Access Request</option>
                <option value="facilities">Facilities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="oh-form-row">
              <div className="oh-form-group">
                <label className="oh-form-label" htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label" htmlFor="assignedTo">Assign To</label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="oh-form-input"
                >
                  <option value="">Auto-assign</option>
                  <option value="it_support">IT Support Team</option>
                  <option value="hr_team">HR Team</option>
                  <option value="admin">Administration</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="oh-form-input"
                placeholder="Please describe your issue or request in detail..."
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="attachment">Attachment</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleFileChange}
                className="oh-form-input"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
              <small className="oh-form-help">
                Upload screenshots, documents, or any relevant files (Max 10MB)
              </small>
            </div>
          </form>
        </div>

        <div className="oh-modal-footer">
          <button type="button" className="oh-btn oh-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="oh-btn oh-btn--primary" onClick={handleSubmit}>
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
