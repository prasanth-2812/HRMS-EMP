import React, { useState } from "react";
import "./WorkRecordFilterWorkInfo.css";

const companies = [
  { value: "", label: "Select Company" },
  { value: "acme", label: "Acme Corp" },
  { value: "globex", label: "Globex Inc" },
];
const managers = [
  { value: "", label: "Select Manager" },
  { value: "1", label: "John Doe" }, 
  { value: "2", label: "Jane Smith" },
];
const departments = [
  { value: "", label: "Select Department" },
  { value: "dev", label: "Development" },
  { value: "sales", label: "Sales" },
];
const jobPositions = [
  { value: "", label: "Select Job Position" },
  { value: "swe", label: "Software Engineer" },
  { value: "pm", label: "Product Manager" },
];
const shifts = [
  { value: "", label: "Select Shift" },
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
];
const workTypes = [
  { value: "", label: "Select Work Type" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
];
const employeeTags = [
  { value: "", label: "Select Tag" },
  { value: "full", label: "Full Time" },
  { value: "part", label: "Part Time" },
];
const currentlyWorkingOptions = [
  { value: "", label: "Unknown" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const initialValues = {
  company: "",
  manager: "",
  department: "",
  jobPosition: "",
  shift: "",
  workType: "",
  employeeTag: "",
  currentlyWorking: "",
};

const WorkRecordFilterWorkInfo: React.FC<{ onFilter?: (data: typeof initialValues) => void }> = ({ onFilter }) => {
  const [fields, setFields] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (onFilter) onFilter(fields);
    // Alert shows the filter for demo purposes
    alert("Filter applied:\n" + JSON.stringify(fields, null, 2));
  }

  return (
    <form className="wrfw-form" onSubmit={handleSubmit}>
      <div className="wrfw-row">
        <div className="wrfw-field">
          <label>Company</label>
          <select name="company" value={fields.company} onChange={handleChange}>
            {companies.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="wrfw-field">
          <label>Reporting Manager</label>
          <select name="manager" value={fields.manager} onChange={handleChange}>
            {managers.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="wrfw-row">
        <div className="wrfw-field">
          <label>Department</label>
          <select name="department" value={fields.department} onChange={handleChange}>
            {departments.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="wrfw-field">
          <label>Job Position</label>
          <select name="jobPosition" value={fields.jobPosition} onChange={handleChange}>
            {jobPositions.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="wrfw-row">
        <div className="wrfw-field">
          <label>Shift</label>
          <select name="shift" value={fields.shift} onChange={handleChange}>
            {shifts.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="wrfw-field">
          <label>Work Type</label>
          <select name="workType" value={fields.workType} onChange={handleChange}>
            {workTypes.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="wrfw-row">
        <div className="wrfw-field">
          <label>Employee tag</label>
          <select name="employeeTag" value={fields.employeeTag} onChange={handleChange}>
            {employeeTags.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="wrfw-field">
          <label>Currently Working</label>
          <select name="currentlyWorking" value={fields.currentlyWorking} onChange={handleChange}>
            {currentlyWorkingOptions.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <button className="wrfw-filter-btn" type="submit">Filter</button>
      {submitted && <div className="wrfw-success-msg">Filters applied!</div>}
    </form>
  );
};

export default WorkRecordFilterWorkInfo;
