// AdminRoute.jsx
// Security guard to restrict access to administrator privileges

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to admin login if user role is not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
