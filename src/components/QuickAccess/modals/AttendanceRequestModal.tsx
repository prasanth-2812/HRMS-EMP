import React, { useState, useEffect } from 'react';
import { apiClient, endpoints } from '../../../utils/api';
import { getAllEmployees } from '../../../services/employeeService';
import '../QuickAccess.css';

interface AttendanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onRefresh?: () => void;
  editMode?: boolean;
  attendanceRequestId?: string;
  initialData?: {
    employee_id: number;
    attendance_date: string;
    shift_id: number;
    work_type_id: number;
    minimum_hour: string;
  };
}

const AttendanceRequestModal: React.FC<AttendanceRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onRefresh, 
  editMode = false, 
  attendanceRequestId, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    employee_id: '', // Will be populated from employee list
    create_bulk: false,
    attendance_date: '',
    shift_id: '',
    work_type_id: '',
    check_in_date: '',
    check_in_time: '',
    check_out_date: '',
    check_out_time: '',
    worked_hours: '00:00',
    minimum_hour: '00:00',
    request_description: '',
    batch_attendance: ''
  });
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Fetch employees when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  // Populate form with initial data when in edit mode
  useEffect(() => {
    if (editMode && initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        employee_id: initialData.employee_id.toString(),
        attendance_date: initialData.attendance_date,
        shift_id: initialData.shift_id.toString(),
        work_type_id: initialData.work_type_id.toString(),
        minimum_hour: initialData.minimum_hour
      }));
    }
  }, [editMode, initialData, isOpen]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const employeeList = await getAllEmployees();
      setEmployees(employeeList);
      
      // Set first employee as default if available
      if (employeeList.length > 0 && !formData.employee_id) {
        setFormData(prev => ({ ...prev, employee_id: employeeList[0].id.toString() }));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (onSuccess) {
        onSuccess('Failed to load employees');
      }
    } finally {
      setLoadingEmployees(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.employee_id) {
      if (onSuccess) {
        onSuccess('Please select an employee');
      }
      return;
    }
    
    if (!formData.attendance_date.trim()) {
      if (onSuccess) {
        onSuccess('Please select an attendance date');
      }
      return;
    }
    
    if (!formData.shift_id) {
      if (onSuccess) {
        onSuccess('Please select a shift');
      }
      return;
    }
    
    if (!formData.minimum_hour.trim()) {
      if (onSuccess) {
        onSuccess('Please enter minimum hours');
      }
      return;
    }
    
    if (!formData.request_description.trim()) {
      if (onSuccess) {
        onSuccess('Please enter request description');
      }
      return;
    }
    
    if (!formData.worked_hours.trim()) {
      if (onSuccess) {
        onSuccess('Please enter worked hours');
      }
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the attendance request API
      const requestPayload = {
        employee_id: parseInt(formData.employee_id),
        attendance_date: formData.attendance_date,
        shift_id: parseInt(formData.shift_id),
        work_type_id: parseInt(formData.work_type_id),
        minimum_hour: formData.minimum_hour,
        request_description: formData.request_description,
        attendance_clock_in_date: formData.check_in_date || null,
        attendance_clock_in: formData.check_in_time || null,
        attendance_clock_out_date: formData.check_out_date || null,
        attendance_clock_out: formData.check_out_time || null,
        attendance_worked_hour: formData.worked_hours || null,
        batch_attendance_id: formData.batch_attendance ? parseInt(formData.batch_attendance) : null
      };
      
      console.log('Sending attendance request payload:', requestPayload);
      
      let response: any;
      if (editMode && attendanceRequestId) {
        // Update existing attendance request
        response = await apiClient.put(endpoints.attendance.request.update(attendanceRequestId), requestPayload);
        console.log('Attendance request updated:', response.data);
      } else {
        // Create new attendance request
        response = await apiClient.post(endpoints.attendance.request.create, requestPayload);
        console.log('Attendance request created:', response.data);
      }
      
      // Reset form
      setFormData({
        employee_id: employees.length > 0 ? employees[0].id.toString() : '',
        create_bulk: false,
        attendance_date: '',
        shift_id: '',
        work_type_id: '',
        check_in_date: '',
        check_in_time: '',
        check_out_date: '',
        check_out_time: '',
        worked_hours: '00:00',
        minimum_hour: '00:00',
        request_description: '',
        batch_attendance: ''
      });
      
      // Close modal
      onClose();
      
      // Refresh the parent component data
      if (onRefresh) {
        onRefresh();
      }
      
      // Show success notification
      if (onSuccess) {
        const successMessage = editMode 
          ? 'Attendance request updated successfully!' 
          : 'Attendance request submitted successfully!';
        onSuccess(successMessage);
      }
    } catch (error: any) {
      console.error('Error creating attendance request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit attendance request. Please try again.';
      if (onSuccess) {
        onSuccess(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-attendance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h2 className="oh-modal-title">
            {editMode ? 'Edit Attendance Request' : 'New Attendances Request'}
          </h2>
          <button 
            className="oh-modal-close" 
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="oh-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="oh-form-grid">
              {/* Row 1: Employee and Create Bulk */}
               <div className="oh-form-group">
                 <label className="oh-form-label">Employee <span className="oh-required">*</span></label>
                 <select
                   id="employee_id"
                   name="employee_id"
                   value={formData.employee_id}
                   onChange={handleChange}
                   required
                   className="oh-form-input"
                   disabled={loadingEmployees}
                 >
                   <option value="">{loadingEmployees ? 'Loading employees...' : 'Select Employee'}</option>
                   {employees.map((employee) => (
                     <option key={employee.id} value={employee.id}>
                       {employee.firstName} {employee.lastName} ({employee.employeeId})
                     </option>
                   ))}
                 </select>
               </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Create Bulk</label>
                <div className="oh-toggle-container">
                  <input
                    type="checkbox"
                    id="create_bulk"
                    name="create_bulk"
                    checked={formData.create_bulk}
                    onChange={(e) => setFormData({...formData, create_bulk: e.target.checked})}
                    className="oh-toggle-input"
                  />
                  <label htmlFor="create_bulk" className="oh-toggle-label"></label>
                </div>
              </div>

              {/* Row 2: Attendance Date and Shift */}
              <div className="oh-form-group">
                <label className="oh-form-label">Attendance date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="attendance_date"
                  name="attendance_date"
                  value={formData.attendance_date}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Shift <span className="oh-required">*</span></label>
                <select
                  id="shift_id"
                  name="shift_id"
                  value={formData.shift_id}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                >
                  <option value="">---Choose Shift---</option>
                  <option value="1">Morning Shift</option>
                  <option value="2">Evening Shift</option>
                  <option value="3">Night Shift</option>
                </select>
              </div>

              {/* Row 3: Work Type and Check-in Date */}
              <div className="oh-form-group">
                <label className="oh-form-label">Work Type</label>
                <select
                  id="work_type_id"
                  name="work_type_id"
                  value={formData.work_type_id}
                  onChange={handleChange}
                  className="oh-form-input"
                >
                  <option value="">---Choose Work Type---</option>
                  <option value="1">Regular Work</option>
                  <option value="2">Remote Work</option>
                  <option value="3">Field Work</option>
                </select>
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Check-in Date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="check_in_date"
                  name="check_in_date"
                  value={formData.check_in_date}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              {/* Row 4: Check-in Time and Check-Out Date */}
              <div className="oh-form-group">
                <label className="oh-form-label">Check-in <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="check_in_time"
                  name="check_in_time"
                  value={formData.check_in_time}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="--:--"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Check-Out Date</label>
                <input
                  type="date"
                  id="check_out_date"
                  name="check_out_date"
                  value={formData.check_out_date}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              {/* Row 5: Check-Out Time and Worked Hours */}
              <div className="oh-form-group">
                <label className="oh-form-label">Check-Out</label>
                <input
                  type="time"
                  id="check_out_time"
                  name="check_out_time"
                  value={formData.check_out_time}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="--:--"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Worked Hours <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="worked_hours"
                  name="worked_hours"
                  value={formData.worked_hours}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="00:00"
                />
              </div>

              {/* Row 6: Minimum hour */}
              <div className="oh-form-group">
                <label className="oh-form-label">Minimum hour <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="minimum_hour"
                  name="minimum_hour"
                  value={formData.minimum_hour}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                  placeholder="00:00"
                />
              </div>

              {/* Request Description - Full Width */}
              <div className="oh-form-group oh-form-group--full-width">
                <label className="oh-form-label">Request Description <span className="oh-required">*</span></label>
                <textarea
                  id="request_description"
                  name="request_description"
                  value={formData.request_description}
                  onChange={handleChange}
                  rows={4}
                  className="oh-form-textarea"
                  placeholder="Request Description"
                />
              </div>

              {/* Batch Attendance */}
              <div className="oh-form-group">
                <label className="oh-form-label">Batch Attendance</label>
                <select
                  id="batch_attendance"
                  name="batch_attendance"
                  value={formData.batch_attendance}
                  onChange={handleChange}
                  className="oh-form-input"
                >
                  <option value="">---Choose Batch Attendance---</option>
                  <option value="batch1">Batch 1</option>
                  <option value="batch2">Batch 2</option>
                  <option value="batch3">Batch 3</option>
                </select>
              </div>
            </div>

            <div className="oh-modal-footer">
              <button type="button" className="oh-btn oh-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="oh-btn oh-btn--primary" disabled={loading}>
                {loading 
                  ? (editMode ? 'Updating...' : 'Requesting...') 
                  : (editMode ? 'Update' : 'Request')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRequestModal;
