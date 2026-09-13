// adminApi.js
// Axios instance for the Admin portal.
// In development: Vite proxies /api → http://localhost:5000, so no CORS.
// In production: set VITE_API_URL to the deployed backend base URL.

import axios from 'axios';
import toast from 'react-hot-toast';

// Use relative path in dev (Vite proxy handles it).
// In production, VITE_API_URL must be set (e.g. https://api.framewala.com).
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/admin`
  : '/api/admin';

const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY  = 'admin_token';
const USER_KEY   = 'admin_user';
const LOGIN_PATH = '/login';

// ── Request: attach JWT ───────────────────────────────────────────────────────
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

// ── Response: central error handling ─────────────────────────────────────────
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // True network failure / backend not reachable
      toast.error('Cannot reach the server. Make sure the backend is running on port 5000.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      // If not on login page, clear session and redirect
      if (window.location.pathname !== LOGIN_PATH) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        toast.error('Session expired. Please log in again.');
        setTimeout(() => { window.location.href = LOGIN_PATH; }, 1000);
      }
      // On the login page: let the context handle the 401 message (no toast here)
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error('Access denied. Admin privileges required.');
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error('Resource not found.');
      return Promise.reject(error);
    }

    if (status === 400) {
      // Let the caller handle 400 — context will show a targeted message
      return Promise.reject(error);
    }

    if (status >= 500) {
      toast.error('Server error. Please try again in a moment.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default adminApi;
