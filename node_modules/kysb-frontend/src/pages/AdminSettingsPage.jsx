import React, { useState, useEffect } from 'react';
import { Button, Card, Input } from '../components/ui.jsx';
import { supabase, db } from '../services/supabase.js';

/**
 * Admin Settings Page
 * Configure system settings without code changes
 */
const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gym_name: '',
    phone_number: '',
    email: '',
    address: '',
    due_date_day: 5,
    grace_period_days: 5,
    late_fee_amount: 500,
    late_fee_percentage: 5,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.getSettings();
      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
        setFormData({
          gym_name: data.gym_name || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          address: data.address || '',
          due_date_day: data.due_date_day || 5,
          grace_period_days: data.grace_period_days || 5,
          late_fee_amount: data.late_fee_amount || 500,
          late_fee_percentage: data.late_fee_percentage || 5,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (settings) {
        // Update existing
        const { error } = await supabase
          .from('system_settings')
          .update(formData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('system_settings')
          .insert([formData]);

        if (error) throw error;
      }

      alert('Settings saved successfully!');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure your gym management system</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Gym Information */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Gym Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Gym Name"
              name="gym_name"
              value={formData.gym_name}
              onChange={handleChange}
              placeholder="Enter gym name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@gym.com"
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="03001234567"
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className="md:col-span-2"
            />
          </div>
        </Card>

        {/* Payment Settings */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Payment Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Due Date (Day of Month)"
              name="due_date_day"
              type="number"
              min="1"
              max="31"
              value={formData.due_date_day}
              onChange={handleChange}
            />
            <Input
              label="Grace Period (Days)"
              name="grace_period_days"
              type="number"
              min="0"
              value={formData.grace_period_days}
              onChange={handleChange}
            />
            <Input
              label="Late Fee Amount (PKR)"
              name="late_fee_amount"
              type="number"
              step="0.01"
              value={formData.late_fee_amount}
              onChange={handleChange}
            />
            <Input
              label="Late Fee Percentage (%)"
              name="late_fee_percentage"
              type="number"
              step="0.01"
              value={formData.late_fee_percentage}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex space-x-3">
          <Button type="submit" disabled={saving} variant="default" size="lg">
            {saving ? 'Saving...' : '💾 Save Settings'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={fetchSettings}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Info Cards */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900">ℹ️ Settings Information</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>• Due Date: Payment deadline for each month</li>
          <li>• Grace Period: Additional days before late fee applies</li>
          <li>• Late Fee: Applied after grace period expires</li>
          <li>• All changes take effect immediately</li>
        </ul>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
