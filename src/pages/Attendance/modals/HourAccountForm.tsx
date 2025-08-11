import React, { useState } from "react";
import "./HourAccountForm.css";

// Sample Employee List
const employees = [
  { label: "tarun sai", value: "tarun sai" },
  // Add more employees as needed
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const defaultForm = {
  employee: "",
  month: months[0],
  year: new Date().getFullYear().toString(),
  workedHours: "00:00",
  pendingHours: "00:00",
  overtime: "00:00",
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const yearRegex = /^\d{4}$/;

const HourAccount: React.FC = () => {
  const [fields, setFields] = useState({ ...defaultForm, employee: employees[0].value });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Handle changes for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccessMsg("");
  };

  // Validates HH:MM, resets to 00:00 if invalid and touched
  const handleTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!timeRegex.test(value)) {
      setFields((prev) => ({
        ...prev,
        [name]: "00:00",
      }));
      setErrors((prev) => ({
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let curErrors: { [k: string]: string } = {};
    if (!fields.employee) curErrors.employee = "Required";
    if (!fields.month) curErrors.month = "Required";
    if (!yearRegex.test(fields.year)) curErrors.year = "Year should be 4 digits";
    if (!timeRegex.test(fields.workedHours)) curErrors.workedHours = "Invalid time (HH:MM)";
    if (!timeRegex.test(fields.pendingHours)) curErrors.pendingHours = "Invalid time (HH:MM)";
    if (!timeRegex.test(fields.overtime)) curErrors.overtime = "Invalid time (HH:MM)";
    setErrors(curErrors);
    if (Object.keys(curErrors).length === 0) {
      setSuccessMsg("Hour Account Saved!");
      // Place your API/upload logic here.
    }
  };

  return (
    <div className="ha-modal">
      <form className="ha-form" onSubmit={handleSubmit}>
        <h2 className="ha-title">Hour Account</h2>

        {/* Form grid */}
        <div className="ha-form-row">
          <div className="ha-form-field">
            <label>Employee <span className="ha-required">*</span></label>
            <select
              name="employee"
              value={fields.employee}
              onChange={handleChange}
              required
            >
              {employees.map(emp =>
                <option key={emp.value} value={emp.value}>{emp.label}</option>
              )}
            </select>
            {errors.employee && <span className="ha-error">{errors.employee}</span>}
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
              name="workedHours"
              value={fields.workedHours}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              placeholder="00:00"
              required
            />
            {errors.workedHours && <span className="ha-error">{errors.workedHours}</span>}
          </div>
        </div>

        <div className="ha-form-row">
          <div className="ha-form-field">
            <label>Pending Hours <span className="ha-required">*</span></label>
            <input
              type="text"
              name="pendingHours"
              value={fields.pendingHours}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              placeholder="00:00"
              required
            />
            {errors.pendingHours && <span className="ha-error">{errors.pendingHours}</span>}
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

        <div className="ha-form-actions">
          <button type="submit" className="ha-save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default HourAccount;
