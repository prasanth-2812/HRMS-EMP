import React, { useState } from 'react';

interface DateTimeFormatModalProps {
  onClose: () => void;
}

const DateTimeFormatModal: React.FC<DateTimeFormatModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    timezone: 'UTC+00:00',
    weekStartsOn: 'Monday'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Date & Time Format Settings:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Date & Time Format</h2>
          <p>Configure date and time display formats</p>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dateFormat">Date Format</label>
              <select
                id="dateFormat"
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleInputChange}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timeFormat">Time Format</label>
              <select
                id="timeFormat"
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleInputChange}
              >
                <option value="12">12 Hour (AM/PM)</option>
                <option value="24">24 Hour</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
              >
                <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                <option value="UTC+05:30">UTC+05:30 (IST)</option>
                <option value="UTC-05:00">UTC-05:00 (EST)</option>
                <option value="UTC-08:00">UTC-08:00 (PST)</option>
                <option value="UTC+01:00">UTC+01:00 (CET)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weekStartsOn">Week Starts On</label>
              <select
                id="weekStartsOn"
                name="weekStartsOn"
                value={formData.weekStartsOn}
                onChange={handleInputChange}
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DateTimeFormatModal;