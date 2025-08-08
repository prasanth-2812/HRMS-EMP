import { apiClient } from '../utils/api';

// Transform employee data from snake_case to camelCase
const transformEmployeeData = (employee: any) => {
  return {
    id: employee.id,
    employeeId: employee.badge_id,
    firstName: employee.employee_first_name,
    lastName: employee.employee_last_name,
    email: employee.email,
    department: employee.department_name,
    position: employee.job_position_name,
    status: employee.is_active ? 'online' : 'offline',
    hireDate: employee.employee_work_info?.date_joining,
    phone: employee.phone,
    avatar: employee.employee_profile,
    country: employee.country,
    state: employee.state,
    city: employee.city,
    zip: employee.zip,
    dob: employee.dob,
    gender: employee.gender,
    qualification: employee.qualification,
    experience: employee.experience,
    maritalStatus: employee.marital_status,
    children: employee.children,
    emergencyContact: employee.emergency_contact,
    emergencyContactName: employee.emergency_contact_name,
    emergencyContactRelation: employee.emergency_contact_relation,
  };
};

// Get all employees
export const getAllEmployees = async () => {
  const response: any = await apiClient.get('/api/v1/employee/employees/');
  if (response?.results) {
    return response.results.map(transformEmployeeData);
  }
  return [];
};

// Get employee by ID
export const getEmployeeById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employees/${id}/`);
  return transformEmployeeData(response);
};

// Create employee
export const createEmployee = async (data: any) => {
  const payload = {
    employee_first_name: data.firstName,
    employee_last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    state: data.state,
    city: data.city,
    zip: data.zip,
    dob: data.dob,
    gender: data.gender,
    qualification: data.qualification,
    experience: data.experience,
    marital_status: data.maritalStatus,
    children: data.children,
    emergency_contact: data.emergencyContact,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_relation: data.emergencyContactRelation,
  };
  const response = await apiClient.post('/api/v1/employee/employees/', payload);
  return transformEmployeeData(response);
};

// Update employee
export const updateEmployee = async (id: string | number, data: any) => {
  const payload = {
    employee_first_name: data.firstName,
    employee_last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    state: data.state,
    city: data.city,
    zip: data.zip,
    dob: data.dob,
    gender: data.gender,
    qualification: data.qualification,
    experience: data.experience,
    marital_status: data.maritalStatus,
    children: data.children,
    emergency_contact: data.emergencyContact,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_relation: data.emergencyContactRelation,
  };
  const response = await apiClient.put(`/api/v1/employee/employees/${id}/`, payload);
  return transformEmployeeData(response);
};

// Delete employee
export const deleteEmployee = async (id: string | number) => {
  return await apiClient.delete(`/api/v1/employee/employees/${id}/`);
};

// Get all employee types
export const getAllEmployeeTypes = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-type/');
  return response;
};

// Get employee type by ID
export const getEmployeeTypeById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employee-type/${id}`);
  return response;
};



// Employee Bank Details CRUD
export const getAllEmployeeBankDetails = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-bank-details/');
  return response;
};
export const getEmployeeBankDetailById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employee-bank-details/${id}/`);
  return response;
};
export const createEmployeeBankDetail = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/employee-bank-details/', data);
  return response;
};
export const updateEmployeeBankDetail = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/employee-bank-details/${id}/`, data);
  return response;
};
export const deleteEmployeeBankDetail = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/employee-bank-details/${id}/`);
  return response;
};

// Employee Work Information CRUD
export const getAllEmployeeWorkInfo = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-work-information/');
  return response;
};
export const getEmployeeWorkInfoById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/employee-work-information/${id}/`);
  return response;
};
export const createEmployeeWorkInfo = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/employee-work-information/', data);
  return response;
};
export const updateEmployeeWorkInfo = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/employee-work-information/${id}/`, data);
  return response;
};
export const deleteEmployeeWorkInfo = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/employee-work-information/${id}/`);
  return response;
};

