import React, { useState, useEffect } from 'react';
import { apiClient, endpoints } from '../../../utils/api';
import { getAllEmployees } from '../../../services/employeeService';
import '../QuickAccess.css';

interface AttendanceRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id: string | null;
  employee_profile_url: string | null;
  is_active?: boolean;
  attendance_date: string;
  attendance_clock_in_date: string | null;
  attendance_clock_in: string | null;
  attendance_clock_out_date: string | null;
  attendance_clock_out: string | null;
  attendance_worked_hour: string | null;
  minimum_hour: string;
  at_work_second: number | null;
  overtime_second: number | null;
  is_bulk_request?: boolean;
  request_description: string | null;
  is_holiday?: boolean;
  requested_data: string | null;
  created_by: number | null;
  modified_by: number | null;
  employee_id: number;
  shift_id: number;
  work_type_id: number;
  attendance_day: number | null;
  batch_attendance_id: number | null;
  shift_name?: string;
}

interface AttendanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onRefresh?: () => void;
  editingRequest?: AttendanceRequest | null;
}

const AttendanceRequestModal: React.FC<AttendanceRequestModalProps> = ({ isOpen, onClose, onSuccess, onRefresh, editingRequest }) => {
  const isEditMode = !!editingRequest;
  const [formData, setFormData] = useState({
    employee_id: '', // Will be populated from employee list
    create_bulk: false,
    attendance_date: '',
    shift_id: '',
    work_type_id: 1,
    attendance_clock_in_date: '',
    attendance_clock_in: '',
    attendance_clock_out_date: '',
    attendance_clock_out: '',
    attendance_worked_hour: '00:00',
    minimum_hour: '00:00',
    request_description: '',
    batch_attendance_id: ''
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

  // Populate form data when editing
  useEffect(() => {
    if (isEditMode && editingRequest) {
      setFormData({
        employee_id: editingRequest.employee_id.toString(),
        create_bulk: false,
        attendance_date: editingRequest.attendance_date,
        shift_id: editingRequest.shift_id.toString(),
        work_type_id: editingRequest.work_type_id,
        attendance_clock_in_date: editingRequest.attendance_clock_in_date || '',
        attendance_clock_in: editingRequest.attendance_clock_in || '',
        attendance_clock_out_date: editingRequest.attendance_clock_out_date || '',
        attendance_clock_out: editingRequest.attendance_clock_out || '',
        attendance_worked_hour: editingRequest.attendance_worked_hour || '00:00',
        minimum_hour: editingRequest.minimum_hour,
        request_description: editingRequest.request_description || '',
        batch_attendance_id: editingRequest.batch_attendance_id?.toString() || ''
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        employee_id: employees.length > 0 ? employees[0].id.toString() : '',
        create_bulk: false,
        attendance_date: '',
        shift_id: '',
        work_type_id: 1,
        attendance_clock_in_date: '',
        attendance_clock_in: '',
        attendance_clock_out_date: '',
        attendance_clock_out: '',
        attendance_worked_hour: '00:00',
        minimum_hour: '00:00',
        request_description: '',
        batch_attendance_id: ''
      });
    }
  }, [isEditMode, editingRequest, employees]);

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
    
    // Optional validation for worked hours
    // if (!formData.attendance_worked_hour.trim()) {
    //   if (onSuccess) {
    //     onSuccess('Please enter worked hours');
    //   }
    //   return;
    // }
    
    setLoading(true);
    
    try {
      // Call the attendance request API - matching exact backend format
      const requestPayload = {
        employee_id: parseInt(formData.employee_id),
        attendance_date: formData.attendance_date,
        shift_id: parseInt(formData.shift_id),
        work_type_id: parseInt(formData.work_type_id.toString()),
        minimum_hour: formData.minimum_hour
      };
      
      console.log(`Sending attendance request payload for ${isEditMode ? 'update' : 'create'}:`, requestPayload);
      
      let response;
      if (isEditMode && editingRequest) {
        // Update existing request
        response = await apiClient.put(endpoints.attendance.requests.update(editingRequest.id.toString()), requestPayload) as any;
        console.log('Attendance request updated:', response.data);
      } else {
        // Create new request
        response = await apiClient.post(endpoints.attendance.requests.create, requestPayload) as any;
        console.log('Attendance request created:', response.data);
      }
      
      // Reset form
      setFormData({
        employee_id: employees.length > 0 ? employees[0].id.toString() : '',
        create_bulk: false,
        attendance_date: '',
        shift_id: '',
        work_type_id: 1,
        attendance_clock_in_date: '',
        attendance_clock_in: '',
        attendance_clock_out_date: '',
        attendance_clock_out: '',
        attendance_worked_hour: '00:00',
        minimum_hour: '00:00',
        request_description: '',
        batch_attendance_id: ''
      });
      
      // Close modal
      onClose();
      
      // Refresh the parent component data
      if (onRefresh) {
        onRefresh();
      }
      
      // Show success notification
      if (onSuccess) {
        onSuccess(`Attendance request ${isEditMode ? 'updated' : 'submitted'} successfully!`);
      }
    } catch (error: any) {
      console.error('Error creating attendance request:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'submit'} attendance request. Please try again.`;
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
          <h2 className="oh-modal-title">{isEditMode ? 'Edit Attendance Request' : 'New Attendances Request'}</h2>
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
                  id="attendance_clock_in_date"
                  name="attendance_clock_in_date"
                  value={formData.attendance_clock_in_date}
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
                  id="attendance_clock_in"
                  name="attendance_clock_in"
                  value={formData.attendance_clock_in}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="--:--"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Check-Out Date</label>
                <input
                  type="date"
                  id="attendance_clock_out_date"
                  name="attendance_clock_out_date"
                  value={formData.attendance_clock_out_date}
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
                  id="attendance_clock_out"
                  name="attendance_clock_out"
                  value={formData.attendance_clock_out}
                  onChange={handleChange}
                  className="oh-form-input"
                  placeholder="--:--"
                />
              </div>

              <div className="oh-form-group">
                <label className="oh-form-label">Worked Hours <span className="oh-required">*</span></label>
                <input
                  type="time"
                  id="attendance_worked_hour"
                  name="attendance_worked_hour"
                  value={formData.attendance_worked_hour}
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
                  id="batch_attendance_id"
                  name="batch_attendance_id"
                  value={formData.batch_attendance_id}
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
                {loading ? (isEditMode ? 'Updating...' : 'Requesting...') : (isEditMode ? 'Update' : 'Request')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRequestModal;
