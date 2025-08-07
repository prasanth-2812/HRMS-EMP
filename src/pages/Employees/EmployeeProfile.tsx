
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeById } from '../../services/employeeService';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();


  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load employee data.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="employee-profile">
      <div className="page-header">
        <h1 className="page-title">Employee Profile</h1>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
            Edit Profile
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg">
            Print
          </button>
        </div>
      </div>
      
      <div className="profile-content">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading employee data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : employee ? (
          <>
            {/* Basic Information */}
            <div className="profile-card bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-20 w-20">
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {employee.firstName?.[0]}{employee.lastName?.[0]}
                  </div>
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-lg text-gray-600">{employee.position}</p>
                  <p className="text-sm text-gray-500">Employee ID: {employee.employeeId}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                    employee.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{employee.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{employee.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">
                        {employee.address?.street}<br />
                        {employee.address?.city}, {employee.address?.state} {employee.address?.zipCode}<br />
                        {employee.address?.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-sm text-gray-900">{employee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Manager</label>
                      <p className="text-sm text-gray-900">{employee.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hire Date</label>
                      <p className="text-sm text-gray-900">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Salary</label>
                      <p className="text-sm text-gray-900">{employee.salary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Emergency Contact */}
            <div className="profile-card bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">{employee.emergencyContact?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-sm text-gray-900">{employee.emergencyContact?.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{employee.emergencyContact?.phone}</p>
                </div>
              </div>
            </div>
            {/* Quick Stats (static for now) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="stat-card bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Attendance Rate</h4>
                <p className="text-2xl font-bold text-green-600 mt-2">96.5%</p>
              </div>
              <div className="stat-card bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Leave Balance</h4>
                <p className="text-2xl font-bold text-blue-600 mt-2">18 days</p>
              </div>
              <div className="stat-card bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Performance Score</h4>
                <p className="text-2xl font-bold text-purple-600 mt-2">4.2/5</p>
              </div>
              <div className="stat-card bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Years of Service</h4>
                <p className="text-2xl font-bold text-orange-600 mt-2">1.5</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeProfile;
