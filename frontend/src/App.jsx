import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Admin Pages
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminMembersPage from './pages/AdminMembersPage.jsx';
import AdminExportPage from './pages/AdminExportPage.jsx';
import AdminImportPage from './pages/AdminImportPage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';

// Global Styles
import './styles/globals.css';

/**
 * App Component
 * Main application component with routing
 */
function App() {
  const { isAuthenticated, initializeAuth, subscribeToAuthChanges, userRole } = useAuth();

  useEffect(() => {
    initializeAuth();
    subscribeToAuthChanges();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Member Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="members" element={<AdminMembersPage />} />
                  <Route path="export" element={<AdminExportPage />} />
                  <Route path="import" element={<AdminImportPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === 'admin' ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
