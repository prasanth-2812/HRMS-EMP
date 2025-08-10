import React, { useState } from 'react';
import { createEmployee } from '../../services/employeeApi';

interface EmployeeCreateRequest {
  badge_id?: string;
  employee_first_name: string;
  employee_last_name?: string;
  employee_profile?: File | null;
  email: string;
  phone: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  qualification?: string;
  experience?: number;
  marital_status?: 'single' | 'married' | 'divorced';
  children?: number;
  emergency_contact?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
}

const initialState: EmployeeCreateRequest = {
  employee_first_name: '',
  email: '',
  phone: '',
  gender: 'male',
  marital_status: 'single',
};

interface EmployeeCreateFormProps {
  onSuccess?: () => void;
}

const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<EmployeeCreateRequest>(initialState);
  const [profile, setProfile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          data.append(key, value as any);
        }
      });
      if (profile) {
        data.append('employee_profile', profile);
      }
  await createEmployee(data);
  setSuccess('Employee created successfully!');
  setForm(initialState);
  setProfile(null);
  if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded shadow" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="text-xl font-bold mb-4">Create Employee</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-600">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">First Name *</label>
          <input name="employee_first_name" value={form.employee_first_name} onChange={handleChange} required className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input name="employee_last_name" value={form.employee_last_name || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Phone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Badge ID</label>
          <input name="badge_id" value={form.badge_id || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Profile Image</label>
          <input name="employee_profile" type="file" accept="image/*" onChange={handleFileChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="oh-input w-full">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Marital Status</label>
          <select name="marital_status" value={form.marital_status} onChange={handleChange} className="oh-input w-full">
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">DOB</label>
          <input name="dob" type="date" value={form.dob || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Qualification</label>
          <input name="qualification" value={form.qualification || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Experience (years)</label>
          <input name="experience" type="number" value={form.experience || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Children</label>
          <input name="children" type="number" value={form.children || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Emergency Contact</label>
          <input name="emergency_contact" value={form.emergency_contact || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Emergency Contact Name</label>
          <input name="emergency_contact_name" value={form.emergency_contact_name || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Emergency Contact Relation</label>
          <input name="emergency_contact_relation" value={form.emergency_contact_relation || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Address</label>
          <textarea name="address" value={form.address || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Country</label>
          <input name="country" value={form.country || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">State</label>
          <input name="state" value={form.state || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input name="city" value={form.city || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
        <div>
          <label className="block mb-1">Zip</label>
          <input name="zip" value={form.zip || ''} onChange={handleChange} className="oh-input w-full" />
        </div>
      </div>
      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
};

export default EmployeeCreateForm;
