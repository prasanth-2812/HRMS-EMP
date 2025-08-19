import React, { useState, useEffect } from 'react';
import { usePost } from '../../../hooks/useApi';
import { apiClient } from '../../../utils/api';
import { getAllEmployees } from '../../../services/employeeService';
import "./AddAttendances.css";

// TypeScript interfaces for API request and response
interface AttendanceRequest {
  employee_id: number;
  attendance_date: string;
  attendance_clock_in_date?: string;
  attendance_clock_in?: string;
  attendance_clock_out_date?: string;
  attendance_clock_out?: string;
  attendance_worked_hour?: string;
  minimum_hour?: string;
  attendance_overtime_approve?: boolean;
  attendance_validated?: boolean;
}

interface AttendanceResponse {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id: string | null;
  employee_profile_url: string;
  created_at: string;
  is_active: boolean;
  attendance_date: string;
  attendance_clock_in_date: string | null;
  attendance_clock_in: string | null;
  attendance_clock_out_date: string | null;
  attendance_clock_out: string | null;
  attendance_worked_hour: string;
  minimum_hour: string;
  attendance_overtime_approve: boolean;
  attendance_validated: boolean;
  is_bulk_request: boolean;
  is_holiday: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number | null;
  work_type_id: number | null;
  batch_attendance_id: number | null;
}

// Interface for employee data
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const initialState = {
  employee: "",
  attendanceDate: "",
  attendanceClockInDate: "",
  attendanceClockIn: "",
  attendanceClockOutDate: "",
  attendanceClockOut: "",
  attendanceWorkedHour: "",
  minimumHour: "",
  shift: "",
  workType: "",
  batchAttendance: "",
  attendanceOvertimeApprove: false,
  attendanceValidated: false,
};

// Static data for dropdowns
const shifts = [
  { id: 1, name: "Morning Shift" },
  { id: 2, name: "Evening Shift" },
  { id: 3, name: "Night Shift" },
];

const workTypes = [
  { id: 1, name: "Full Time" },
  { id: 2, name: "Part Time" },
  { id: 3, name: "Contract" },
];

const batchAttendances = [
  { id: 1, name: "Batch 1" },
  { id: 2, name: "Batch 2" },
  { id: 3, name: "Batch 3" },
];

