import apiClient from './authService';

// Types for Shift Requests API
export interface ShiftRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  shift_name: string;
  previous_shift_name: string | null;
  created_at: string;
  is_active: boolean;
  requested_date: string;
  reallocate_approved: boolean;
  reallocate_canceled: boolean;
  requested_till: string;
  description: string;
  is_permanent_shift: boolean;
  approved: boolean;
  canceled: boolean;
  shift_changed: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number;
  previous_shift_id: number | null;
  reallocate_to: number | null;
}

export interface ShiftRequestsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShiftRequest[];
}

export interface CreateShiftRequestData {
  employee_id: number;
  shift_id: number;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_shift: boolean;
}

export interface UpdateShiftRequestData extends Partial<CreateShiftRequestData> {
  approved?: boolean;
  canceled?: boolean;
  reallocate_approved?: boolean;
  reallocate_canceled?: boolean;
  reallocate_to?: number;
}

// API Functions
export const getShiftRequests = async (params?: Record<string, any>): Promise<ShiftRequestsResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/v1/base/shift-requests/${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch shift requests');
  }
};

export const getShiftRequestById = async (id: number): Promise<ShiftRequest> => {
  try {
    const response = await apiClient.get(`/api/v1/base/shift-requests/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch shift request');
  }
};

export const createShiftRequest = async (data: CreateShiftRequestData): Promise<ShiftRequest> => {
  try {
    const response = await apiClient.post('/api/v1/base/shift-requests/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to create shift request');
  }
};

export const updateShiftRequest = async (id: number, data: UpdateShiftRequestData): Promise<ShiftRequest> => {
  try {
    const response = await apiClient.put(`/api/v1/base/shift-requests/${id}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to update shift request');
  }
};

export const deleteShiftRequest = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/base/shift-requests/${id}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to delete shift request');
  }
};