const API_BASE_URL = (window as any).env?.REACT_APP_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Set up headers - merge provided headers with defaults
    const config: RequestInit = {
      headers: {
        ...(options.headers || {}),
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const options: RequestInit = {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    };
    
    // For FormData, don't set headers to let browser set Content-Type automatically
    // For JSON data, let the request method handle default headers
    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }
    
    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  employees: {
    list: '/api/v1/employee/employees/',
    create: '/api/v1/employee/employees/',
    get: (id: string) => `/api/v1/employee/employees/${id}/`,
    update: (id: string) => `/api/v1/employee/employees/${id}/`,
    delete: (id: string) => `/api/v1/employee/employees/${id}/`,
  },
  departments: {
    list: '/departments',
    create: '/departments',
    get: (id: string) => `/departments/${id}`,
    update: (id: string) => `/departments/${id}`,
    delete: (id: string) => `/departments/${id}`,
  },
  attendance: {
      list: '/api/v1/attendance/attendance/',
      todayAttendance: '/api/v1/attendance/today-attendance/',
      offlineEmployees: {
        count: '/api/v1/attendance/offline-employees/count/',
        list: '/api/v1/attendance/offline-employees/list/',
      },
      requests: {
        list: '/api/v1/attendance/attendance-request/',
        create: '/api/v1/attendance/attendance-request/',
        get: (id: string) => `/api/v1/attendance/attendance-request/${id}/`,
        update: (id: string) => `/api/v1/attendance/attendance-request/${id}/`,
        delete: (id: string) => `/api/v1/attendance/attendance-request/${id}/`,
      },
      hourAccount: {
        list: '/api/v1/attendance/attendance-hour-account/',
        create: '/api/v1/attendance/attendance-hour-account/',
        get: (id: string) => `/api/v1/attendance/attendance-hour-account/${id}/`,
        update: (id: string) => `/api/v1/attendance/attendance-hour-account/${id}/`,
        delete: (id: string) => `/api/v1/attendance/attendance-hour-account/${id}/`,
      },
      activity: {
        list: '/api/v1/attendance/attendance-activity/',
      },
      lateComeEarlyOut: {
        list: '/api/v1/attendance/late-come-early-out-view/',
        delete: (id: string) => `/api/v1/attendance/late-come-early-out-view/${id}/`,
      },
      permissionCheck: {
        attendance: '/api/v1/attendance/permission-check/attendance',
      },
      offlineEmployeeMailSend: '/api/v1/attendance/offline-employee-mail-send',
    },
  // Add more endpoints as needed
};
