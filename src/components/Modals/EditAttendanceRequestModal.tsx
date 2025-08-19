import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import './EditAttendanceRequestModal.css';

interface AttendanceRecord {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  shift_name: string;
  badge_id: string | null;
  employee_profile_url: string;
  work_type: string;
  created_at: string;
  is_active: boolean;
  attendance_date: string;
  attendance_clock_in_date: string;
  attendance_clock_in: string;
  attendance_clock_out_date: string;
  attendance_clock_out: string;
  attendance_worked_hour: string;
  minimum_hour: string;
  attendance_overtime_approve: boolean;
  attendance_validated: boolean;
  is_bulk_request: boolean;
  is_holiday: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number;
  work_type_id: number;
  batch_attendance_id: number;
}

interface EditAttendanceRequestModalProps {
  record: AttendanceRecord;
  onClose: () => void;
  onSuccess: () => void;
}

interface RequestData {
  employee_id: number;
  attendance_date: string;
  shift_id: number;
  work_type_id: number;
  minimum_hour: string;
}

const EditAttendanceRequestModal: React.FC<EditAttendanceRequestModalProps> = ({
  record,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<RequestData>({
    employee_id: record.employee_id,
    attendance_date: record.attendance_date,
    shift_id: record.shift_id,
    work_type_id: record.work_type_id,
    minimum_hour: record.minimum_hour
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Array<{id: number, name: string}>>([]);
  const [workTypes, setWorkTypes] = useState<Array<{id: number, name: string}>>([]);

  // Static data for dropdowns (you can replace with API calls if needed)
  useEffect(() => {
    setShifts([
      { id: 1, name: "Morning Shift" },
      { id: 2, name: "Evening Shift" },
      { id: 3, name: "Night Shift" },
    ]);
    
    setWorkTypes([
      { id: 1, name: "Full Time" },
      { id: 2, name: "Part Time" },
      { id: 3, name: "Contract" },
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employee_id' || name === 'shift_id' || name === 'work_type_id' 
        ? parseInt(value) 
        : value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.employee_id) return "Employee ID is required";
    if (!formData.attendance_date) return "Attendance date is required";
    if (!formData.shift_id) return "Shift is required";
    if (!formData.work_type_id) return "Work type is required";
    if (!formData.minimum_hour) return "Minimum hour is required";
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.minimum_hour)) {
      return "Minimum hour must be in HH:MM format";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log the request body as specified
      console.log('PUT Request body being sent to API:', JSON.stringify(formData, null, 2));
      
      const response = await apiClient.put(
        `/api/v1/attendance/attendance-request/${record.id}`,
        formData
      );
      
      // Log the response as specified
      console.log('Attendance request updated successfully:', (response as any).data);
      
      onSuccess();
    } catch (err: any) {
      console.error('Failed to update attendance request:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update attendance request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-request-modal">
      <div className="edit-request-modal__header">
        <h2>Edit Attendance Request</h2>
        <button 
          className="edit-request-modal__close" 
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      
      <div className="edit-request-modal__body">
        <div className="edit-request-modal__employee-info">
          <h3>Employee: {record.employee_first_name} {record.employee_last_name}</h3>
          <p>Badge ID: {record.badge_id || `EMP-${record.employee_id}`}</p>
        </div>
        
        {error && (
          <div className="edit-request-modal__error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-request-modal__form">
          <div className="edit-request-modal__field">
            <label htmlFor="attendance_date">Attendance Date</label>
            <input
              type="date"
              id="attendance_date"
              name="attendance_date"
              value={formData.attendance_date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="edit-request-modal__field">
            <label htmlFor="shift_id">Shift</label>
            <select
              id="shift_id"
              name="shift_id"
              value={formData.shift_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Shift</option>
              {shifts.map(shift => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="edit-request-modal__field">
            <label htmlFor="work_type_id">Work Type</label>
            <select
              id="work_type_id"
              name="work_type_id"
              value={formData.work_type_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Work Type</option>
              {workTypes.map(workType => (
                <option key={workType.id} value={workType.id}>
                  {workType.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="edit-request-modal__field">
            <label htmlFor="minimum_hour">Minimum Hour (HH:MM)</label>
            <input
              type="text"
              id="minimum_hour"
              name="minimum_hour"
              value={formData.minimum_hour}
              onChange={handleInputChange}
              placeholder="08:00"
              pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
              title="Please enter time in HH:MM format (e.g., 08:00)"
              required
            />
          </div>
          
          <div className="edit-request-modal__actions">
            <button 
              type="button" 
              className="edit-request-modal__btn edit-request-modal__btn--secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="edit-request-modal__btn edit-request-modal__btn--primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceRequestModal;