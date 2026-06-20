import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Excel Import/Export Utilities
 * Handles bulk data import and export operations
 */

// ===========================
// Import Utilities
// ===========================

/**
 * Parse Excel or CSV file
 */
export const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let data = [];

        if (file.name.endsWith('.csv')) {
          Papa.parse(e.target.result, {
            complete: (results) => {
              resolve(results.data);
            },
            error: (error) => {
              reject(new Error(`CSV parse error: ${error.message}`));
            },
            header: true,
          });
        } else {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(sheet);
          resolve(data);
        }
      } catch (error) {
        reject(new Error(`File parse error: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('File read error'));
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

/**
 * Validate member import data
 */
export const validateMemberData = (rows) => {
  const errors = [];
  const validRows = [];
  const duplicateEmails = new Set();

  rows.forEach((row, index) => {
    const rowErrors = [];

    // Validate required fields
    if (!row['Full Name'] || row['Full Name'].trim() === '') {
      rowErrors.push('Full Name is required');
    }

    if (!row['Email'] || row['Email'].trim() === '') {
      rowErrors.push('Email is required');
    } else if (!isValidEmail(row['Email'])) {
      rowErrors.push('Invalid email format');
    }

    if (!row['Phone'] || row['Phone'].trim() === '') {
      rowErrors.push('Phone is required');
    }

    if (!row['Membership Plan'] || row['Membership Plan'].trim() === '') {
      rowErrors.push('Membership Plan is required');
    }

    if (!row['Monthly Fee'] || isNaN(parseFloat(row['Monthly Fee']))) {
      rowErrors.push('Monthly Fee must be a valid number');
    }

    // Check for duplicate emails within import
    if (row['Email'] && duplicateEmails.has(row['Email'].toLowerCase())) {
      rowErrors.push('Duplicate email in import file');
    }
    duplicateEmails.add(row['Email']?.toLowerCase());

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2, // +2 because row 1 is header and index starts at 0
        data: row,
        errors: rowErrors,
      });
    } else {
      validRows.push({
        row: index + 2,
        data: row,
      });
    }
  });

  return { validRows, errors };
};

/**
 * Validate transaction import data
 */
export const validateTransactionData = (rows) => {
  const errors = [];
  const validRows = [];

  rows.forEach((row, index) => {
    const rowErrors = [];

    if (!row['Member ID'] || row['Member ID'].trim() === '') {
      rowErrors.push('Member ID is required');
    }

    if (!row['Amount'] || isNaN(parseFloat(row['Amount']))) {
      rowErrors.push('Amount must be a valid number');
    }

    if (!row['Transaction Date'] || !isValidDate(row['Transaction Date'])) {
      rowErrors.push('Invalid Transaction Date format');
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2,
        data: row,
        errors: rowErrors,
      });
    } else {
      validRows.push({
        row: index + 2,
        data: row,
      });
    }
  });

  return { validRows, errors };
};

// ===========================
// Export Utilities
// ===========================

/**
 * Export data to Excel
 */
export const exportToExcel = (data, fileName = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Auto-fit column widths
  const colWidths = Object.keys(data[0] || {}).map(() => 20);
  worksheet['!cols'] = colWidths.map((width) => ({ wch: width }));

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data, fileName = 'export') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export members to Excel
 */
export const exportMembers = (members) => {
  const exportData = members.map((member) => ({
    'Member ID': member.member_id,
    'Full Name': member.full_name,
    Email: member.email,
    Phone: member.phone_number,
    CNIC: member.cnic || '',
    Address: member.address || '',
    'Join Date': formatDate(member.join_date),
    'Membership Plan': member.membership_plan,
    'Monthly Fee': member.monthly_fee,
    'Admission Fee': member.admission_fee || 0,
    Status: member.status,
  }));

  exportToExcel(exportData, 'members');
};

/**
 * Export payments to Excel
 */
export const exportPayments = (payments) => {
  const exportData = payments.map((payment) => ({
    'Payment ID': payment.id,
    'Member ID': payment.member_id,
    Amount: payment.amount,
    Month: formatDate(payment.month),
    'Payment Date': payment.payment_date ? formatDate(payment.payment_date) : '',
    'Payment Method': payment.payment_method || '',
    Status: payment.status,
    'Reference Number': payment.reference_number || '',
  }));

  exportToExcel(exportData, 'payments');
};

/**
 * Export ledger to Excel
 */
export const exportLedger = (ledgers) => {
  const exportData = ledgers.map((ledger) => ({
    'Member ID': ledger.member_id,
    'Total Due': ledger.total_due,
    'Total Paid': ledger.total_paid,
    'Outstanding Balance': ledger.outstanding_balance,
    'Last Payment Date': ledger.last_payment_date ? formatDate(ledger.last_payment_date) : '',
    'Late Fee Applied': ledger.late_fee_applied,
  }));

  exportToExcel(exportData, 'member-ledger');
};

/**
 * Export transactions to Excel
 */
export const exportTransactions = (transactions) => {
  const exportData = transactions.map((transaction) => ({
    'Transaction ID': transaction.id,
    'Member ID': transaction.member_id,
    Type: transaction.type,
    Amount: transaction.amount,
    Description: transaction.description || '',
    'Transaction Date': formatDate(transaction.transaction_date),
  }));

  exportToExcel(exportData, 'transactions');
};

/**
 * Export expenses to Excel
 */
export const exportExpenses = (expenses) => {
  const exportData = expenses.map((expense) => ({
    'Expense ID': expense.id,
    Category: expense.category,
    Description: expense.description || '',
    Amount: expense.amount,
    'Expense Date': formatDate(expense.expense_date),
  }));

  exportToExcel(exportData, 'expenses');
};

// ===========================
// Helper Functions
// ===========================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate date format
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Generate import report
 */
export const generateImportReport = (importResult) => {
  return {
    totalRecords: importResult.validRows.length + importResult.errors.length,
    successfulRecords: importResult.validRows.length,
    failedRecords: importResult.errors.length,
    successRate: `${(
      (importResult.validRows.length /
        (importResult.validRows.length + importResult.errors.length)) *
      100
    ).toFixed(2)}%`,
    errors: importResult.errors,
  };
};
