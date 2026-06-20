import React, { useState } from 'react';
import { Button, Card, Input, Spinner } from '../components/ui.jsx';
import {
  exportMembers,
  exportPayments,
  exportLedger,
  exportTransactions,
  exportExpenses,
  exportToCSV,
} from '../services/excelService.js';
import { supabase, db } from '../services/supabase.js';

/**
 * Admin Export Center Page
 * Export system data in various formats
 */
const AdminExportPage = () => {
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [exportType, setExportType] = useState('members');

  // Handle export
  const handleExport = async () => {
    setLoading(true);
    try {
      let data = [];

      switch (exportType) {
        case 'members': {
          const { data: members } = await db.getMembers();
          data = members || [];
          exportFormat === 'xlsx' ? exportMembers(data) : exportToCSV(data, 'members');
          break;
        }
        case 'payments': {
          const { data: payments } = await db.getPayments();
          data = payments || [];
          exportFormat === 'xlsx'
            ? exportPayments(data)
            : exportToCSV(data, 'payments');
          break;
        }
        case 'ledger': {
          const { data: ledgers } = await db.getLedgers();
          data = ledgers || [];
          exportFormat === 'xlsx' ? exportLedger(data) : exportToCSV(data, 'ledger');
          break;
        }
        case 'transactions': {
          const { data: transactions } = await db.getTransactions();
          data = transactions || [];
          exportFormat === 'xlsx'
            ? exportTransactions(data)
            : exportToCSV(data, 'transactions');
          break;
        }
        case 'expenses': {
          const { data: expenses } = await db.getExpenses();
          data = expenses || [];
          exportFormat === 'xlsx' ? exportExpenses(data) : exportToCSV(data, 'expenses');
          break;
        }
        default:
          break;
      }

      alert('Export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    { value: 'members', label: 'Members List' },
    { value: 'payments', label: 'Payment History' },
    { value: 'ledger', label: 'Member Ledger' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'expenses', label: 'Expenses' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Center</h1>
        <p className="text-gray-600 mt-1">Download system data in various formats</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Type Selection */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Select Data to Export</h2>
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value={option.value}
                  checked={exportType === option.value}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Format Selection */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Select Format</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="xlsx"
                checked={exportFormat === 'xlsx'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Excel (XLSX)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">CSV</span>
            </label>
          </div>
        </Card>
      </div>

      {/* Export Button */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Export {exportOptions.find((o) => o.value === exportType)?.label}
            </h3>
            <p className="text-gray-600 mt-1">
              Download as {exportFormat.toUpperCase()}
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={loading}
            variant="default"
            size="lg"
          >
            {loading ? 'Exporting...' : '📥 Export Now'}
          </Button>
        </div>
      </Card>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <Card
            key={option.value}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setExportType(option.value);
              setTimeout(() => {
                document.querySelector('button:not(:disabled)').click();
              }, 100);
            }}
          >
            <div className="text-center">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-semibold text-gray-900">{option.label}</p>
              <p className="text-sm text-gray-600 mt-2">Click to export as {exportFormat.toUpperCase()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminExportPage;
