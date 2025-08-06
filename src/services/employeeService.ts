import apiClient from './authService';

// Get all employees
export const getAllEmployees = async () => {
  const response = await apiClient.get('/api/v1/employee/employees/');
  return response.data;
};

// Get employee by ID
export const getEmployeeById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employees/${id}/`);
  return response.data;
};

// Create employee
export const createEmployee = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/employees/', data);
  return response.data;
};

// Update employee
export const updateEmployee = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/employees/${id}/`, data);
  return response.data;
};

// Get all employee types
export const getAllEmployeeTypes = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-type/');
  return response.data;
};

// Get employee type by ID
export const getEmployeeTypeById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employee-type/${id}`);
  return response.data;
};

// Get employee list (custom endpoint)
export const getEmployeeList = async () => {
  const response = await apiClient.get('/api/v1/employee/list/employees/');
  return response.data;
};
