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
    if (!formData.attendance_date.trim()) {
      if (onSuccess) {
        onSuccess('Please select an attendance date');
      }
      return;
    }
    
    if (!formData.shift_id.trim()) {
      if (onSuccess) {
        onSuccess('Please select a shift');
      }
      return;
    }
    
    if (!formData.attendance_clock_in.trim() || !formData.attendance_clock_out.trim()) {
      if (onSuccess) {
        onSuccess('Please provide both clock in and clock out times');
      }
      return;
    }
    
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="oh-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="oh-form-grid">
              <div className="oh-form-group">
                <label className="oh-form-label">Attendance Date <span className="oh-required">*</span></label>
                <input
                  type="date"
                  id="attendance_date"
                  name="attendance_date"
                  value={formData.attendance_date}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
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
                  <option value="">Select Shift</option>
                  <option value="1">Morning Shift (9:00 AM - 6:00 PM)</option>
                  <option value="2">Evening Shift (2:00 PM - 11:00 PM)</option>
                  <option value="3">Night Shift (11:00 PM - 8:00 AM)</option>
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
                />
              </div>

              <div className="oh-form-group oh-form-group--full-width">
                <label className="oh-form-label">Description</label>
                <textarea
                  id="request_description"
                  name="request_description"
                  value={formData.request_description}
                  onChange={handleChange}
                  rows={4}
                  className="oh-form-textarea"
                  placeholder="Enter reason for attendance request..."
                />
              </div>

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
