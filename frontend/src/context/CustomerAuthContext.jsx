// CustomerAuthContext.jsx
// Context API for managing Customer login state, registrations, and profile edits

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, fetchProfile, updateProfile as updateProfileAPI } from '../services/authService.js';
import toast from 'react-hot-toast';

export const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('customer_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await fetchProfile();
          if (res.success && res.data.user.role === 'customer') {
            setUser(res.data.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to load customer profile:', error.message);
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
        
        // Prevent admins from logging in as customers
        if (loggedUser.role !== 'customer') {
          toast.error('Admin accounts cannot log in to the Customer Portal.');
          return { success: false, error: 'Unauthorized role.' };
        }

        localStorage.setItem('customer_token', authToken);
        localStorage.setItem('customer_user', JSON.stringify(loggedUser));
        setToken(authToken);
        setUser(loggedUser);
        toast.success(`Welcome back, ${loggedUser.first_name}!`);
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

  // Handle user registration
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const res = await registerUser(userData);
      if (res.success) {
        const { user: registeredUser, token: authToken } = res.data;
        localStorage.setItem('customer_token', authToken);
        localStorage.setItem('customer_user', JSON.stringify(registeredUser));
        setToken(authToken);
        setUser(registeredUser);
        toast.success(`Account created! Welcome, ${registeredUser.first_name}!`);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
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
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));
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
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        register: handleRegister,
        updateProfile: handleUpdateProfile,
        logout: handleLogout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
