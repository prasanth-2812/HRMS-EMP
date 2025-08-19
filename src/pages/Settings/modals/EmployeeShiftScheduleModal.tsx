import React, { useState, useEffect } from 'react';
import {
  getEmployeeShiftSchedules,
  createEmployeeShiftSchedule,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule,
  EmployeeShiftSchedule as ApiEmployeeShiftSchedule
} from '../../../services/baseService';
import { getAllShifts, Shift } from '../../../services/shiftService';

interface EmployeeShiftScheduleData {
  id?: number;
  day: string;
  shift_id: number;
  shift_name?: string;
  start_time: string;
  end_time: string;
  minimum_working_hour: number;
  company?: string;
}

interface EmployeeShiftScheduleModalProps {
  onClose: () => void;
}

const EmployeeShiftScheduleModal: React.FC<EmployeeShiftScheduleModalProps> = ({ onClose }) => {
  const [shiftSchedules, setShiftSchedules] = useState<EmployeeShiftScheduleData[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    shift_id: 0,
    start_time: '',
    end_time: '',
    minimum_working_hour: 8,
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

  // Fetch data on component mount
  useEffect(() => {
    fetchShiftSchedules();
    fetchShifts();
  }, []);

  const fetchShiftSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployeeShiftSchedules();
      const schedulesWithShiftNames = response.results.map(schedule => ({
        ...schedule,
        shift_name: getShiftName(schedule.shift_id)
      }));
      setShiftSchedules(schedulesWithShiftNames);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shift schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await getAllShifts();
      setShifts(response);
    } catch (err: any) {
      console.error('Failed to fetch shifts:', err);
    }
  };

  const getShiftName = (shiftId: number): string => {
    const shift = shifts.find(s => s.id === shiftId);
    return shift ? shift.shift : 'Unknown Shift';
  };

  const handleEdit = (schedule: EmployeeShiftScheduleData) => {
    setFormData({
      day: schedule.day,
      shift_id: schedule.shift_id,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      minimum_working_hour: schedule.minimum_working_hour,
      company: schedule.company || 'Prasanth Technologies'
    });
    setIsEditing(schedule.id!);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this shift schedule?')) {
      try {
        setLoading(true);
        await deleteEmployeeShiftSchedule(id);
        await fetchShiftSchedules();
        showNotification('Shift schedule deleted successfully!');
      } catch (err: any) {
        setError(err.message || 'Failed to delete shift schedule');
      } finally {
        setLoading(false);
      }
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
      shift_id: 0,
      start_time: '',
      end_time: '',
      minimum_working_hour: 8,
      company: 'Prasanth Technologies'
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      day: '',
      shift_id: 0,
      start_time: '',
      end_time: '',
      minimum_working_hour: 8,
      company: 'Prasanth Technologies'
    });
    setShowCreateForm(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'shift_id' || name === 'minimum_working_hour') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.day || !formData.shift_id || !formData.start_time || !formData.end_time) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        // Update existing schedule
        await updateEmployeeShiftSchedule(isEditing, {
          day: formData.day,
          shift_id: formData.shift_id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          minimum_working_hour: formData.minimum_working_hour
        });
        showNotification('Shift schedule updated successfully!');
      } else {
        // Create new schedule
        await createEmployeeShiftSchedule({
          day: formData.day,
          shift_id: formData.shift_id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          minimum_working_hour: formData.minimum_working_hour
        });
        showNotification('Shift schedule created successfully!');
      }
      
      await fetchShiftSchedules();
      handleCancel();
    } catch (err: any) {
      setError(err.message || 'Failed to save shift schedule');
    } finally {
      setLoading(false);
    }
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
              <label htmlFor="shift_id" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Shift <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="shift_id"
                name="shift_id"
                value={formData.shift_id}
                onChange={handleInputChange}
                required
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: loading ? '#f9fafb' : '#ffffff',
                  outline: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <option value={0}>---Choose Shift---</option>
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.shift}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="minimum_working_hour" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Minimum Working Hours <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                id="minimum_working_hour"
                name="minimum_working_hour"
                value={formData.minimum_working_hour}
                onChange={handleInputChange}
                placeholder="8"
                min="1"
                max="24"
                required
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  backgroundColor: loading ? '#f9fafb' : '#ffffff',
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
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      padding: '12px 40px 12px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      backgroundColor: loading ? '#f9fafb' : '#ffffff',
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
                <label htmlFor="end_time" style={{ 
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
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      padding: '12px 40px 12px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      backgroundColor: loading ? '#f9fafb' : '#ffffff',
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

            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '6px', 
                color: '#dc2626',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

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
            disabled={loading}
            style={{ 
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: loading ? '#f9fafb' : '#ffffff',
              color: loading ? '#9ca3af' : '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="shift-schedule-form" 
            className="btn btn-primary" 
            disabled={loading || !formData.day || !formData.shift_id || !formData.start_time || !formData.end_time}
            style={{ 
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: (loading || !formData.day || !formData.shift_id || !formData.start_time || !formData.end_time) ? '#9ca3af' : '#dc2626',
              border: `1px solid ${(loading || !formData.day || !formData.shift_id || !formData.start_time || !formData.end_time) ? '#9ca3af' : '#dc2626'}`,
              borderRadius: '6px',
              color: '#ffffff',
              cursor: (loading || !formData.day || !formData.shift_id || !formData.start_time || !formData.end_time) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Saving...' : 'Save'}
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
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
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
                      <td style={{ padding: '12px' }}>{schedule.shift_name || getShiftName(schedule.shift_id)}</td>
                      <td style={{ padding: '12px' }}>{schedule.minimum_working_hour}h</td>
                      <td style={{ padding: '12px' }}>{schedule.start_time} - {schedule.end_time}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(schedule)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              color: loading ? '#9ca3af' : '#64748b',
                              padding: '4px'
                            }}
                            title="Edit"
                            disabled={loading}
                          >
                            <ion-icon name="create-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id!)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              color: loading ? '#9ca3af' : '#ef4444',
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