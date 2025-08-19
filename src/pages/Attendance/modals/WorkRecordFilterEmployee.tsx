import React, { useState } from "react";
import "./WorkRecordFilterEmployee.css";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  gender: "",
};

const genders = [
  { label: "Select Gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]*$/;

const WorkRecordFilterEmployee: React.FC = () => {
  const [fields, setFields] = useState(initialValues);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setSubmitted(false);
  };

  const validate = () => {
    let errs: { [k: string]: string } = {};
    if (fields.email && !emailRegex.test(fields.email)) {
      errs.email = "Enter a valid email";
    }
    if (fields.phone && !phoneRegex.test(fields.phone)) {
      errs.phone = "Enter valid digits only";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length === 0) {
      // Submit or filter logic here
      alert("Filter applied:\n" + JSON.stringify(fields, null, 2));
      // Optionally reset the form:
      // setFields(initialValues);
    }
  };

  return (
    <form className="wrfe-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="wrfe-section-title">Employee</div>
      <div className="wrfe-form-row">
        <div className="wrfe-field">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            value={fields.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
        </div>
        <div className="wrfe-field">
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            value={fields.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </div>
      </div>
      <div className="wrfe-form-row">
        <div className="wrfe-field">
          <label>Email</label>
          <input
            name="email"
            type="text"
            value={fields.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          {errors.email && (
            <span className="wrfe-error">{errors.email}</span>
          )}
        </div>
        <div className="wrfe-field">
          <label>Phone</label>
          <input
            name="phone"
            type="text"
            value={fields.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            maxLength={15}
          />
          {errors.phone && (
            <span className="wrfe-error">{errors.phone}</span>
          )}
        </div>
      </div>
      <div className="wrfe-form-row">
        <div className="wrfe-field">
          <label>Country</label>
          <input
            name="country"
            type="text"
            value={fields.country}
            onChange={handleChange}
            placeholder="Enter country"
          />
        </div>
        <div className="wrfe-field">
          <label>Gender</label>
          <select
            name="gender"
            value={fields.gender}
            onChange={handleChange}
          >
            {genders.map((g) => (
              <option value={g.value} key={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="wrfe-btn-row">
        <button className="wrfe-filter-btn" type="submit">
          Filter
        </button>
      </div>
      {submitted && Object.keys(errors).length === 0 && (
        <div className="wrfe-success-msg">Filters applied!</div>
      )}
    </form>
  );
};

export default WorkRecordFilterEmployee;
