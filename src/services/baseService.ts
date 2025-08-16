import { apiClient } from '../utils/api';

// Type definitions based on API documentation
export interface Company {
  id?: number;
  company: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  icon?: string;
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface Department {
  id?: number;
  department: string;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface JobPosition {
  id?: number;
  job_position: string;
  department_id: number;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface JobRole {
  id?: number;
  job_position_id: number;
  job_role?: string;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface WorkType {
  id?: number;
  work_type: string;
  description?: string;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface RotatingWorkType {
  id?: number;
  name: string;
  description?: string;
  work_type_ids: number[];
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface EmployeeShift {
  id?: number;
  employee_id: number;
  shift_start_time: string;
  shift_end_time: string;
  minimum_hour: number;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface RotatingShift {
  id?: number;
  name: string;
  shift1: number;
  shift2: number;
  additional_shifts?: number[];
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

export interface EmployeeShiftSchedule {
  id?: number;
  day: string;
  shift_id: number;
  start_time: string;
  end_time: string;
  minimum_working_hour: number;
  company_id?: number[];
  created_at?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: boolean;
}

// Response types for paginated endpoints
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Company API functions
export const getCompanies = async (): Promise<PaginatedResponse<Company>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Company>>('/api/v1/base/companies/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch companies');
  }
};

export const getCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await apiClient.get<Company>(`/api/v1/base/companies/${id}/`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch company');
  }
};

export const createCompany = async (data: Omit<Company, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active'> | FormData): Promise<Company> => {
  try {
    const response = await apiClient.post<Company>('/api/v1/base/companies/', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create company');
  }
};

export const updateCompany = async (id: number, data: Omit<Company, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active'> | FormData): Promise<Company> => {
  try {
    const response = await apiClient.put<Company>(`/api/v1/base/companies/${id}/`, data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update company');
  }
};

export const deleteCompany = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/companies/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete company');
  }
};

// Department API functions
export const getDepartments = async (): Promise<PaginatedResponse<Department>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Department>>('/api/v1/base/departments/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch departments');
  }
};

export const getDepartmentById = async (id: number): Promise<Department> => {
  try {
    const response = await apiClient.get<Department>(`/api/v1/base/departments/${id}/`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch department');
  }
};

export const createDepartment = async (data: Omit<Department, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<Department> => {
  try {
    const formData = new FormData();
    formData.append('department', data.department);
    const response = await apiClient.post<Department>('/api/v1/base/departments/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create department');
  }
};

export const updateDepartment = async (id: number, data: Omit<Department, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<Department> => {
  try {
    const formData = new FormData();
    formData.append('department', data.department);
    const response = await apiClient.put<Department>(`/api/v1/base/departments/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update department');
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/departments/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete department');
  }
};

// Job Position API functions
export const getJobPositions = async (): Promise<PaginatedResponse<JobPosition>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<JobPosition>>('/api/v1/base/job-positions/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job positions');
  }
};

export const getJobPositionById = async (id: number): Promise<JobPosition> => {
  try {
    const response = await apiClient.get<JobPosition>(`/api/v1/base/job-positions/${id}/`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job position');
  }
};

export const createJobPosition = async (data: Omit<JobPosition, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<JobPosition> => {
  try {
    const formData = new FormData();
    formData.append('job_position', data.job_position);
    formData.append('department_id', data.department_id.toString());
    const response = await apiClient.post<JobPosition>('/api/v1/base/job-positions/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create job position');
  }
};

export const updateJobPosition = async (id: number, data: Omit<JobPosition, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<JobPosition> => {
  try {
    const formData = new FormData();
    formData.append('job_position', data.job_position);
    formData.append('department_id', data.department_id.toString());
    const response = await apiClient.put<JobPosition>(`/api/v1/base/job-positions/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update job position');
  }
};

// Job Role API functions
export const getJobRoles = async (): Promise<PaginatedResponse<JobRole>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<JobRole>>('/api/v1/base/job-roles/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job roles');
  }
};

export const getJobRoleById = async (id: number): Promise<JobRole> => {
  try {
    const response = await apiClient.get<JobRole>(`/api/v1/base/job-roles/${id}/`);     
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job role');
  }
};

export const createJobRole = async (data: Omit<JobRole, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<JobRole> => {
  try {
    const formData = new FormData();
    formData.append('job_position_id', data.job_position_id.toString());
    if (data.job_role) {
      formData.append('job_role', data.job_role);
    }
    const response = await apiClient.post<JobRole>('/api/v1/base/job-roles/', formData);    
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create job role');
  }
};

export const updateJobRole = async (id: number, data: Omit<JobRole, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<JobRole> => {
  try {
    const formData = new FormData();
    formData.append('job_position_id', data.job_position_id.toString());
    if (data.job_role) {
      formData.append('job_role', data.job_role);
    }
    const response = await apiClient.put<JobRole>(`/api/v1/base/job-roles/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update job role');
  }
};

export const deleteJobRole = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/job-roles/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete job role');
  }
};

export const deleteJobPosition = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/job-positions/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete job position');
  }
};

// WorkType API functions
export const getWorkTypes = async (): Promise<PaginatedResponse<WorkType>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<WorkType>>('/api/v1/base/work-types/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch work types');
  }
};

export const createWorkType = async (data: Omit<WorkType, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<WorkType> => {
  try {
    const formData = new FormData();
    formData.append('work_type', data.work_type);
    if (data.description) {
      formData.append('description', data.description);
    }
    const response = await apiClient.post<WorkType>('/api/v1/base/work-types/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create work type');
  }
};

export const updateWorkType = async (id: number, data: Omit<WorkType, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<WorkType> => {
  try {
    const formData = new FormData();
    formData.append('work_type', data.work_type);
    if (data.description) {
      formData.append('description', data.description);
    }
    const response = await apiClient.put<WorkType>(`/api/v1/base/work-types/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update work type');
  }
};

export const deleteWorkType = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/work-types/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete work type');
  }
};

// RotatingWorkType API functions
export const getRotatingWorkTypes = async (): Promise<PaginatedResponse<RotatingWorkType>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<RotatingWorkType>>('/api/v1/base/rotating-work-types/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating work types');
  }
};

export const createRotatingWorkType = async (data: Omit<RotatingWorkType, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<RotatingWorkType> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    data.work_type_ids.forEach(id => {
      formData.append('work_type_ids', id.toString());
    });
    const response = await apiClient.post<RotatingWorkType>('/api/v1/base/rotating-work-types/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create rotating work type');
  }
};

export const updateRotatingWorkType = async (id: number, data: Omit<RotatingWorkType, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<RotatingWorkType> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    data.work_type_ids.forEach(id => {
      formData.append('work_type_ids', id.toString());
    });
    const response = await apiClient.put<RotatingWorkType>(`/api/v1/base/rotating-work-types/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update rotating work type');
  }
};

export const deleteRotatingWorkType = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/rotating-work-types/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete rotating work type');
  }
};

// EmployeeShift API functions
export const getEmployeeShifts = async (): Promise<PaginatedResponse<EmployeeShift>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<EmployeeShift>>('/api/v1/base/employee-shifts/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee shifts');
  }
};

export const createEmployeeShift = async (data: Omit<EmployeeShift, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<EmployeeShift> => {
  try {
    const formData = new FormData();
    formData.append('employee_id', data.employee_id.toString());
    formData.append('shift_start_time', data.shift_start_time);
    formData.append('shift_end_time', data.shift_end_time);
    formData.append('minimum_hour', data.minimum_hour.toString());
    const response = await apiClient.post<EmployeeShift>('/api/v1/base/employee-shifts/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create employee shift');
  }
};

export const updateEmployeeShift = async (id: number, data: Omit<EmployeeShift, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<EmployeeShift> => {
  try {
    const formData = new FormData();
    formData.append('employee_id', data.employee_id.toString());
    formData.append('shift_start_time', data.shift_start_time);
    formData.append('shift_end_time', data.shift_end_time);
    formData.append('minimum_hour', data.minimum_hour.toString());
    const response = await apiClient.put<EmployeeShift>(`/api/v1/base/employee-shifts/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update employee shift');
  }
};

export const deleteEmployeeShift = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/employee-shifts/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete employee shift');
  }
};

// RotatingShift API functions
export const getRotatingShifts = async (): Promise<PaginatedResponse<RotatingShift>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<RotatingShift>>('/api/v1/base/rotating-shifts/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating shifts');
  }
};

