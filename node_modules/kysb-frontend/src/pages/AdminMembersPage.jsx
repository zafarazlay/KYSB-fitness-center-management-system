import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Spinner } from '../components/ui.jsx';
import { supabase, db } from '../services/supabase.js';

/**
 * Admin Member Management Page
 * Create, edit, delete, and manage gym members
 */
const AdminMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    membership_plan: '',
    monthly_fee: '',
    admission_fee: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  // Fetch all members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.getMembers();
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new member
  const handleCreateMember = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: Math.random().toString(36).slice(-12), // Temporary password
        email_confirm: true,
        user_metadata: { role: 'member' },
      });

      if (authError) throw new Error(`Auth Error: ${authError.message}`);

      // Step 2: Create member profile
      const memberData = {
        auth_user_id: authData.user.id,
        member_id: `MEM${Date.now()}`,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        membership_plan: formData.membership_plan,
        monthly_fee: parseFloat(formData.monthly_fee),
        admission_fee: formData.admission_fee ? parseFloat(formData.admission_fee) : 0,
        join_date: new Date().toISOString().split('T')[0],
        status: 'active',
      };

      const { data: memberResult, error: memberError } = await db.createMember(memberData);

      if (memberError) throw memberError;

      // Step 3: Create member ledger
      await supabase.from('member_ledgers').insert([
        {
          member_id: memberResult[0].id,
          total_due: 0,
          total_paid: 0,
          outstanding_balance: 0,
        },
      ]);

      // Send invitation email
      await supabase.auth.resendInvitation(formData.email);

      // Reset form and refresh
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        membership_plan: '',
        monthly_fee: '',
        admission_fee: '',
      });
      setShowForm(false);
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Delete member
  const handleDeleteMember = async (memberId, authUserId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      // Delete from Supabase Auth
      await supabase.auth.admin.deleteUser(authUserId);

      // Delete member profile (cascade will handle related data)
      const { error } = await db.deleteMember(memberId);
      if (error) throw error;

      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Filter members
  const filteredMembers = members.filter((member) =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.member_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600 mt-1">Total Members: {members.length}</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="default"
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </Button>
      </div>

      {/* Create Member Form */}
      {showForm && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Add New Member</h2>
          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
              <Input
                label="Membership Plan"
                value={formData.membership_plan}
                onChange={(e) => setFormData({ ...formData, membership_plan: e.target.value })}
                required
              />
              <Input
                label="Monthly Fee"
                type="number"
                step="0.01"
                value={formData.monthly_fee}
                onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
                required
              />
              <Input
                label="Admission Fee"
                type="number"
                step="0.01"
                value={formData.admission_fee}
                onChange={(e) => setFormData({ ...formData, admission_fee: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" variant="default">
                Create Member
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <Input
        placeholder="Search members by name, email, or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Member ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{member.member_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.phone_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.membership_plan}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteMember(member.id, member.auth_user_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminMembersPage;
