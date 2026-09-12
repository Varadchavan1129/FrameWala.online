// adminApi.js
// Axios instance for Admin portal — all requests target /api/admin on the backend

import axios from 'axios';
import toast from 'react-hot-toast';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const adminApi = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const TOKEN_KEY = 'admin_token';
const USER_KEY  = 'admin_user';
const LOGIN_PATH = '/login'; // root-relative in the standalone admin app

// ── Request interceptor: attach JWT ──────────────────────────────────────────
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

// ── Response interceptor: handle errors centrally ────────────────────────────
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network-level failure (backend not reachable, CORS preflight blocked, etc.)
      toast.error('Cannot reach the server. Make sure the backend is running on port 5000.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Only auto-redirect if NOT already on the login page
      if (window.location.pathname !== LOGIN_PATH) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        toast.error('Session expired. Please log in again.');
        setTimeout(() => { window.location.href = LOGIN_PATH; }, 1000);
      }
      // Do NOT show a generic toast here — the login page handles its own messaging
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
      // Validation errors — let the caller handle them so we don't double-toast
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
