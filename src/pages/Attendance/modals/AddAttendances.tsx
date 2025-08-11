import React, { useState } from 'react';
import "./AddAttendances.css";

const initialState = {
  employee: "",
  attendanceDate: "",
  shift: "",
  workType: "",
  checkInDate: "",
  checkIn: "",
  checkOutDate: "",
  checkOut: "",
  workedHours: "",
  minHour: "",
  batchAttendance: "",
  attendanceValidate: false,
};

const employees = [
  { label: "tarun sai", value: "tarun sai" },
  // Add more employees as needed
];

const shifts = [
  { label: "---Choose Shift---", value: "" },
  { label: "Shift 1", value: "shift1" },
  { label: "Shift 2", value: "shift2" },
];

const workTypes = [
  { label: "---Choose Work Type---", value: "" },
  { label: "Remote", value: "remote" },
  { label: "On-Site", value: "onsite" },
];

const batchAttendances = [
  { label: "---Choose Batch Attendance---", value: "" },
  { label: "Batch 1", value: "batch1" },
  { label: "Batch 2", value: "batch2" },
];

function validateTimeString(time: string) {
  // Checks if time string is in HH:mm format and valid
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

function calculateWorkedHours(checkIn: string, checkOut: string) {
  if (!validateTimeString(checkIn) || !validateTimeString(checkOut)) return "00:00";
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  let minutes = (outH * 60 + outM) - (inH * 60 + inM);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins}`;
}

interface AddAttendancesProps {
  onClose?: () => void;
}

const AddAttendances: React.FC<AddAttendancesProps> = ({ onClose }) => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox") {
      // TypeScript: e.target is HTMLInputElement for checkbox
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setFields({
      ...fields,
      [name]: fieldValue,
    });
    if (name === "checkIn" || name === "checkOut") {
      const checkIn = name === "checkIn" ? value : fields.checkIn;
      const checkOut = name === "checkOut" ? value : fields.checkOut;
      setFields((prev) => ({
        ...prev,
        workedHours: calculateWorkedHours(checkIn, checkOut)
      }));
    }
  };

  const validateForm = () => {
    const err: string[] = [];
    if (!fields.employee) err.push("Employee is required.");
    if (!fields.attendanceDate) err.push("Attendance date is required.");
    if (!fields.shift) err.push("Shift is required.");
    if (!fields.checkInDate) err.push("Check-in Date is required.");
    if (!fields.checkIn) err.push("Check-in time is required.");
    if (!fields.checkOutDate) err.push("Check-out Date is required.");
    if (!fields.checkOut) err.push("Check-out time is required.");

    // Date validations
    if (fields.checkInDate && fields.checkOutDate && fields.checkInDate > fields.checkOutDate)
      err.push("Check-out Date should be after or same as Check-in Date.");
    // Time validation
    if (fields.checkIn && !validateTimeString(fields.checkIn))
      err.push("Check-In time must be in HH:mm format.");
    if (fields.checkOut && !validateTimeString(fields.checkOut))
      err.push("Check-Out time must be in HH:mm format.");
    if (fields.checkIn && fields.checkOut && fields.checkInDate === fields.checkOutDate) {
      if (fields.checkIn >= fields.checkOut) 
        err.push("Check-Out time must be after Check-In time.");
    }

    return err;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (errs.length === 0) {
      // Process form or call backend here
      alert("Attendance saved!");
      setFields(initialState);
    }
  };

  return (
    <form className="add-attendance-form" onSubmit={handleSubmit}>
      <h2>Add Attendances</h2>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
      <div className="form-row">
        <div className="form-field">
          <label>Employees <span className="required">*</span></label>
          <select name="employee" value={fields.employee} onChange={handleChange}>
            <option value="">---Select Employee---</option>
            {employees.map(emp =>
              <option key={emp.value} value={emp.value}>{emp.label}</option>
            )}
          </select>
        </div>
        <div className="form-field">
          <label>Attendance date <span className="required">*</span></label>
          <input
            type="date"
            name="attendanceDate"
            value={fields.attendanceDate}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <label>Shift <span className="required">*</span></label>
          <select name="shift" value={fields.shift} onChange={handleChange}>
            {shifts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Work Type</label>
          <select name="workType" value={fields.workType} onChange={handleChange}>
            {workTypes.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <label>Check-In Date <span className="required">*</span></label>
          <input
            type="date"
            name="checkInDate"
            value={fields.checkInDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Check-In <span className="required">*</span></label>
          <input
            type="time"
            name="checkIn"
            value={fields.checkIn}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <label>Check-Out Date <span className="required">*</span></label>
          <input
            type="date"
            name="checkOutDate"
            value={fields.checkOutDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Check-Out <span className="required">*</span></label>
          <input
            type="time"
            name="checkOut"
            value={fields.checkOut}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <label>Worked Hours <span className="required">*</span></label>
          <input
            type="text"
            name="workedHours"
            value={fields.workedHours}
            readOnly
          />
        </div>
        <div className="form-field">
          <label>Minimum hour <span className="required">*</span></label>
          <input
            type="text"
            name="minHour"
            value={fields.minHour}
            onChange={handleChange}
            placeholder="00:00"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <label>Batch Attendance</label>
          <select 
            name="batchAttendance" 
            value={fields.batchAttendance} 
            onChange={handleChange}
          >
            {batchAttendances.map(b => 
              <option key={b.value} value={b.value}>{b.label}</option>
            )}
          </select>
        </div>
        <div className="form-field toggle-field">
          <label>Attendance Validate</label>
          <input
            type="checkbox"
            name="attendanceValidate"
            checked={fields.attendanceValidate}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-action">
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  );
};

export default AddAttendances;
