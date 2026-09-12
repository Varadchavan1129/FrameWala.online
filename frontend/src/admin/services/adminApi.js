// adminApi.js
// Axios instance for Admin portal, points to /api/admin

import axios from 'axios';
import toast from 'react-hot-toast';

const adminApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';
const LOGIN_PATH = '/admin/login';

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (window.location.pathname !== LOGIN_PATH) {
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = `${LOGIN_PATH}?expired=true`;
          }, 1000);
        }
      } else if (error.response.status === 403) {
        toast.error('Access forbidden: Admin privileges required.');
      } else if (error.response.status === 404) {
        toast.error('Resource not found.');
      } else if (error.response.status === 400) {
        // Validation errors
        toast.error(error.response.data.message || 'Validation Error.');
      } else if (error.response.status >= 500) {
        toast.error('Server encountered an error. Please try again.');
      }
    } else {
      toast.error('Network Error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default adminApi;
