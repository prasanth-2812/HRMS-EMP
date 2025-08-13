import apiClient from './authService';

// Types for Work Type Requests API
export interface WorkTypeRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  work_type_name: string;
  previous_work_type_name: string | null;
  created_at: string;
  is_active: boolean;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_work_type: boolean;
  approved: boolean;
  canceled: boolean;
  work_type_changed: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  work_type_id: number;
  previous_work_type_id: number | null;
}

export interface WorkTypeRequestsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkTypeRequest[];
}

export interface CreateWorkTypeRequestData {
  employee_id: number;
  work_type_id: number;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_work_type: boolean;
}

export interface UpdateWorkTypeRequestData extends Partial<CreateWorkTypeRequestData> {
  approved?: boolean;
  canceled?: boolean;
}

// API Functions
export const getWorkTypeRequests = async (params?: Record<string, any>): Promise<WorkTypeRequestsResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/v1/base/worktype-requests/${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch work type requests');
  }
};

export const getWorkTypeRequestById = async (id: number): Promise<WorkTypeRequest> => {
  try {
    const response = await apiClient.get(`/api/v1/base/worktype-requests/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch work type request');
  }
};

export const createWorkTypeRequest = async (data: CreateWorkTypeRequestData): Promise<WorkTypeRequest> => {
  try {
    const response = await apiClient.post('/api/v1/base/worktype-requests/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create work type request');
  }
};

export const updateWorkTypeRequest = async (id: number, data: UpdateWorkTypeRequestData): Promise<WorkTypeRequest> => {
  try {
    const response = await apiClient.put(`/api/v1/base/worktype-requests/${id}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update work type request');
  }
};

export const deleteWorkTypeRequest = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/worktype-requests/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete work type request');
  }
};