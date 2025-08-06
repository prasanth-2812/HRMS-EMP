import React, { useState } from 'react';
import '../QuickAccess.css';

interface AttendanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const AttendanceRequestModal: React.FC<AttendanceRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    attendanceDate: '',
    shiftId: '',
    clockInTime: '',
    clockOutTime: '',
    minimumHour: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.attendanceDate.trim()) {
      if (onSuccess) {
        onSuccess('Please select an attendance date');
      }
      return;
    }
    
    if (!formData.shiftId.trim()) {
      if (onSuccess) {
        onSuccess('Please select a shift');
      }
      return;
    }
    
    if (!formData.clockInTime.trim() || !formData.clockOutTime.trim()) {
      if (onSuccess) {
        onSuccess('Please provide both clock in and clock out times');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        attendanceDate: '',
        shiftId: '',
        clockInTime: '',
        clockOutTime: '',
        minimumHour: '',
        description: ''
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Attendance request submitted successfully!');
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
      <div className="oh-create-attendance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title">Attendance Request</h2>
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
                <label className="oh-form-label">Attendance Date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="attendanceDate"
                  name="attendanceDate"
                  value={formData.attendanceDate}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Shift <span className="oh-required">*</span></label>
                <select
                  id="shiftId"
                  name="shiftId"
                  value={formData.shiftId}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="">Select Shift</option>
                  <option value="morning">Morning Shift (9:00 AM - 6:00 PM)</option>
                  <option value="evening">Evening Shift (2:00 PM - 11:00 PM)</option>
                  <option value="night">Night Shift (11:00 PM - 8:00 AM)</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Clock In Time <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="clockInTime"
                  name="clockInTime"
                  value={formData.clockInTime}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Clock Out Time <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="clockOutTime"
                  name="clockOutTime"
                  value={formData.clockOutTime}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Minimum Hours</label>
                <input
                  type="number"
                  id="minimumHour"
                  name="minimumHour"
                  value={formData.minimumHour}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  max="24"
                  className="oh-form-input"
                  placeholder="Enter minimum hours"
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
                  placeholder="Enter reason for attendance request..."
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

export default AttendanceRequestModal;
