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
    
    // Check if we're dealing with FormData
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Merge additional headers if provided
    if (options.headers && !isFormData) {
      config.headers = {
        ...config.headers,
        ...options.headers,
      };
    }

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
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      headers: isFormData ? {} : undefined, // Let browser set Content-Type for FormData
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      headers: isFormData ? {} : undefined, // Let browser set Content-Type for FormData
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
    list: '/employees',
    create: '/employees',
    get: (id: string) => `/employees/${id}`,
    update: (id: string) => `/employees/${id}`,
    delete: (id: string) => `/employees/${id}`,
  },
  departments: {
    list: '/departments',
    create: '/departments',
    get: (id: string) => `/departments/${id}`,
    update: (id: string) => `/departments/${id}`,
    delete: (id: string) => `/departments/${id}`,
  },
  // Add more endpoints as needed
};
