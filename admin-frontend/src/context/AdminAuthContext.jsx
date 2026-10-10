// AdminAuthContext.jsx
// Context API for managing Admin login state

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, fetchProfile, updateProfile as updateProfileAPI } from '../services/authService.js';
import toast from 'react-hot-toast';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize — verify stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await fetchProfile();
          if (res.success && res.data.user.role === 'admin') {
            setUser(res.data.user);
          } else {
            // Token exists but user is not admin — clear it silently
            clearSession();
          }
        } catch {
          // Token expired or backend unreachable — clear silently on mount
          clearSession();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // only on mount

  const clearSession = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  // Handle admin login
  // Returns { success: true } or { success: false, error: string }
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const res = await loginUser(credentials);

      if (res.success) {
        const { user: loggedUser, token: authToken } = res.data;

        if (loggedUser.role !== 'admin') {
          toast.error('This account does not have admin privileges.');
          return { success: false, error: 'Not an admin account.' };
        }

        localStorage.setItem('admin_token', authToken);
        localStorage.setItem('admin_user', JSON.stringify(loggedUser));
        setToken(authToken);
        setUser(loggedUser);
        toast.success(`Welcome back, ${loggedUser.first_name}!`);
        return { success: true };
      }

      // Unexpected: loginUser resolved but success=false
      toast.error('Login failed. Please try again.');
      return { success: false, error: 'Login failed.' };

    } catch (error) {
      // 401 / 403 — wrong credentials
      if (error.response?.status === 401 || error.response?.status === 403) {
        const msg = error.response.data?.message || 'Invalid email or password.';
        toast.error(msg);
        return { success: false, error: msg };
      }

      // 400 — validation error
      if (error.response?.status === 400) {
        const msg = error.response.data?.message || 'Validation error. Check your inputs.';
        toast.error(msg);
        return { success: false, error: msg };
      }

      // Network error — adminApi interceptor already showed a toast for this
      // So we just return failure without an extra toast
      return { success: false, error: error.message || 'Network error.' };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const res = await updateProfileAPI(profileData);
      if (res.success) {
        const updatedUser = res.data.user;
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully.');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        updateProfile: handleUpdateProfile,
        logout: handleLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
