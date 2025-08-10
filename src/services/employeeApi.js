import api from './axiosInstance';

// GET example
export const getEmployees = async () => {
  const response = await api.get('/employee/employees/');
  return response.data;
};

// POST example
export const createEmployee = async (employeeData) => {
  const response = await api.post('/employee/employees/', employeeData);
  return response.data;
};
