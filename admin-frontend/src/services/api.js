// api.js
// Axios instance configurations with Authorization interceptors

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Detect active portal context
const isPortAdmin = window.location.port === '5174';
const isDomainAdmin = window.location.hostname.startsWith('admin.');
const isAdminPortal = isPortAdmin || isDomainAdmin;

const TOKEN_KEY = isAdminPortal ? 'admin_token' : 'customer_token';
const USER_KEY = isAdminPortal ? 'admin_user' : 'customer_user';
const LOGIN_PATH = isAdminPortal ? '/admin/login' : '/login';

// Inject Authorization Bearer token into requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle authentication validation errors (like expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials if token expires or is rejected
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = `${LOGIN_PATH}?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