export const createRotatingShift = async (data: Omit<RotatingShift, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<RotatingShift> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('shift1', data.shift1.toString());
    formData.append('shift2', data.shift2.toString());
    if (data.additional_shifts && data.additional_shifts.length > 0) {
      data.additional_shifts.forEach(shift => {
        formData.append('additional_shifts', shift.toString());
      });
    }
    const response = await apiClient.post<RotatingShift>('/api/v1/base/rotating-shifts/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create rotating shift');
  }
};

export const updateRotatingShift = async (id: number, data: Omit<RotatingShift, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<RotatingShift> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('shift1', data.shift1.toString());
    formData.append('shift2', data.shift2.toString());
    if (data.additional_shifts && data.additional_shifts.length > 0) {
      data.additional_shifts.forEach(shift => {
        formData.append('additional_shifts', shift.toString());
      });
    }
    const response = await apiClient.put<RotatingShift>(`/api/v1/base/rotating-shifts/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update rotating shift');
  }
};

export const deleteRotatingShift = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/rotating-shifts/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete rotating shift');
  }
};

// Employee Shift Schedule API functions
export const getEmployeeShiftSchedules = async (): Promise<PaginatedResponse<EmployeeShiftSchedule>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<EmployeeShiftSchedule>>('/api/v1/base/employee-shift-schedules/');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee shift schedules');
  }
};

export const getEmployeeShiftScheduleById = async (id: number): Promise<EmployeeShiftSchedule> => {
  try {
    const response = await apiClient.get<EmployeeShiftSchedule>(`/api/v1/base/employee-shift-schedules/${id}/`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee shift schedule');
  }
};

export const createEmployeeShiftSchedule = async (data: Omit<EmployeeShiftSchedule, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<EmployeeShiftSchedule> => {
  try {
    const formData = new FormData();
    formData.append('day', data.day);
    formData.append('shift_id', data.shift_id.toString());
    formData.append('start_time', data.start_time);
    formData.append('end_time', data.end_time);
    formData.append('minimum_working_hour', data.minimum_working_hour.toString());
    const response = await apiClient.post<EmployeeShiftSchedule>('/api/v1/base/employee-shift-schedules/', formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create employee shift schedule');
  }
};

export const updateEmployeeShiftSchedule = async (id: number, data: Omit<EmployeeShiftSchedule, 'id' | 'created_at' | 'created_by' | 'modified_by' | 'is_active' | 'company_id'>): Promise<EmployeeShiftSchedule> => {
  try {
    const formData = new FormData();
    formData.append('day', data.day);
    formData.append('shift_id', data.shift_id.toString());
    formData.append('start_time', data.start_time);
    formData.append('end_time', data.end_time);
    formData.append('minimum_working_hour', data.minimum_working_hour.toString());
    const response = await apiClient.put<EmployeeShiftSchedule>(`/api/v1/base/employee-shift-schedules/${id}/`, formData);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update employee shift schedule');
  }
};

export const deleteEmployeeShiftSchedule = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/employee-shift-schedules/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete employee shift schedule');
  }
};