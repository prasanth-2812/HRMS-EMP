import apiClient from './authService';

// Types for Rotating Shift Assign API
export interface RotatingShiftAssign {
  id: number;
  current_shift_name: string;
  next_shift_name: string;
  rotating_shift_name: string;
  created_at: string;
  is_active: boolean;
  start_date: string;
  next_change_date: string;
  based_on: string;
  rotate_after_day: number;
  rotate_every_weekend: string;
  rotate_every: string;
  additional_data: {
    next_shift_index: number;
  };
  created_by: number;
  modified_by: number;
  employee_id: number;
  rotating_shift_id: number;
  current_shift: number;
  next_shift: number;
  rotate: string;
}

export interface RotatingShiftAssignsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RotatingShiftAssign[];
}

export interface CreateRotatingShiftAssignData {
  employee_id: number;
  rotating_shift_id: number;
  start_date: string;
  based_on: string;
  rotate_after_day?: number;
  rotate_every_weekend?: string;
  rotate_every?: string;
}

export interface UpdateRotatingShiftAssignData extends Partial<CreateRotatingShiftAssignData> {
  is_active?: boolean;
  next_change_date?: string;
  additional_data?: {
    next_shift_index: number;
  };
}

// API Functions
export const getRotatingShiftAssigns = async (params?: Record<string, any>): Promise<RotatingShiftAssignsResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/v1/base/rotating-shift-assigns/${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating shift assigns');
  }
};

export const getRotatingShiftAssignById = async (id: number): Promise<RotatingShiftAssign> => {
  try {
    const response = await apiClient.get(`/api/v1/base/rotating-shift-assigns/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch rotating shift assign');
  }
};

export const createRotatingShiftAssign = async (data: CreateRotatingShiftAssignData): Promise<RotatingShiftAssign> => {
  try {
    const response = await apiClient.post('/api/v1/base/rotating-shift-assigns/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create rotating shift assign');
  }
};

export const updateRotatingShiftAssign = async (id: number, data: UpdateRotatingShiftAssignData): Promise<RotatingShiftAssign> => {
  try {
    const response = await apiClient.put(`/api/v1/base/rotating-shift-assigns/${id}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update rotating shift assign');
  }
};

export const deleteRotatingShiftAssign = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/rotating-shift-assigns/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete rotating shift assign');
  }
};