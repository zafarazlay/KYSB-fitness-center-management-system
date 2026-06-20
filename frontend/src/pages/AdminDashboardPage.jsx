import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui.jsx';
import { supabase, db, realtime } from '../services/supabase.js';

/**
 * Admin Dashboard Page
 * Real-time dashboard with key metrics and statistics
 */
const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    unpaidMembers: 0,
    totalOutstandingDues: 0,
    membersWithDues: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    subscribeToChanges();
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Total Members
      const { data: members } = await db.getMembers(10000);
      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter((m) => m.status === 'active').length || 0;

      // Revenue data
      const { data: payments } = await db.getPayments(10000);
      const totalRevenue = payments
        ?.filter((p) => p.status === 'approved')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const pendingPayments = payments?.filter((p) => p.status === 'pending').length || 0;

      // Unpaid members
      const unpaidMembers = payments?.filter((p) => p.status === 'pending').length || 0;

      // Members with outstanding dues
      const { data: ledgers } = await supabase
        .from('member_ledgers')
        .select('*, members(id, full_name, email, member_id, phone_number)')
        .gt('outstanding_balance', 0)
        .order('outstanding_balance', { ascending: false })
        .limit(10);

      const totalOutstandingDues = ledgers
        ?.reduce((sum, l) => sum + (l.outstanding_balance || 0), 0) || 0;

      const membersWithDues = ledgers?.map((l) => ({
        ...l.members,
        outstanding_balance: l.outstanding_balance,
      })) || [];

      // Recent transactions
      const { data: transactions } = await db.getTransactions(5);

      setStats({
        totalMembers,
        activeMembers,
        totalRevenue,
        pendingPayments,
        unpaidMembers,
        totalOutstandingDues,
        membersWithDues,
        recentTransactions: transactions || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time changes
  const subscribeToChanges = () => {
    // Subscribe to payments
    realtime.subscribeToPayments((payload) => {
      console.log('Payment change:', payload);
      fetchDashboardData(); // Refresh on changes
    });

    // Subscribe to members
    realtime.subscribeToMembers((payload) => {
      console.log('Member change:', payload);
      fetchDashboardData();
    });

    // Subscribe to transactions
    realtime.subscribeToTransactions((payload) => {
      console.log('Transaction change:', payload);
      fetchDashboardData();
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card className={`bg-gradient-to-br ${color}`}>
      <div className="text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your system overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
          subtitle={`${stats.totalMembers > 0 ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(0) : 0}% active`}
          icon="✅"
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={`PKR ${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle={`${stats.unpaidMembers} members unpaid`}
          icon="⏳"
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Outstanding Dues"
          value={`PKR ${stats.totalOutstandingDues.toLocaleString()}`}
          subtitle={`${stats.membersWithDues.length} members`}
          icon="📌"
          color="from-red-500 to-red-600"
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((trans) => (
                  <tr key={trans.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          trans.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trans.type === 'credit' ? '📥' : '📤'} {trans.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      PKR {trans.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(trans.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{trans.description || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Members with Outstanding Dues */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📌 Members with Outstanding Dues</h2>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            {stats.membersWithDues.length} members
          </span>
        </div>

        {stats.membersWithDues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50 border-b border-red-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-red-900">Member ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-red-900">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-red-900">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-red-900">Phone</th>
                  <th className="px-4 py-3 text-right font-semibold text-red-900">Outstanding Due</th>
                  <th className="px-4 py-3 text-center font-semibold text-red-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.membersWithDues.map((member) => (
                  <tr key={member.id} className="hover:bg-red-50 border-red-100">
                    <td className="px-4 py-3 text-gray-600 font-mono">{member.member_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{member.full_name}</td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3 text-gray-600">{member.phone_number}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      PKR {member.outstanding_balance?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href="/admin/payments"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Collect
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-green-600 font-semibold">✅ No outstanding dues!</p>
            <p className="text-gray-500">All members are up to date with their payments.</p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '👥', label: 'Add Member', link: '/admin/members' },
            { icon: '💰', label: 'Record Payment', link: '/admin/payments' },
            { icon: '📊', label: 'View Reports', link: '/admin/export' },
            { icon: '⚙️', label: 'Settings', link: '/admin/settings' },
          ].map((action, idx) => (
            <a
              key={idx}
              href={action.link}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <p className="text-2xl mb-1">{action.icon}</p>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </a>
          ))}
        </div>
      </Card>

      {/* System Info */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900">ℹ️ System Information</h3>
        <p className="text-sm text-blue-800 mt-2">
          Dashboard updates in real-time when payments are approved, members are added, or transactions are recorded.
        </p>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
