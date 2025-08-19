import React, { useState, useEffect } from 'react';
import { 
  getEmployeeShifts, 
  createEmployeeShift, 
  updateEmployeeShift, 
  deleteEmployeeShift, 
  EmployeeShift 
} from '../../../services/baseService';
import { getAllEmployees } from '../../../services/employeeService';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface EmployeeShiftScheduleData {
  id?: number;
  employee_id: number;
  shift_start_time: string;
  shift_end_time: string;
  minimum_hour: number;
  employee_name?: string;
}

interface EmployeeShiftModalProps {
  onClose: () => void;
}

const EmployeeShiftModal: React.FC<EmployeeShiftModalProps> = ({ onClose }) => {
  const [employeeShiftSchedules, setEmployeeShiftSchedules] = useState<EmployeeShiftScheduleData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<EmployeeShiftScheduleData | null>(null);
  
  const [newEmployeeShiftSchedule, setNewEmployeeShiftSchedule] = useState({
    employee_id: '',
    shift_start_time: '',
    shift_end_time: '',
    minimum_hour: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployeeShifts();
    fetchEmployees();
  }, []);

  const fetchEmployeeShifts = async () => {
    setLoading(true);
    try {
      const response = await getEmployeeShifts();
      const shiftsWithEmployeeNames = response.results.map((shift: EmployeeShift) => {
        const employee = employees.find(emp => emp.id === shift.employee_id.toString());
        return {
          ...shift,
          employee_name: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'
        };
      });
      setEmployeeShiftSchedules(shiftsWithEmployeeNames);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch employee shifts');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const employeeData = await getAllEmployees();
      setEmployees(employeeData);
    } catch (error: any) {
      console.error('Failed to fetch employees:', error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployeeShiftSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = async () => {
    if (!newEmployeeShiftSchedule.employee_id || !newEmployeeShiftSchedule.shift_start_time || 
        !newEmployeeShiftSchedule.shift_end_time || !newEmployeeShiftSchedule.minimum_hour) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const shiftData = {
        employee_id: parseInt(newEmployeeShiftSchedule.employee_id),
        shift_start_time: newEmployeeShiftSchedule.shift_start_time,
        shift_end_time: newEmployeeShiftSchedule.shift_end_time,
        minimum_hour: parseFloat(newEmployeeShiftSchedule.minimum_hour)
      };
      
      await createEmployeeShift(shiftData);
      await fetchEmployeeShifts();
      
      setNewEmployeeShiftSchedule({
        employee_id: '',
        shift_start_time: '',
        shift_end_time: '',
        minimum_hour: ''
      });
      setShowCreateModal(false);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to create employee shift');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shift: EmployeeShiftScheduleData) => {
    if (shift.id !== undefined) {
      setEditingId(shift.id);
      setEditingValue({ ...shift });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingValue || !editingId) return;

    setLoading(true);
    try {
      const updateData = {
        employee_id: editingValue.employee_id,
        shift_start_time: editingValue.shift_start_time,
        shift_end_time: editingValue.shift_end_time,
        minimum_hour: editingValue.minimum_hour
      };
      
      await updateEmployeeShift(editingId, updateData);
      await fetchEmployeeShifts();
      
      setEditingId(null);
      setEditingValue(null);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to update employee shift');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee shift?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteEmployeeShift(id);
      await fetchEmployeeShifts();
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to delete employee shift');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewEmployeeShiftSchedule({
      employee_id: '',
      shift_start_time: '',
      shift_end_time: '',
      minimum_hour: ''
    });
    setError(null);
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId.toString());
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
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
              style={{ 
                marginRight: '10px',
                backgroundColor: loading ? '#6b7280' : '#3b82f6',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              + Create
            </button>
            <button className="modal-close" onClick={onClose}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}
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
                  }}>Employee</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Start Time</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>End Time</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Min Hours</th>
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
                {loading && employeeShiftSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      Loading employee shifts...
                    </td>
                  </tr>
                ) : employeeShiftSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      No employee shifts found
                    </td>
                  </tr>
                ) : (
                  employeeShiftSchedules.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <select
                            value={editingValue?.employee_id || ''}
                            onChange={(e) => setEditingValue(prev => prev ? { ...prev, employee_id: parseInt(e.target.value) } : null)}
                            style={{ width: '100%', padding: '4px' }}
                          >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getEmployeeName(item.employee_id)
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <input
                            type="time"
                            value={editingValue?.shift_start_time || ''}
                            onChange={(e) => setEditingValue(prev => prev ? { ...prev, shift_start_time: e.target.value } : null)}
                            style={{ width: '100%', padding: '4px' }}
                          />
                        ) : (
                          item.shift_start_time
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <input
                            type="time"
                            value={editingValue?.shift_end_time || ''}
                            onChange={(e) => setEditingValue(prev => prev ? { ...prev, shift_end_time: e.target.value } : null)}
                            style={{ width: '100%', padding: '4px' }}
                          />
                        ) : (
                          item.shift_end_time
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <input
                            type="number"
                            step="0.5"
                            value={editingValue?.minimum_hour || ''}
                            onChange={(e) => setEditingValue(prev => prev ? { ...prev, minimum_hour: parseFloat(e.target.value) } : null)}
                            style={{ width: '100%', padding: '4px' }}
                          />
                        ) : (
                          item.minimum_hour
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  fontSize: '12px'
                                }}
                                title="Save"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={loading}
                                style={{
                                  background: '#6b7280',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  fontSize: '12px'
                                }}
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: '#6b7280',
                                  fontSize: '16px'
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => item.id !== undefined && handleDelete(item.id)}
                                disabled={loading || item.id === undefined}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: (loading || item.id === undefined) ? 'not-allowed' : 'pointer',
                                  color: '#ef4444',
                                  fontSize: '16px'
                                }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <div className="form-group">
                  <label htmlFor="employee_id">Employee <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <select
                    id="employee_id"
                    name="employee_id"
                    value={newEmployeeShiftSchedule.employee_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">---Choose Employee---</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="shift_start_time">Start Time <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <input
                    type="time"
                    id="shift_start_time"
                    name="shift_start_time"
                    value={newEmployeeShiftSchedule.shift_start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shift_end_time">End Time <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <input
                    type="time"
                    id="shift_end_time"
                    name="shift_end_time"
                    value={newEmployeeShiftSchedule.shift_end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minimum_hour">Minimum Hours <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <input
                    type="number"
                    step="0.5"
                    id="minimum_hour"
                    name="minimum_hour"
                    value={newEmployeeShiftSchedule.minimum_hour}
                    onChange={handleInputChange}
                    placeholder="8"
                    required
                  />
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCloseModal}
                disabled={loading}
                style={{ 
                  marginRight: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                onClick={handleCreate}
                disabled={loading || !newEmployeeShiftSchedule.employee_id || !newEmployeeShiftSchedule.shift_start_time || !newEmployeeShiftSchedule.shift_end_time || !newEmployeeShiftSchedule.minimum_hour}
                style={{
                  backgroundColor: (loading || !newEmployeeShiftSchedule.employee_id || !newEmployeeShiftSchedule.shift_start_time || !newEmployeeShiftSchedule.shift_end_time || !newEmployeeShiftSchedule.minimum_hour) ? '#6b7280' : '#3b82f6',
                  cursor: (loading || !newEmployeeShiftSchedule.employee_id || !newEmployeeShiftSchedule.shift_start_time || !newEmployeeShiftSchedule.shift_end_time || !newEmployeeShiftSchedule.minimum_hour) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeShiftModal;