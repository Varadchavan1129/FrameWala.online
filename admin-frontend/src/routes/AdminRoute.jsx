// AdminRoute.jsx — Route guard for admin-only access

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext.jsx';

// Inline loader — no dependency on the customer frontend
const Loader = () => (
  <div className="h-screen flex items-center justify-center bg-slate-100">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useContext(AdminAuthContext);
  const location = useLocation();

  if (loading) return <Loader />;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