// Work Info Export/Import
export const exportEmployeeWorkInfo = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-work-info-export/');
  return response;
};
export const importEmployeeWorkInfo = async () => {
  const response = await apiClient.get('/api/v1/employee/employee-work-info-import/');
  return response;
};

// Bulk Update
export const bulkUpdateEmployees = async (data: any) => {
  const response = await apiClient.put('/api/v1/employee/employee-bulk-update/', data);
  return response;
};
// Disciplinary Action CRUD
export const getAllDisciplinaryActions = async () => {
  const response = await apiClient.get('/api/v1/employee/disciplinary-action/');
  return response;
};
export const getDisciplinaryActionById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/disciplinary-action/${id}/`);
  return response;
};
export const createDisciplinaryAction = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/disciplinary-action/', data);
  return response;
};
export const updateDisciplinaryAction = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/disciplinary-action/${id}/`, data);
  return response;
};
export const deleteDisciplinaryAction = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/disciplinary-action/${id}/`);
  return response;
};

// Disciplinary Action Type CRUD
export const getAllDisciplinaryActionTypes = async () => {
  const response = await apiClient.get('/api/v1/employee/disciplinary-action-type/');
  return response;
};
export const getDisciplinaryActionTypeById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/disciplinary-action-type/${id}/`);
  return response;
};
export const createDisciplinaryActionType = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/disciplinary-action-type/', data);
  return response;
};
export const updateDisciplinaryActionType = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/disciplinary-action-type/${id}/`, data);
  return response;
};
export const deleteDisciplinaryActionType = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/disciplinary-action-type/${id}/`);
  return response;
};

// Policies CRUD
export const getAllPolicies = async () => {
  const response = await apiClient.get('/api/v1/employee/policies/');
  return response;
};
export const getPolicyById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/policies/${id}/`);
  return response;
};
export const createPolicy = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/policies/', data);
  return response;
};
export const updatePolicy = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/policies/${id}/`, data);
  return response;
};
export const deletePolicy = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/policies/${id}/`);
  return response;
};

// Document Request CRUD
export const getAllDocumentRequests = async () => {
  const response = await apiClient.get('/api/v1/employee/document-request/');
  return response;
};
export const getDocumentRequestById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/document-request/${id}/`);
  return response;
};
export const createDocumentRequest = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/document-request/', data);
  return response;
};
export const updateDocumentRequest = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/document-request/${id}/`, data);
  return response;
};
export const deleteDocumentRequest = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/document-request/${id}/`);
  return response;
};

// Bulk Approve/Reject Document Requests
export const bulkApproveRejectDocuments = async (data: any) => {
  const response = await apiClient.put('/api/v1/employee/document-bulk-approve-reject/', data);
  return response;
};
export const approveRejectDocumentRequest = async (id: string | number, status: string) => {
  const response = await apiClient.post(`/api/v1/employee/document-request-approve-reject/${id}/${status}/`);
  return response;
};

// Documents CRUD
export const getAllDocuments = async () => {
  const response = await apiClient.get('/api/v1/employee/documents/');
  return response;
};
export const getDocumentById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/employee/documents/${id}/`);
  return response;
};
export const createDocument = async (data: any) => {
  const response = await apiClient.post('/api/v1/employee/documents/', data);
  return response;
};
export const updateDocument = async (id: string | number, data: any) => {
  const response = await apiClient.put(`/api/v1/employee/documents/${id}/`, data);
  return response;
};
export const deleteDocument = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/employee/documents/${id}/`);
  return response;
};

// Bulk Archive/Unarchive
export const bulkArchiveEmployees = async (isActive: boolean, data: any) => {
  const response = await apiClient.post(`/api/v1/employee/employee-bulk-archive/${isActive}/`, data);
  return response;
};
export const archiveEmployee = async (id: string | number, isActive: boolean) => {
  const response = await apiClient.post(`/api/v1/employee/employee-archive/${id}/${isActive}/`);
  return response;
};


export const getEmployeeSelector = async () => {
  return await apiClient.get('/api/v1/employee/employee-selector/');
};

export const managerCheck = async () => {
  return await apiClient.get('/api/v1/employee/manager-check/');
};

