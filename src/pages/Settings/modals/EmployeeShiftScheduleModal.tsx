import React, { useState, useEffect } from 'react';

interface EmployeeShiftScheduleData {
  id: number;
  shift: string;
  days: string[];
  minimumWorkingHours: string;
  startTime: string;
  endTime: string;
  autoCheckOut: boolean;
  company?: string;
}

interface EmployeeShiftScheduleModalProps {
  onClose: () => void;
  editingItem?: EmployeeShiftScheduleData | null;
}

const EmployeeShiftScheduleModal: React.FC<EmployeeShiftScheduleModalProps> = ({ onClose, editingItem }) => {
  const [formData, setFormData] = useState({
    days: [] as string[],
    shift: '',
    minimumWorkingHours: '',
    startTime: '',
    endTime: '',
    autoCheckOut: false,
    company: ''
  });

  // Days of the week
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Dummy shift options
  const shiftOptions = [
    'Morning Shift',
    'Afternoon Shift',
    'Evening Shift',
    'Night Shift',
    'Day Shift',
    'Flexible Shift',
    'Weekend Shift'
  ];

  // Dummy company options
  const companyOptions = [
    'Tech Corp',
    'Innovation Ltd',
    'StartUp Inc',
    'Global Solutions',
    'Digital Dynamics'
  ];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        days: editingItem.days,
        shift: editingItem.shift,
        minimumWorkingHours: editingItem.minimumWorkingHours,
        startTime: editingItem.startTime,
        endTime: editingItem.endTime,
        autoCheckOut: editingItem.autoCheckOut,
        company: editingItem.company || ''
      });
    }
  }, [editingItem]);

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

  const handleDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      days: checked 
        ? [...prev.days, day]
        : prev.days.filter(d => d !== day)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Employee Shift Schedule form data:', formData);
    // TODO: Implement save functionality
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      days: [],
      shift: '',
      minimumWorkingHours: '',
      startTime: '',
      endTime: '',
      autoCheckOut: false,
      company: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Employee Shift Schedule' : 'Create Employee Shift Schedule'}</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form id="shift-schedule-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Day <span style={{ color: '#ef4444' }}>*</span>:</label>
              <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginTop: '8px' }}>
                {weekDays.map(day => (
                  <label key={day} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.days.includes(day)}
                      onChange={(e) => handleDayChange(day, e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shift">Shift <span style={{ color: '#ef4444' }}>*</span>:</label>
              <select
                id="shift"
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Shift</option>
                {shiftOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="minimumWorkingHours">Minimum Working Hours <span style={{ color: '#ef4444' }}>*</span>:</label>
              <input
                type="text"
                id="minimumWorkingHours"
                name="minimumWorkingHours"
                value={formData.minimumWorkingHours}
                onChange={handleInputChange}
                placeholder="e.g., 8 hours"
                required
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="startTime">Start Time <span style={{ color: '#ef4444' }}>*</span>:</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time <span style={{ color: '#ef4444' }}>*</span>:</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span>Enable Automatic Check Out:</span>
                <div className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input
                    type="checkbox"
                    name="autoCheckOut"
                    checked={formData.autoCheckOut}
                    onChange={handleInputChange}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span 
                    className="slider" 
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: formData.autoCheckOut ? '#2563eb' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}
                  >
                    <span 
                      style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: formData.autoCheckOut ? '26px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }}
                    />
                  </span>
                </div>
              </label>
              <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                If enabled, employees will be automatically checked out at the end time.
              </small>
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
                {companyOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
            {editingItem ? 'Update shift schedule information' : 'Create new shift schedule'}
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
              form="shift-schedule-form" 
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

export default EmployeeShiftScheduleModal;