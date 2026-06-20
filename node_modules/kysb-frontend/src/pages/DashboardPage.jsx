import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Button, Card } from '../components/ui.jsx';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard Page Component
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.firstName}!</p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="text-white">
              <p className="text-sm opacity-90">Total Members</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600">
            <div className="text-white">
              <p className="text-sm opacity-90">Active Members</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
            <div className="text-white">
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="text-white">
              <p className="text-sm opacity-90">Pending Payments</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </Card>
        </div>

        {/* User Info */}
        <Card className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-medium text-gray-800 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-medium text-gray-800">{user?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