// Helper function to validate time format (HH:MM)
const validateTimeString = (time: string): boolean => {
  if (!time) return true; // Allow empty time
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Helper function to calculate worked hours
const calculateWorkedHours = (clockIn: string, clockOut: string): string => {
  if (!clockIn || !clockOut) return "";
  
  try {
    const [inHours, inMinutes] = clockIn.split(':').map(Number);
    const [outHours, outMinutes] = clockOut.split(':').map(Number);
    
    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;
    
    let diffMinutes = outTotalMinutes - inTotalMinutes;
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Handle next day checkout
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    return "";
  }
};

// Employees will be fetched dynamically from the API

interface AddAttendancesProps {
  onClose?: () => void;
  onSuccess?: () => void; // Callback to refresh attendance list
  editingRecord?: AttendanceResponse | null; // Record to edit
}

const AddAttendances: React.FC<AddAttendancesProps> = ({ onClose, onSuccess, editingRecord }) => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  
  // API hooks for attendance operations
  
  // Initialize the API hooks for attendance
  const { post: createAttendance, loading: isCreating, error: createError } = usePost<AttendanceResponse, AttendanceRequest>('/api/v1/attendance/attendance/');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const isSubmitting = isCreating || isUpdating;
  const apiError = createError || updateError;

  // Initialize form with editing data
  useEffect(() => {
    if (editingRecord) {
      setFields({
        employee: editingRecord.employee_id.toString(),
        attendanceDate: editingRecord.attendance_date,
        attendanceClockInDate: editingRecord.attendance_clock_in_date || "",
        attendanceClockIn: editingRecord.attendance_clock_in || "",
        attendanceClockOutDate: editingRecord.attendance_clock_out_date || "",
        attendanceClockOut: editingRecord.attendance_clock_out || "",
        attendanceWorkedHour: editingRecord.attendance_worked_hour,
        minimumHour: editingRecord.minimum_hour,
        shift: editingRecord.shift_id?.toString() || "",
        workType: editingRecord.work_type_id?.toString() || "",
        batchAttendance: editingRecord.batch_attendance_id?.toString() || "",
        attendanceOvertimeApprove: editingRecord.attendance_overtime_approve,
        attendanceValidated: editingRecord.attendance_validated,
      });
    }
  }, [editingRecord]);

  // Fetch employees when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const employeeData = await getAllEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrors(["Failed to load employees. Please refresh the page."]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let newFields = {
      ...fields,
      [name]: type === 'checkbox' ? checked : value,
    };
    
    // Auto-calculate worked hours when clock in/out times change
    if (name === 'attendanceClockIn' || name === 'attendanceClockOut') {
      const clockIn = name === 'attendanceClockIn' ? value : fields.attendanceClockIn;
      const clockOut = name === 'attendanceClockOut' ? value : fields.attendanceClockOut;
      
      if (clockIn && clockOut && validateTimeString(clockIn) && validateTimeString(clockOut)) {
        newFields.attendanceWorkedHour = calculateWorkedHours(clockIn, clockOut);
      }
    }
    
    setFields(newFields);
  };

  const validateForm = () => {
    const err: string[] = [];
    if (!fields.employee) err.push("Employee is required.");
    if (!fields.attendanceDate) err.push("Attendance date is required.");
    
    // Validate time formats
    if (fields.attendanceClockIn && !validateTimeString(fields.attendanceClockIn)) {
      err.push("Clock in time must be in HH:MM format.");
    }
    if (fields.attendanceClockOut && !validateTimeString(fields.attendanceClockOut)) {
      err.push("Clock out time must be in HH:MM format.");
    }
    if (fields.attendanceWorkedHour && !validateTimeString(fields.attendanceWorkedHour)) {
      err.push("Worked hour must be in HH:MM format.");
    }
    if (fields.minimumHour && !validateTimeString(fields.minimumHour)) {
      err.push("Minimum hour must be in HH:MM format.");
    }
    
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    setSuccessMessage("");
    
    if (errs.length === 0) {
      try {
        // Parse employee ID from the selected value
        const employeeId = parseInt(fields.employee);
        
        if (!employeeId || isNaN(employeeId)) {
          setErrors(["Please select a valid employee."]);
          return;
        }
        
        // Prepare the request data according to API specification
        const requestData: AttendanceRequest = {
          employee_id: employeeId,
          attendance_date: fields.attendanceDate,
          ...(fields.attendanceClockInDate && { attendance_clock_in_date: fields.attendanceClockInDate }),
          ...(fields.attendanceClockIn && { attendance_clock_in: fields.attendanceClockIn }),
          ...(fields.attendanceClockOutDate && { attendance_clock_out_date: fields.attendanceClockOutDate }),
          ...(fields.attendanceClockOut && { attendance_clock_out: fields.attendanceClockOut }),
          ...(fields.attendanceWorkedHour && { attendance_worked_hour: fields.attendanceWorkedHour }),
          ...(fields.minimumHour && { minimum_hour: fields.minimumHour }),
          attendance_overtime_approve: fields.attendanceOvertimeApprove,
          attendance_validated: fields.attendanceValidated,
        };
        
        // Log the request body before sending as requested
        console.log('Request body being sent to API:', JSON.stringify(requestData, null, 2));
        
        let response;
        if (editingRecord) {
          // Update existing attendance
          setIsUpdating(true);
          setUpdateError(null);
          try {
            response = await apiClient.put(`/api/v1/attendance/attendance/${editingRecord.id}`, requestData);
          } catch (err) {
            setUpdateError(err instanceof Error ? err.message : 'An error occurred');
            return;
          } finally {
            setIsUpdating(false);
          }
        } else {
          // Create new attendance
          response = await createAttendance(requestData);
        }
        
        if (response) {
          // Log the response data to console as requested
          console.log(`Attendance ${editingRecord ? 'updated' : 'created'} successfully:`, response);
          
          // Show success message
          setSuccessMessage(`Attendance ${editingRecord ? 'updated' : 'created'} successfully!`);
          
          // Reset form only if creating new record
          if (!editingRecord) {
            setFields(initialState);
          }
          
          // Refresh attendance list if callback provided
          if (onSuccess) {
            onSuccess();
          }
          
          // Close modal after a short delay
          setTimeout(() => {
            if (onClose) onClose();
          }, 1500);
        }
      } catch (error) {
        console.error(`Error ${editingRecord ? 'updating' : 'creating'} attendance:`, error);
        setErrors([`Failed to ${editingRecord ? 'update' : 'create'} attendance. Please try again.`]);
      }
    }
  };

  return (
    <form className="add-attendance-form" onSubmit={handleSubmit}>
      <h2>{editingRecord ? 'Edit Attendance' : 'Add Attendances'}</h2>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
      {apiError && (
        <div className="form-errors">
          <div>API Error: {apiError}</div>
        </div>
      )}
      {successMessage && (
        <div className="form-success">
          <div>{successMessage}</div>
        </div>
      )}
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="employee">Employee <span className="required">*</span></label>
          <select
            id="employee"
            name="employee"
            value={fields.employee}
            onChange={handleChange}
            required
            disabled={loadingEmployees}
          >
            <option value="">
              {loadingEmployees ? "Loading employees..." : "Select Employee"}
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id.toString()}>
                {emp.firstName} {emp.lastName} ({emp.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Attendance date <span className="required">*</span></label>
          <input
            type="date"
            name="attendanceDate"
            value={fields.attendanceDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Clock in date</label>
          <input
            type="date"
            name="attendanceClockInDate"
            value={fields.attendanceClockInDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Clock in</label>
          <input
            type="time"
            name="attendanceClockIn"
            value={fields.attendanceClockIn}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Clock out date</label>
          <input
            type="date"
            name="attendanceClockOutDate"
            value={fields.attendanceClockOutDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Clock out</label>
          <input
            type="time"
            name="attendanceClockOut"
            value={fields.attendanceClockOut}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Shift</label>
          <select
            name="shift"
            value={fields.shift}
            onChange={handleChange}
          >
            <option value="">Select Shift</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.name}>
                {shift.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Work type</label>
          <select
            name="workType"
            value={fields.workType}
            onChange={handleChange}
          >
            <option value="">Select Work Type</option>
            {workTypes.map((workType) => (
              <option key={workType.id} value={workType.name}>
                {workType.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Worked hour</label>
          <input
            type="text"
            name="attendanceWorkedHour"
            value={fields.attendanceWorkedHour}
            onChange={handleChange}
            placeholder="HH:MM"
            readOnly
          />
        </div>
        <div className="form-field">
          <label>Minimum hour</label>
          <input
            type="text"
            name="minimumHour"
            value={fields.minimumHour}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Batch attendance</label>
          <select
            name="batchAttendance"
            value={fields.batchAttendance}
            onChange={handleChange}
          >
            <option value="">Select Batch Attendance</option>
            {batchAttendances.map((batch) => (
              <option key={batch.id} value={batch.name}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field toggle-field">
          <input
            type="checkbox"
            id="attendanceValidated"
            name="attendanceValidated"
            checked={fields.attendanceValidated}
            onChange={handleChange}
          />
          <label htmlFor="attendanceValidated">Attendance validated</label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field toggle-field">
          <input
            type="checkbox"
            id="attendanceOvertimeApprove"
            name="attendanceOvertimeApprove"
            checked={fields.attendanceOvertimeApprove}
            onChange={handleChange}
          />
          <label htmlFor="attendanceOvertimeApprove">Attendance overtime approve</label>
        </div>
      </div>
      
      <div className="form-action">
        <button type="submit" className="save-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default AddAttendances;
