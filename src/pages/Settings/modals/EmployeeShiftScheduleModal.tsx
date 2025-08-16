import React, { useState, useEffect } from 'react';

interface EmployeeShiftScheduleData {
  id: number;
  shift: string;
  day: string;
  minimumWorkingHours: string;
  startTime: string;
  endTime: string;
  autoCheckOut: boolean;
  company?: string;
}

interface EmployeeShiftScheduleModalProps {
  onClose: () => void;
}

const EmployeeShiftScheduleModal: React.FC<EmployeeShiftScheduleModalProps> = ({ onClose }) => {
  const [shiftSchedules, setShiftSchedules] = useState<EmployeeShiftScheduleData[]>([
    {
      id: 1,
      shift: 'Morning',
      day: 'Monday',
      minimumWorkingHours: '8',
      startTime: '09:00',
      endTime: '17:00',
      autoCheckOut: false,
      company: 'Prasanth Technologies'
    },
    {
      id: 2,
      shift: 'Evening',
      day: 'Tuesday',
      minimumWorkingHours: '8',
      startTime: '14:00',
      endTime: '22:00',
      autoCheckOut: true,
      company: 'Prasanth Technologies'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    shift: '',
    minimumWorkingHours: '',
    startTime: '',
    endTime: '',
    autoCheckOut: false,
    company: 'Prasanth Technologies'
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

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
    'Morning',
    'Afternoon', 
    'Evening',
    'Night'
  ];



  useEffect(() => {
    // Component initialization - no need to fetch data as we're using dummy data
  }, []);

  const handleEdit = (schedule: EmployeeShiftScheduleData) => {
    setFormData({
      day: schedule.day,
      shift: schedule.shift,
      minimumWorkingHours: schedule.minimumWorkingHours,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      autoCheckOut: schedule.autoCheckOut,
      company: schedule.company || 'Prasanth Technologies'
    });
    setIsEditing(schedule.id);
    setShowCreateForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this shift schedule?')) {
      setShiftSchedules(prev => prev.filter(schedule => schedule.id !== id));
      showNotification('Shift schedule deleted successfully!');
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - you can replace with your toast system
    alert(message);
  };

  const handleCreateNew = () => {
    setIsEditing(null);
    setFormData({
      day: '',
      shift: '',
      minimumWorkingHours: '',
      startTime: '',
      endTime: '',
      autoCheckOut: false,
      company: 'Prasanth Technologies'
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      day: '',
      shift: '',
      minimumWorkingHours: '',
      startTime: '',
      endTime: '',
      autoCheckOut: false,
      company: 'Prasanth Technologies'
    });
    setShowCreateForm(false);
    setError(null);
  };

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



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing schedule
      setShiftSchedules(prev => prev.map(schedule => 
        schedule.id === isEditing 
          ? { ...formData, id: isEditing, autoCheckOut: formData.autoCheckOut }
          : schedule
      ));
      showNotification('Shift schedule updated successfully!');
    } else {
      // Create new schedule
      const newSchedule: EmployeeShiftScheduleData = {
        ...formData,
        id: Math.max(...shiftSchedules.map(s => s.id), 0) + 1,
        autoCheckOut: formData.autoCheckOut
      };
      setShiftSchedules(prev => [...prev, newSchedule]);
      showNotification('Shift schedule created successfully!');
    }
    
    handleCancel();
  };

  if (showCreateForm) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header" style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid #e5e7eb', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827' 
            }}>
              {isEditing ? 'Edit Employee Shift Schedule' : 'Create Employee Shift Schedule'}
            </h2>
            <button 
              className="modal-close" 
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '20px', 
                cursor: 'pointer', 
                color: '#6b7280',
                padding: '4px'
              }}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        
        <div className="modal-body" style={{ padding: '24px' }}>
          <form id="shift-schedule-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="day" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Day <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value=""></option>
                {weekDays.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="shift" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Shift <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="shift"
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="">---Choose Shift---</option>
                {shiftOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="minimumWorkingHours" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Minimum Working Hours <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                id="minimumWorkingHours"
                name="minimumWorkingHours"
                value={formData.minimumWorkingHours}
                onChange={handleInputChange}
                placeholder="08:15"
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group">
                <label htmlFor="startTime" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Start Time <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px 40px 12px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <ion-icon 
                    name="time-outline" 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6b7280', 
                      fontSize: '16px' 
                    }}
                  ></ion-icon>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="endTime" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  End Time <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px 40px 12px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <ion-icon 
                    name="time-outline" 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6b7280', 
                      fontSize: '16px' 
                    }}
                  ></ion-icon>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="autoCheckOut"
                  name="autoCheckOut"
                  checked={formData.autoCheckOut}
                  onChange={handleInputChange}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="autoCheckOut" style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  Enable Automatic Check Out
                </label>
                <ion-icon name="information-circle-outline" style={{ color: '#6b7280', fontSize: '16px' }}></ion-icon>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="company" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Company
              </label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Prasanth Technologies">Prasanth Technologies</option>
              </select>
            </div>
          </form>
        </div>
        
        <div className="modal-footer" style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #e5e7eb', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px',
          backgroundColor: '#ffffff'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCancel}
            style={{ 
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: 'pointer',
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
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#dc2626',
              border: '1px solid #dc2626',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
    );
  }

  // List view
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Employee Shift Schedule</h2>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Shift Schedules</h3>
            <button 
              onClick={handleCreateNew}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Create
            </button>
          </div>
          
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              Loading...
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '6px', 
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              Error: {error}
            </div>
          )}
          
          {!loading && !error && shiftSchedules.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: '#64748b'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px'
              }}>
                <ion-icon name="time-outline" style={{ fontSize: '32px', color: '#94a3b8' }}></ion-icon>
              </div>
              <p>There are no shift schedules at this moment.</p>
            </div>
          ) : !loading && !error && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Day</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Shift</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Hours</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftSchedules.map(schedule => (
                    <tr key={schedule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{schedule.day}</td>
                      <td style={{ padding: '12px' }}>{schedule.shift}</td>
                      <td style={{ padding: '12px' }}>{schedule.minimumWorkingHours}h</td>
                      <td style={{ padding: '12px' }}>{schedule.startTime} - {schedule.endTime}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(schedule)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748b',
                              padding: '4px'
                            }}
                            title="Edit"
                            disabled={loading}
                          >
                            <ion-icon name="create-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                              padding: '4px'
                            }}
                            title="Delete"
                            disabled={loading}
                          >
                            <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeShiftScheduleModal;