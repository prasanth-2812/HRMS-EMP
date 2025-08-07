
import { apiClient } from '../utils/api';

// Get all employees
export const getAllEmployees = async () => {
  return await apiClient.get('/api/v1/employee/employees/');
};

// Get employee by ID
export const getEmployeeById = async (id: string | number) => {
  return await apiClient.get(`/api/v1/employee/employees/${id}/`);
};

// Create employee
export const createEmployee = async (data: any) => {
  return await apiClient.post('/api/v1/employee/employees/', data);
};

// Update employee
export const updateEmployee = async (id: string | number, data: any) => {
  return await apiClient.put(`/api/v1/employee/employees/${id}/`, data);
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
