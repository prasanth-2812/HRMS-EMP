import React, { useState, useEffect } from 'react';
import axios from '../../services/axiosInstance';
import { toast } from 'react-toastify';

const EmployeeDetailCard = ({ employeeId, onClose, onUpdated }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch employee data when component mounts or employeeId changes
  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    axios.get(`/employee/employees/${employeeId}/`)
      .then(res => {
        setForm(res.data);
      })
      .catch(err => {
        toast.error('Failed to fetch employee details');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`/employee/employees/${employeeId}/`, form);
      toast.success('Employee updated successfully');
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (err) {
      toast.error('Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Example fields, adjust as needed */}
      <div>
        <label>First Name</label>
        <input name="employee_first_name" value={form.employee_first_name || ''} onChange={handleChange} />
      </div>
      <div>
        <label>Last Name</label>
        <input name="employee_last_name" value={form.employee_last_name || ''} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={form.email || ''} onChange={handleChange} />
      </div>
      {/* Add more fields as needed */}
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EmployeeDetailCard;
