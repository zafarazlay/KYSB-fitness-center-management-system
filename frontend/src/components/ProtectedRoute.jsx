import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Navigate } from 'react-router-dom';
import { Spinner } from '../components/ui.jsx';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Optionally restricts access based on user role
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
