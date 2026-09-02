// PublicRoute.jsx
// Security guard to protect guest-only routes (redirects logged-in users to home/admin)

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';

const PublicRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  // Detect active portal context
  const isPortAdmin = window.location.port === '5174';
  const isDomainAdmin = window.location.hostname.startsWith('admin.');
  const isAdminPortal = isPortAdmin || isDomainAdmin;

  // If token and user profile are loaded, redirect them away
  if (token && user) {
    return <Navigate to={isAdminPortal ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

export default PublicRoute;
