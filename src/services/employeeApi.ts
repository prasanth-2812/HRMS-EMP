import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear and redirect
      localStorage.removeItem('access');
      // Optionally clear refresh token if used
      // localStorage.removeItem('refresh');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Create Employee (supports FormData for file upload)
export const createEmployee = (data: any) => {
  // If FormData, set content-type automatically
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return api.post('/employee/employees/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
};

// ...other endpoints as needed

export default api;
