// AdminAuthContext.jsx
// Context API for managing Admin login state, dashboards profile, and edits

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, fetchProfile, updateProfile as updateProfileAPI } from '../services/authService.js';
import toast from 'react-hot-toast';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await fetchProfile();
          if (res.success && res.data.user.role === 'admin') {
            setUser(res.data.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to load admin profile:', error.message);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Handle user login
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const res = await loginUser(credentials);
      if (res.success) {
        const { user: loggedUser, token: authToken } = res.data;
        
        // Prevent customers from logging in as admins
        if (loggedUser.role !== 'admin') {
          toast.error('Only Admin accounts can log in to the Admin Dashboard.');
          return { success: false, error: 'Unauthorized role.' };
        }

        localStorage.setItem('admin_token', authToken);
        localStorage.setItem('admin_user', JSON.stringify(loggedUser));
        setToken(authToken);
        setUser(loggedUser);
        toast.success(`Admin session verified. Welcome back, ${loggedUser.first_name}!`);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      const valErrors = error.response?.data?.data || null;
      toast.error(errMsg);
      return { success: false, error: errMsg, validationErrors: valErrors };
    } finally {
      setLoading(false);
    }
  };

  // Update profile details
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    toast.success('Admin session cleared.');
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
