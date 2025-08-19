import React, { useState } from "react";
import "./WorkRecordFilterAdvance.css";

const statusOptions = [
  { value: "", label: "All" },
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "leave", label: "Leave" },
  { value: "halfday", label: "Half Day" },
  { value: "conflict", label: "Conflict" },
];
const yesNoAll = [
  { value: "", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const initialValues = {
  dateFrom: "",
  dateTo: "",
  status: "",
  regularized: "",
  probation: "",
  active: ""
};

const WorkRecordFilterAdvance: React.FC<{ onFilter?: (vals: typeof initialValues) => void }> = ({ onFilter }) => {
  const [fields, setFields] = useState(initialValues);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({});
    setSubmitted(false);
  };

  function validate() {
    const err: typeof errors = {};
    if (fields.dateFrom && fields.dateTo && fields.dateTo < fields.dateFrom) {
      err.dateTo = "To date can't be before From date";
    }
    return err;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrs = validate();
    setErrors(valErrs);
    setSubmitted(true);
    if (Object.keys(valErrs).length === 0) {
      if (onFilter) onFilter(fields);
      // alert(JSON.stringify(fields, null, 2));
    }
  };

  return (
    <form className="wrfa-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="wrfa-grid">
        {/* Row 1 */}
        <div className="wrfa-col">
          <label>Attendance Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={fields.dateFrom}
            max={fields.dateTo}
            onChange={handleChange}
          />
        </div>
        <div className="wrfa-col">
          <label>Attendance Date To</label>
          <input
            type="date"
            name="dateTo"
            value={fields.dateTo}
            min={fields.dateFrom}
            onChange={handleChange}
          />
          {errors.dateTo && <span className="wrfa-error">{errors.dateTo}</span>}
        </div>
        {/* Row 2 */}
        <div className="wrfa-col">
          <label>Attendance Status</label>
          <select name="status" value={fields.status} onChange={handleChange}>
            {statusOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="wrfa-col">
          <label>Is Regularized?</label>
          <select name="regularized" value={fields.regularized} onChange={handleChange}>
            {yesNoAll.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {/* Row 3 */}
        <div className="wrfa-col">
          <label>Is On Probation?</label>
          <select name="probation" value={fields.probation} onChange={handleChange}>
            {yesNoAll.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="wrfa-col">
          <label>Is Active?</label>
          <select name="active" value={fields.active} onChange={handleChange}>
            {yesNoAll.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="wrfa-btn" type="submit">
        Filter
      </button>
      {submitted && Object.keys(errors).length === 0 && (
        <div className="wrfa-success">Filters applied!</div>
      )}
    </form>
  );
};

export default WorkRecordFilterAdvance;
