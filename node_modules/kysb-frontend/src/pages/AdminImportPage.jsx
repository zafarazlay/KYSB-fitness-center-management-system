import React, { useState } from 'react';
import { Button, Card, Spinner } from '../components/ui.jsx';
import {
  parseFile,
  validateMemberData,
  validateTransactionData,
  generateImportReport,
} from '../services/excelService.js';
import { supabase, db } from '../services/supabase.js';

/**
 * Admin Import Page
 * Bulk import members and transactions from Excel/CSV
 */
const AdminImportPage = () => {
  const [importType, setImportType] = useState('members');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [validation, setValidation] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(null);
    setValidation(null);
  };

  // Preview and validate file
  const handlePreview = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const data = await parseFile(file);

      if (importType === 'members') {
        const result = validateMemberData(data);
        setValidation(result);
        setPreview(result.validRows.slice(0, 5)); // Show first 5 rows
      } else if (importType === 'transactions') {
        const result = validateTransactionData(data);
        setValidation(result);
        setPreview(result.validRows.slice(0, 5));
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Import confirmed data
  const handleImport = async () => {
    if (!validation || validation.validRows.length === 0) {
      alert('No valid records to import');
      return;
    }

    setLoading(true);
    try {
      let result = { successful: 0, failed: 0, errors: [] };

      if (importType === 'members') {
        // Import members
        for (const row of validation.validRows) {
          try {
            const memberData = row.data;

            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: memberData.Email,
              password: Math.random().toString(36).slice(-12),
              email_confirm: true,
              user_metadata: { role: 'member' },
            });

            if (authError) throw authError;

            // Create member profile
            const { error: memberError } = await db.createMember({
              auth_user_id: authData.user.id,
              member_id: memberData['Member ID'] || `MEM${Date.now()}`,
              full_name: memberData['Full Name'],
              email: memberData.Email,
              phone_number: memberData.Phone,
              cnic: memberData.CNIC || null,
              address: memberData.Address || null,
              join_date: memberData['Join Date'] || new Date().toISOString().split('T')[0],
              membership_plan: memberData['Membership Plan'],
              monthly_fee: parseFloat(memberData['Monthly Fee']),
              admission_fee: memberData['Admission Fee'] ? parseFloat(memberData['Admission Fee']) : 0,
              status: 'active',
            });

            if (memberError) throw memberError;

            result.successful++;
          } catch (error) {
            result.failed++;
            result.errors.push({ row: row.row, error: error.message });
          }
        }
      } else if (importType === 'transactions') {
        // Import transactions
        for (const row of validation.validRows) {
          try {
            const transData = row.data;

            // Find member by ID
            const { data: member, error: memberError } = await db.getMemberById(transData['Member ID']);

            if (memberError || !member) {
              throw new Error('Member not found');
            }

            // Create transaction
            await db.createTransaction({
              member_id: member.id,
              type: 'credit',
              amount: parseFloat(transData.Amount),
              description: transData.Notes || '',
              transaction_date: new Date(transData['Transaction Date']).toISOString(),
            });

            result.successful++;
          } catch (error) {
            result.failed++;
            result.errors.push({ row: row.row, error: error.message });
          }
        }
      }

      setImportResult(result);
    } catch (error) {
      console.error('Import error:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Data</h1>
        <p className="text-gray-600 mt-1">Bulk import members and transactions</p>
      </div>

      {/* Import Type Selection */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Select Import Type</h2>
        <div className="flex space-x-4">
          {[
            { value: 'members', label: '👥 Members' },
            { value: 'transactions', label: '📊 Transactions' },
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="importType"
                value={option.value}
                checked={importType === option.value}
                onChange={(e) => setImportType(e.target.value)}
                className="w-4 h-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* File Upload */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Select File</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <p className="text-2xl mb-2">📄</p>
            <p className="text-lg font-semibold text-gray-900">
              {file ? file.name : 'Choose Excel or CSV file'}
            </p>
            <p className="text-sm text-gray-600">or drag and drop</p>
          </label>
        </div>

        <div className="mt-4 flex space-x-3">
          <Button
            onClick={handlePreview}
            disabled={!file || loading}
            variant="default"
          >
            {loading ? 'Validating...' : '🔍 Preview & Validate'}
          </Button>
        </div>
      </Card>

      {/* Validation Results */}
      {validation && (
        <Card className={validation.errors.length > 0 ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}>
          <h2 className="text-xl font-bold mb-4">Validation Results</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{validation.validRows.length}</p>
              <p className="text-gray-600">Valid Records</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{validation.errors.length}</p>
              <p className="text-gray-600">Errors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {(
                  (validation.validRows.length / (validation.validRows.length + validation.errors.length)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>

          {/* Preview Table */}
          {preview && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Preview (First 5 Records)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0].data).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-gray-700">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        {Object.values(row.data).map((value, idx) => (
                          <td key={idx} className="px-4 py-2 text-gray-600">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error Details */}
          {validation.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-red-900 mb-3">Errors</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validation.errors.map((error, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="font-semibold text-red-800">Row {error.row}</p>
                    {error.errors.map((err, idx) => (
                      <p key={idx} className="text-red-700 text-sm">
                        • {err}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Button */}
          {validation.validRows.length > 0 && (
            <Button onClick={handleImport} disabled={loading} variant="default" size="lg">
              {loading ? 'Importing...' : `✅ Import ${validation.validRows.length} Records`}
            </Button>
          )}
        </Card>
      )}

      {/* Import Result */}
      {importResult && (
        <Card className="border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">Import Complete</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-3xl font-bold text-green-600">{importResult.successful}</p>
              <p className="text-gray-700">Successful</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-3xl font-bold text-red-600">{importResult.failed}</p>
              <p className="text-gray-700">Failed</p>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Failed Rows</h3>
              <div className="space-y-2">
                {importResult.errors.slice(0, 5).map((error, idx) => (
                  <p key={idx} className="text-sm text-red-700">
                    Row {error.row}: {error.error}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => {
              setFile(null);
              setPreview(null);
              setValidation(null);
              setImportResult(null);
            }}
            variant="default"
            className="mt-4"
          >
            Import Another File
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AdminImportPage;
