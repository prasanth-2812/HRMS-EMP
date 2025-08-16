import React, { useState } from 'react';

interface EmployeeShiftScheduleData {
  id: number;
  shift: string;
  days: string;
}

interface EmployeeShiftModalProps {
  onClose: () => void;
}

const EmployeeShiftModal: React.FC<EmployeeShiftModalProps> = ({ onClose }) => {
  const [employeeShiftSchedules, setEmployeeShiftSchedules] = useState<EmployeeShiftScheduleData[]>([
    {
      id: 1,
      shift: 'Morning',
      days: 'Monday, Tuesday, Wednesday, Thursday, Friday'
    },
    {
      id: 2,
      shift: 'Evening',
      days: 'Saturday, Sunday'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployeeShiftSchedule, setNewEmployeeShiftSchedule] = useState({
    day: '',
    shift: '',
    minimumWorkingHours: '',
    startTime: '',
    endTime: '',
    enableAutomaticCheckOut: false,
    company: ''
  });

  // Dummy options
  const companyOptions = [
    'Prasanth Technologies',
    'Tech Corp',
    'Innovation Ltd',
    'StartUp Inc',
    'Global Solutions'
  ];

  const dayOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const shiftOptions = [
    'Morning',
    'Evening',
    'Night'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewEmployeeShiftSchedule(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = () => {
    if (newEmployeeShiftSchedule.shift.trim() && newEmployeeShiftSchedule.day.trim()) {
      const newItem: EmployeeShiftScheduleData = {
        id: Date.now(),
        shift: newEmployeeShiftSchedule.shift,
        days: newEmployeeShiftSchedule.day
      };
      setEmployeeShiftSchedules([...employeeShiftSchedules, newItem]);
      setNewEmployeeShiftSchedule({
        day: '',
        shift: '',
        minimumWorkingHours: '',
        startTime: '',
        endTime: '',
        enableAutomaticCheckOut: false,
        company: ''
      });
      setShowCreateModal(false);
    }
  };

  const handleDelete = (id: number) => {
    setEmployeeShiftSchedules(employeeShiftSchedules.filter(item => item.id !== id));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewEmployeeShiftSchedule({
      day: '',
      shift: '',
      minimumWorkingHours: '',
      startTime: '',
      endTime: '',
      enableAutomaticCheckOut: false,
      company: ''
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', width: '90%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>Employee Shift Schedule</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              + Create
            </button>
          </div>
          
          <div style={{ padding: '24px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Shift</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Days</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeShiftSchedules.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.shift}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.days}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: '16px'
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            fontSize: '16px'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#374151' }}>Create Employee Shift Schedule</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Day <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="day"
                  value={newEmployeeShiftSchedule.day}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Day---</option>
                  {dayOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Shift <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="shift"
                  value={newEmployeeShiftSchedule.shift}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Shift---</option>
                  {shiftOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Minimum Working Hours</label>
                <input
                  type="text"
                  name="minimumWorkingHours"
                  value={newEmployeeShiftSchedule.minimumWorkingHours}
                  onChange={handleInputChange}
                  placeholder="8:00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={newEmployeeShiftSchedule.startTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={newEmployeeShiftSchedule.endTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="enableAutomaticCheckOut"
                    checked={newEmployeeShiftSchedule.enableAutomaticCheckOut}
                    onChange={handleInputChange}
                    style={{
                      width: '16px',
                      height: '16px'
                    }}
                  />
                  Enable Automatic Check Out
                </label>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Company</label>
                <select
                  name="company"
                  value={newEmployeeShiftSchedule.company}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Prasanth Technologies</option>
                  {companyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCreate}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeShiftModal;