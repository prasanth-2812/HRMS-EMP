import axios from 'axios';

// Set API base URL for backend - using the user's specific backend URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}); 

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('backendData');
      
      // Redirect to login if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface LoginResponse {
  access: string;
  employee: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  };
  face_detection: boolean;
  face_detection_image: string | null;
  geo_fencing: boolean;
  company_id: number;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Login API
export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/api/v1/auth/login/', {
      username,
      password,
    });
    // Store tokens in localStorage for axiosInstance.js usage
    if (response.data.access) {
      localStorage.setItem('access', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refresh', response.data.refresh);
    }
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Login failed';
    if (error.response) {
      if (error.response.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.status === 404) {
        errorMessage = 'Login endpoint not found. Please check the API URL.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check if the backend is running at http://127.0.0.1:8000';
    } else {
      errorMessage = error.message || 'Network error';
    }
    throw new Error(errorMessage);
  }
};

// Register API
export const registerApi = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
}): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post('/api/v1/auth/register/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Registration failed');
  }
};

// Forgot Password API (by email)
export const forgotPasswordApi = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await apiClient.post('/api/v1/auth/forgot-password/', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Password reset request failed');
  }
};

// Reset Password API
export const resetPasswordApi = async (data: {
  token: string;
  password: string;
  password2: string;
}): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiClient.post('/api/v1/auth/password-reset/confirm/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Password reset failed');
  }
};

// Logout API
export const logoutApi = async (): Promise<void> => {
  try {
    await apiClient.post('/api/v1/auth/logout/');
  } catch (error: any) {
    console.error('Logout error:', error);
  }
};

// Get user profile API
export const getUserProfileApi = async () => {
  try {
    const response = await apiClient.get('/api/v1/auth/user/');
    return response.data;
  } catch (error: any) {
    // If user profile endpoint doesn't exist, try to get employee data
    try {
      const response = await apiClient.get('/api/v1/auth/employee/');
      return response.data;
    } catch (secondError: any) {
      throw new Error('Failed to get user profile');
    }
  }
};

// Validate token API
export const validateTokenApi = async () => {
  try {
    const response = await apiClient.post('/api/v1/auth/token/verify/', {});
    return response.data;
  } catch (error: any) {
    throw new Error('Token validation failed');
  }
};

export default apiClient;
