import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Admin Layout Component
 */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Members', path: '/admin/members', icon: '👥' },
    { label: 'Payments', path: '/admin/payments', icon: '💰' },
    { label: 'Transactions', path: '/admin/transactions', icon: '📈' },
    { label: 'Announcements', path: '/admin/announcements', icon: '📢' },
    { label: 'Expenses', path: '/admin/expenses', icon: '💸' },
    { label: 'Import Data', path: '/admin/import', icon: '📥' },
    { label: 'Export Center', path: '/admin/export', icon: '📤' },
    { label: 'Backups', path: '/admin/backups', icon: '💾' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">KYSB Fitness</h1>
          ) : (
            <div className="text-2xl">💪</div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className={`w-full flex items-center space-x-3 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors`}
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            ☰
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-600">Admin Dashboard</p>
            <p className="text-lg font-semibold text-gray-900">KYSB Fitness Center</p>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
