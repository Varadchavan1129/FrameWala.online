// AuthContext.jsx
// Lightweight local (mock) auth for the frontend-only build. No backend calls.

import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const USER_KEY = 'framewala_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const loading = false;
  const token = user ? 'local-session' : null;

  const persist = (u) => {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
    setUser(u);
  };

  const login = async ({ email }) => {
    const first = (email || 'Guest').split('@')[0];
    const u = { first_name: first.charAt(0).toUpperCase() + first.slice(1), email, role: 'customer' };
    persist(u);
    toast.success('Logged in to FrameWala. Welcome back!');
    return { success: true };
  };

  const register = async ({ first_name, last_name, email }) => {
    const u = { first_name: first_name || 'Guest', last_name, email, role: 'customer' };
    persist(u);
    toast.success(`Account created! Welcome, ${u.first_name}!`);
    return { success: true };
  };

  const updateProfile = async (data) => {
    persist({ ...user, ...data });
    toast.success('Profile updated successfully!');
    return { success: true };
  };

  const logout = () => {
    persist(null);
    toast.success('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
