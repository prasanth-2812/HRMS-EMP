import apiClient from './authService';

// Types for Shift API
export interface Shift {
  id: number;
  shift: string;
  weekly_full_time: string;
  full_time: string;
  grace_time_id?: {
    id: number;
    name: string;
    is_active: boolean;
  };
  is_active: boolean;
  created_at: string;
  modified_at: string;
}

export interface ShiftsResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Shift[];
}

// API Functions
export const getAllShifts = async (): Promise<Shift[]> => {
  try {
    const response = await apiClient.get('/api/v1/base/employee-shift/');
    // Handle both paginated and non-paginated responses
    return response.data.results || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch shifts');
  }
};

export const getShiftById = async (id: number): Promise<Shift> => {
  try {
    const response = await apiClient.get(`/api/v1/base/employee-shift/${id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch shift');
  }
};