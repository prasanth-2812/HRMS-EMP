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
    employee: '',
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

  const employeeOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
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
        employee: '',
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
      employee: '',
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
          <div className="modal-header">
            <h2>Employee Shift Schedule</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
              style={{ marginRight: '10px' }}
            >
              + Create
            </button>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
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


        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Create Employee Shift Schedule</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <div className="form-group">
                  <label htmlFor="day">Day <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <select
                    id="day"
                    name="day"
                    value={newEmployeeShiftSchedule.day}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---Choose Day---</option>
                    {dayOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="shift">Shift <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <select
                    id="shift"
                    name="shift"
                    value={newEmployeeShiftSchedule.shift}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---Choose Shift---</option>
                    {shiftOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="employee">Employee <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <select
                    id="employee"
                    name="employee"
                    value={newEmployeeShiftSchedule.employee}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---Choose Employee---</option>
                    {employeeOptions.map((option: string) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="minimumWorkingHours">Minimum Working Hours:</label>
                  <input
                    type="text"
                    id="minimumWorkingHours"
                    name="minimumWorkingHours"
                    value={newEmployeeShiftSchedule.minimumWorkingHours}
                    onChange={handleInputChange}
                    placeholder="8:00"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newEmployeeShiftSchedule.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endTime">End Time:</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newEmployeeShiftSchedule.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="enableAutomaticCheckOut">
                    <input
                      type="checkbox"
                      id="enableAutomaticCheckOut"
                      name="enableAutomaticCheckOut"
                      checked={newEmployeeShiftSchedule.enableAutomaticCheckOut}
                      onChange={handleInputChange}
                    />
                    Enable Automatic Check Out
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company:</label>
                  <select
                    id="company"
                    name="company"
                    value={newEmployeeShiftSchedule.company}
                    onChange={handleInputChange}
                  >
                    <option value="">Prasanth Technologies</option>
                    {companyOptions.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
                  </select>
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleCreate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeShiftModal;