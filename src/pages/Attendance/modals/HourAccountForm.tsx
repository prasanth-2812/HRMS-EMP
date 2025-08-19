import React, { useState, useEffect } from "react";
import { useApi, usePost, usePut } from "../../../hooks/useApi";
import { endpoints } from "../../../utils/api";
import { HourAccount, HourAccountFormData, EmployeeResponse } from "../../../types/hourAccount";
import "./HourAccountForm.css";

interface HourAccountFormProps {
  editingRecord?: HourAccount | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Employee interface for dropdown
interface EmployeeOption {
  label: string;
  value: number;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const defaultForm = {
  employee_id: 0,
  month: months[0],
  year: new Date().getFullYear().toString(),
  worked_hours: "00:00",
  pending_hours: "00:00",
  overtime: "00:00",
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const yearRegex = /^\d{4}$/;

const HourAccountForm: React.FC<HourAccountFormProps> = ({ editingRecord, onSuccess, onCancel }) => {
  const [fields, setFields] = useState<HourAccountFormData>(defaultForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  
  // Fetch employees
  const { data: employeeData, loading: employeeLoading } = useApi<EmployeeResponse>(
    endpoints.employees.list
  );
  
  // API hooks for create/update
  const { post: createRecord, loading: createLoading } = usePost<HourAccount, HourAccountFormData>(
    endpoints.attendance.hourAccount.create
  );
  
  const { put: updateRecord, loading: updateLoading } = usePut<HourAccount, HourAccountFormData>(
    editingRecord ? endpoints.attendance.hourAccount.update(editingRecord.id.toString()) : ''
  );
  
  const isLoading = createLoading || updateLoading;
  
  // Convert employee data to dropdown options
  useEffect(() => {
    if (employeeData && employeeData.results) {
      const options = employeeData.results.map(emp => ({
        label: `${emp.employee_first_name} ${emp.employee_last_name}`,
        value: emp.id
      }));
      setEmployees(options);
      
      // Set default employee if not editing
      if (!editingRecord && options.length > 0) {
        setFields((prev: HourAccountFormData) => ({ ...prev, employee_id: options[0].value }));
      }
    }
  }, [employeeData, editingRecord]);
  
  // Populate form when editing
  useEffect(() => {
    if (editingRecord) {
      setFields({
        employee_id: editingRecord.employee_id,
        month: editingRecord.month,
        year: editingRecord.year,
        worked_hours: editingRecord.worked_hours,
        pending_hours: editingRecord.pending_hours,
        overtime: editingRecord.overtime,
      });
    }
  }, [editingRecord]);

  // Handle changes for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: name === 'employee_id' ? parseInt(value) : value });
    setErrors({ ...errors, [name]: "" });
    setSuccessMsg("");
  };

  // Validates HH:MM, resets to 00:00 if invalid and touched
  const handleTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!timeRegex.test(value)) {
      setFields((prev: HourAccountFormData) => ({
        ...prev,
        [name]: "00:00",
      }));
      setErrors((prev: { [k: string]: string }) => ({
        ...prev,
        [name]: "Invalid time format (HH:MM)",
      }));
    }
  };

  // Validate year field
  const handleYearBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!yearRegex.test(fields.year)) {
      setErrors(prev => ({
        ...prev,
        year: "Year should be 4 digits"
      }));
    }
  };

  // On Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let curErrors: { [k: string]: string } = {};
    
    if (!fields.employee_id) curErrors.employee_id = "Required";
    if (!fields.month) curErrors.month = "Required";
    if (!yearRegex.test(fields.year)) curErrors.year = "Year should be 4 digits";
    if (!timeRegex.test(fields.worked_hours)) curErrors.worked_hours = "Invalid time (HH:MM)";
    if (!timeRegex.test(fields.pending_hours)) curErrors.pending_hours = "Invalid time (HH:MM)";
    if (!timeRegex.test(fields.overtime)) curErrors.overtime = "Invalid time (HH:MM)";
    
    setErrors(curErrors);
    
    if (Object.keys(curErrors).length === 0) {
      try {
        let result;
        if (editingRecord) {
          result = await updateRecord(fields);
        } else {
          result = await createRecord(fields);
        }
        
        if (result) {
          setSuccessMsg(editingRecord ? "Hour Account Updated!" : "Hour Account Created!");
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } catch (error) {
        setErrors({ submit: "Failed to save hour account. Please try again." });
      }
    }
  };

  return (
    <div className="ha-modal">
      <form className="ha-form" onSubmit={handleSubmit}>
        <h2 className="ha-title">{editingRecord ? 'Edit Hour Account' : 'Create Hour Account'}</h2>

        {/* Form grid */}
        <div className="ha-form-row">
          <div className="ha-form-field">
            <label>Employee <span className="ha-required">*</span></label>
            <select
              name="employee_id"
              value={fields.employee_id}
              onChange={handleChange}
              required
              disabled={employeeLoading}
            >
              <option value="">Select Employee</option>
              {employees.map(emp =>
                <option key={emp.value} value={emp.value}>{emp.label}</option>
              )}
            </select>
            {employeeLoading && <span className="ha-info">Loading employees...</span>}
            {errors.employee_id && <span className="ha-error">{errors.employee_id}</span>}
          </div>
          <div className="ha-form-field">
            <label>Month <span className="ha-required">*</span></label>
            <select
              name="month"
              value={fields.month}
              onChange={handleChange}
              required
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.month && <span className="ha-error">{errors.month}</span>}
          </div>
        </div>

        <div className="ha-form-row">
          <div className="ha-form-field">
            <label>Year <span className="ha-required">*</span></label>
            <input
              type="text"
              name="year"
              value={fields.year}
              onChange={handleChange}
              onBlur={handleYearBlur}
              maxLength={4}
              pattern="\d{4}"
              required
            />
            {errors.year && <span className="ha-error">{errors.year}</span>}
          </div>
          <div className="ha-form-field">
            <label>Worked Hours <span className="ha-required">*</span></label>
            <input
              type="text"
              name="worked_hours"
              value={fields.worked_hours}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              placeholder="00:00"
              required
            />
            {errors.worked_hours && <span className="ha-error">{errors.worked_hours}</span>}
          </div>
        </div>

        <div className="ha-form-row">
          <div className="ha-form-field">
            <label>Pending Hours <span className="ha-required">*</span></label>
            <input
              type="text"
              name="pending_hours"
              value={fields.pending_hours}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              placeholder="00:00"
              required
            />
            {errors.pending_hours && <span className="ha-error">{errors.pending_hours}</span>}
          </div>
          <div className="ha-form-field">
            <label>Overtime <span className="ha-required">*</span></label>
            <input
              type="text"
              name="overtime"
              value={fields.overtime}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              placeholder="00:00"
              required
            />
            {errors.overtime && <span className="ha-error">{errors.overtime}</span>}
          </div>
        </div>

        {successMsg && <div className="ha-success-msg">{successMsg}</div>}
        {errors.submit && <div className="ha-error">{errors.submit}</div>}

        <div className="ha-form-actions">
          <button 
            type="button" 
            className="ha-btn ha-btn--secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="ha-save-btn"
            disabled={isLoading || employeeLoading}
          >
            {isLoading ? 'Saving...' : (editingRecord ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HourAccountForm;
