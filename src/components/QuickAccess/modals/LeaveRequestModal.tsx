import React, { useState } from 'react';
import '../QuickAccess.css';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    startDateBreakdown: '',
    endDateBreakdown: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.leaveTypeId || !formData.employeeId || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate date range
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Start date cannot be after end date');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        leaveTypeId: '',
        employeeId: '',
        startDate: '',
        endDate: '',
        startDateBreakdown: '',
        endDateBreakdown: '',
        description: ''
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Leave request submitted successfully!');
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-leave-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title">Leave Request</h2>
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
                <label className="oh-form-label">Leave Type <span className="oh-required">*</span></label>
                <select
                  id="leaveTypeId"
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="">Select Leave Type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Employee <span className="oh-required">*</span></label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="">Select Employee</option>
                  <option value="current">Current User</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Start Date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">End Date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Start Date Breakdown</label>
                <select
                  id="startDateBreakdown"
                  name="startDateBreakdown"
                  value={formData.startDateBreakdown}
                  onChange={handleChange}
                  className="oh-form-input"
                >
                  <option value="">Select breakdown</option>
                  <option value="full_day">Full Day</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">End Date Breakdown</label>
                <select
                  id="endDateBreakdown"
                  name="endDateBreakdown"
                  value={formData.endDateBreakdown}
                  onChange={handleChange}
                  className="oh-form-input"
                >
                  <option value="">Select breakdown</option>
                  <option value="full_day">Full Day</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
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
                  placeholder="Enter leave description..."
                />
              </div>
            </div>

            <div className="oh-modal-footer">
              <button type="button" className="oh-btn oh-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="oh-btn oh-btn--primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
