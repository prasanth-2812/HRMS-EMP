import apiClient from './authService';

// Types for Rotating Work Type Assign API
export interface RotatingWorkTypeAssign {
  id: number;
  current_work_type_name: string;
  next_work_type_name: string;
  rotating_work_type_name: string;
  created_at: string;
  is_active: boolean;
  start_date: string;
  next_change_date: string;
  based_on: string;
  rotate_after_day: number;
  rotate_every_weekend: string;
  rotate_every: string;
  additional_data: {
    next_work_type_index: number;
  };
  created_by: number;
  modified_by: number;
  employee_id: number;
  rotating_work_type_id: number;
  current_work_type: number;
  next_work_type: number;
  rotate: string;
}

export interface RotatingWorkTypeAssignsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RotatingWorkTypeAssign[];
}

export interface CreateRotatingWorkTypeAssignData {
  employee_id: number;
  rotating_work_type_id: number;
  start_date: string;
  based_on: string;
  rotate_after_day?: number;
  rotate_every_weekend?: string;
  rotate_every?: string;
}

export interface UpdateRotatingWorkTypeAssignData extends Partial<CreateRotatingWorkTypeAssignData> {
  is_active?: boolean;
  next_change_date?: string;
  additional_data?: {
    next_work_type_index: number;
  };
}

// API Functions
export const getRotatingWorkTypeAssigns = async (params?: Record<string, any>): Promise<RotatingWorkTypeAssignsResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/v1/base/rotating-worktype-assigns/${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating work type assigns');
  }
};

export const getRotatingWorkTypeAssignById = async (id: number): Promise<RotatingWorkTypeAssign> => {
  try {
    const response = await apiClient.get(`/api/v1/base/rotating-worktype-assigns/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating work type assign');
  }
};

export const createRotatingWorkTypeAssign = async (data: CreateRotatingWorkTypeAssignData): Promise<RotatingWorkTypeAssign> => {
  try {
    const response = await apiClient.post('/api/v1/base/rotating-worktype-assigns/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create rotating work type assign');
  }
};

export const updateRotatingWorkTypeAssign = async (id: number, data: UpdateRotatingWorkTypeAssignData): Promise<RotatingWorkTypeAssign> => {
  try {
    const response = await apiClient.put(`/api/v1/base/rotating-worktype-assigns/${id}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update rotating work type assign');
  }
};

export const deleteRotatingWorkTypeAssign = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/rotating-worktype-assigns/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete rotating work type assign');
  }
};