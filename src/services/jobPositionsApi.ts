import apiClient from './authService';

// Types for Job Positions API
export interface JobPosition {
  id: number;
  created_at: string;
  is_active: boolean;
  title: string;
  job_position: string;
  created_by: number;
  modified_by: number;
  department_id: number;
  company_id: number[];
}

export interface JobPositionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPosition[];
}

export interface CreateJobPositionData {
  title: string;
  job_position: string;
  department_id: number;
  company_id?: number[];
}

export interface UpdateJobPositionData extends Partial<CreateJobPositionData> {
  is_active?: boolean;
}

// API Functions
export const getJobPositions = async (params?: Record<string, any>): Promise<JobPositionsResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/v1/base/job-positions/${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job positions');
  }
};

export const getJobPositionById = async (id: number): Promise<JobPosition> => {
  try {
    const response = await apiClient.get(`/api/v1/base/job-positions/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch job position');
  }
};

export const createJobPosition = async (data: CreateJobPositionData): Promise<JobPosition> => {
  try {
    const response = await apiClient.post('/api/v1/base/job-positions/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create job position');
  }
};

export const updateJobPosition = async (id: number, data: UpdateJobPositionData): Promise<JobPosition> => {
  try {
    const response = await apiClient.put(`/api/v1/base/job-positions/${id}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update job position');
  }
};

export const deleteJobPosition = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/job-positions/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete job position');
  }
};