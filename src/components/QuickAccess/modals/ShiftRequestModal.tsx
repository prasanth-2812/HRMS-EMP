import React, { useState } from 'react';

interface ShiftRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

interface ShiftOption {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

const mockShifts: ShiftOption[] = [
  { id: '1', name: 'Morning Shift', startTime: '09:00', endTime: '17:00' },
  { id: '2', name: 'Evening Shift', startTime: '14:00', endTime: '22:00' },
  { id: '3', name: 'Night Shift', startTime: '22:00', endTime: '06:00' },
  { id: '4', name: 'Early Morning', startTime: '06:00', endTime: '14:00' },
  { id: '5', name: 'Split Shift A', startTime: '10:00', endTime: '18:00' },
  { id: '6', name: 'Split Shift B', startTime: '12:00', endTime: '20:00' }
];

const ShiftRequestModal: React.FC<ShiftRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fromShift: '',
    toShift: '',
    shiftDate: '',
    reason: '',
    priority: 'medium',
    justification: '',
    coverageArrangement: '',
    isRecurring: false,
    recurringEndDate: '',
    recurringDays: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRecurringDaysChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromShift) {
      newErrors.fromShift = 'Current shift is required';
    }
    if (!formData.toShift) {
      newErrors.toShift = 'Requested shift is required';
    }
    if (formData.fromShift === formData.toShift) {
      newErrors.toShift = 'Requested shift must be different from current shift';
    }
    if (!formData.shiftDate) {
      newErrors.shiftDate = 'Shift date is required';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (formData.isRecurring && !formData.recurringEndDate) {
      newErrors.recurringEndDate = 'End date is required for recurring requests';
    }
    if (formData.isRecurring && formData.recurringDays.length === 0) {
      newErrors.recurringDays = 'Please select at least one day for recurring requests';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        // Reset form
        setFormData({
          fromShift: '',
          toShift: '',
          shiftDate: '',
          reason: '',
          priority: 'medium',
          justification: '',
          coverageArrangement: '',
          isRecurring: false,
          recurringEndDate: '',
          recurringDays: []
        });
        
        // Close modal
        onClose();
        
        // Show success notification
        if (onSuccess) {
          onSuccess('Shift request submitted successfully!');
        }
      }, 500);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getShiftById = (id: string) => {
    return mockShifts.find(shift => shift.id === id);
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (!isOpen) return null;

  return (
    <div className="oh-modal-overlay" onClick={handleBackdropClick}>
      <div className="oh-create-shift-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title">Create Shift Request</h2>
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
            {/* Current Shift */}
            <div className="oh-form-group">
              <label htmlFor="fromShift" className="oh-form-label">
                Current Shift *
              </label>
              <select
                id="fromShift"
                name="fromShift"
                value={formData.fromShift}
                onChange={handleInputChange}
                className={`oh-form-input ${errors.fromShift ? 'oh-form-input--error' : ''}`}
              >
                <option value="">Select current shift</option>
                {mockShifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})
                  </option>
                ))}
              </select>
              {errors.fromShift && <span className="oh-form-error">{errors.fromShift}</span>}
            </div>

            {/* Requested Shift */}
            <div className="oh-form-group">
              <label htmlFor="toShift" className="oh-form-label">
                Requested Shift *
              </label>
              <select
                id="toShift"
                name="toShift"
                value={formData.toShift}
                onChange={handleInputChange}
                className={`oh-form-input ${errors.toShift ? 'oh-form-input--error' : ''}`}
              >
                <option value="">Select requested shift</option>
                {mockShifts.filter(shift => shift.id !== formData.fromShift).map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})
                  </option>
                ))}
              </select>
              {errors.toShift && <span className="oh-form-error">{errors.toShift}</span>}
            </div>

          {/* Shift Change Preview */}
          {formData.fromShift && formData.toShift && (
            <div className="oh-shift-preview">
              <h4 className="oh-shift-preview__title">Shift Change Preview</h4>
              <div className="oh-shift-preview__content">
                <div className="oh-shift-preview__from">
                  <span className="oh-shift-preview__label">From:</span>
                  <div className="oh-shift-preview__details">
                    <span className="oh-shift-preview__name">{getShiftById(formData.fromShift)?.name}</span>
                    <span className="oh-shift-preview__time">
                      {getShiftById(formData.fromShift) && 
                        `${formatTime(getShiftById(formData.fromShift)!.startTime)} - ${formatTime(getShiftById(formData.fromShift)!.endTime)}`
                      }
                    </span>
                  </div>
                </div>
                <div className="oh-shift-preview__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                  </svg>
                </div>
                <div className="oh-shift-preview__to">
                  <span className="oh-shift-preview__label">To:</span>
                  <div className="oh-shift-preview__details">
                    <span className="oh-shift-preview__name">{getShiftById(formData.toShift)?.name}</span>
                    <span className="oh-shift-preview__time">
                      {getShiftById(formData.toShift) && 
                        `${formatTime(getShiftById(formData.toShift)!.startTime)} - ${formatTime(getShiftById(formData.toShift)!.endTime)}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shift Date */}
          <div className="oh-form-group">
            <label htmlFor="shiftDate" className="oh-form-label">
              Shift Date *
            </label>
            <input
              type="date"
              id="shiftDate"
              name="shiftDate"
              value={formData.shiftDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`oh-form-input ${errors.shiftDate ? 'oh-form-input--error' : ''}`}
            />
            {errors.shiftDate && <span className="oh-form-error">{errors.shiftDate}</span>}
          </div>

          {/* Priority */}
          <div className="oh-form-group">
            <label htmlFor="priority" className="oh-form-label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
                onChange={handleInputChange}
                className="oh-form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

          {/* Recurring Request */}
          <div className="oh-form-group">
            <label className="oh-checkbox-label">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="oh-checkbox"
              />
              <span className="oh-checkbox-text">This is a recurring request</span>
            </label>
          </div>

          {/* Recurring Options */}
          {formData.isRecurring && (
            <div className="oh-form-section">
              <h4 className="oh-form-section-title">Recurring Details</h4>
              
              <div className="oh-form-group">
                <label htmlFor="recurringEndDate" className="oh-form-label">
                  End Date *
                </label>
                <input
                  type="date"
                  id="recurringEndDate"
                  name="recurringEndDate"
                  value={formData.recurringEndDate}
                  onChange={handleInputChange}
                  min={formData.shiftDate || new Date().toISOString().split('T')[0]}
                  className={`oh-form-input ${errors.recurringEndDate ? 'oh-form-input--error' : ''}`}
                />
                {errors.recurringEndDate && <span className="oh-form-error">{errors.recurringEndDate}</span>}
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">
                  Days of Week *
                </label>
                <div className="oh-checkbox-group">
                  {weekDays.map(day => (
                    <label key={day} className="oh-checkbox-label oh-checkbox-label--inline">
                      <input
                        type="checkbox"
                        checked={formData.recurringDays.includes(day)}
                        onChange={() => handleRecurringDaysChange(day)}
                        className="oh-checkbox"
                      />
                      <span className="oh-checkbox-text">{day}</span>
                    </label>
                  ))}
                </div>
                {errors.recurringDays && <span className="oh-form-error">{errors.recurringDays}</span>}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="oh-form-group">
            <label htmlFor="reason" className="oh-form-label">
              Reason for Shift Change *
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please provide a detailed reason for the shift change request..."
              rows={3}
              className={`oh-form-textarea ${errors.reason ? 'oh-form-textarea--error' : ''}`}
            />
            {errors.reason && <span className="oh-form-error">{errors.reason}</span>}
          </div>

          {/* Additional Fields */}
          <div className="oh-form-grid oh-form-grid--1">
            <div className="oh-form-group">
              <label htmlFor="justification" className="oh-form-label">
                Business Justification
              </label>
              <textarea
                id="justification"
                name="justification"
                value={formData.justification}
                onChange={handleInputChange}
                placeholder="How does this change benefit the team or organization?"
                rows={2}
                className="oh-form-textarea"
              />
            </div>

            <div className="oh-form-group">
              <label htmlFor="coverageArrangement" className="oh-form-label">
                Coverage Arrangement
              </label>
              <textarea
                id="coverageArrangement"
                name="coverageArrangement"
                value={formData.coverageArrangement}
                onChange={handleInputChange}
                placeholder="How will your current shift be covered? Any arrangements made?"
                rows={2}
                className="oh-form-input"
              />
            </div>
          </div>
          </form>
        </div>

        <div className="oh-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="oh-btn oh-btn--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="oh-btn oh-btn--primary"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftRequestModal;
