import React, { useState } from 'react';

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  isActive: boolean;
}

interface ShiftSettingsProps {
  onClose?: () => void;
}

const ShiftSettings: React.FC<ShiftSettingsProps> = ({ onClose }) => {
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '17:00', breakDuration: 60, isActive: true },
    { id: 2, name: 'Evening Shift', startTime: '14:00', endTime: '22:00', breakDuration: 60, isActive: true },
    { id: 3, name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakDuration: 60, isActive: true }
  ]);

  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: '',
    breakDuration: 60,
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewShift(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const shift: Shift = {
      id: Date.now(),
      ...newShift
    };
    setShifts(prev => [...prev, shift]);
    setNewShift({ name: '', startTime: '', endTime: '', breakDuration: 60, isActive: true });
    setShowAddForm(false);
  };

  const handleDeleteShift = (id: number) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
  };

  const toggleShiftStatus = (id: number) => {
    setShifts(prev => prev.map(shift => 
      shift.id === id ? { ...shift, isActive: !shift.isActive } : shift
    ));
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Shift Settings</h2>
        <p>Manage employee work shifts and schedules</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Shift
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Shift</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddShift} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Shift Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newShift.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={newShift.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={newShift.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="breakDuration">Break Duration (minutes)</label>
                <input
                  type="number"
                  id="breakDuration"
                  name="breakDuration"
                  value={newShift.breakDuration}
                  onChange={handleInputChange}
                  min="0"
                  max="480"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newShift.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Shift
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="shifts-list">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Shift Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Break Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.id}>
                  <td>{shift.name}</td>
                  <td>{formatTime(shift.startTime)}</td>
                  <td>{formatTime(shift.endTime)}</td>
                  <td>{shift.breakDuration} min</td>
                  <td>
                    <span className={`status ${shift.isActive ? 'active' : 'inactive'}`}>
                      {shift.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toggleShiftStatus(shift.id)}
                    >
                      {shift.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShiftSettings;