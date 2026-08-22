// AuthContext.jsx
// Context API dynamically managing Customer or Admin credentials separately based on port/origin context

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, fetchProfile, updateProfile as updateProfileAPI } from '../services/authService.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Detect active portal context
  const isPortAdmin = window.location.port === '5174';
  const isDomainAdmin = window.location.hostname.startsWith('admin.');
  const isAdminPortal = isPortAdmin || isDomainAdmin;

  const TOKEN_KEY = isAdminPortal ? 'admin_token' : 'customer_token';
  const USER_KEY = isAdminPortal ? 'admin_user' : 'customer_user';

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await fetchProfile();
          if (res.success) {
            const expectedRole = isAdminPortal ? 'admin' : 'customer';
            if (res.data.user.role === expectedRole) {
              setUser(res.data.user);
            } else {
              handleLogout();
            }
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to load active profile:', error.message);
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
        const expectedRole = isAdminPortal ? 'admin' : 'customer';
        
        // Prevent cross-portal logins
        if (loggedUser.role !== expectedRole) {
          const portalName = isAdminPortal ? 'Admin Panel' : 'Customer Portal';
          toast.error(`Role mismatch. Only ${expectedRole} accounts can log in to the ${portalName}.`);
          return { success: false, error: 'Unauthorized role.' };
        }

        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
        setToken(authToken);
        setUser(loggedUser);
        toast.success(`Logged in to ${isAdminPortal ? 'Admin Dashboard' : 'FrameWala'}. Welcome back!`);
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
    if (isAdminPortal) {
      toast.error('Registrations are disabled inside the Admin portal.');
      return { success: false, error: 'Operations disabled.' };
    }
    try {
      setLoading(true);
      const res = await registerUser(userData);
      if (res.success) {
        const { user: registeredUser, token: authToken } = res.data;
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(registeredUser));
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
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    toast.success('Session cleared.');
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
