-- ===========================
-- KYSB Fitness Center Database Schema
-- ===========================

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'late');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'easypaisa', 'jazzcash', 'online');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE notification_type AS ENUM ('payment', 'announcement', 'system', 'reminder');

-- ===========================
-- Users Table
-- ===========================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  phone_number VARCHAR(20),
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- ===========================
-- Members Table
-- ===========================
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  member_id VARCHAR(50) UNIQUE NOT NULL,
  cnic VARCHAR(20),
  address TEXT,
  photo_url VARCHAR(255),
  join_date DATE NOT NULL,
  membership_plan VARCHAR(100),
  monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  admission_fee DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id),
  INDEX idx_join_date (join_date)
);

-- ===========================
-- Announcements Table
-- ===========================
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  scheduled_date TIMESTAMP,
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_published_date (published_date),
  INDEX idx_is_active (is_active)
);

-- ===========================
-- Transactions Table
-- ===========================
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_member_id (member_id),
  INDEX idx_transaction_date (transaction_date),
  INDEX idx_type (type)
);

-- ===========================
-- Payments Table
-- ===========================
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  month DATE NOT NULL,
  payment_date DATE,
  payment_method payment_method,
  status payment_status DEFAULT 'pending',
  screenshot_url VARCHAR(255),
  reference_number VARCHAR(100),
  approved_by INTEGER,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_member_id (member_id),
  INDEX idx_month (month),
  INDEX idx_status (status),
  UNIQUE (member_id, month)
);

-- ===========================
-- Member Ledger Table
-- ===========================
CREATE TABLE member_ledgers (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL UNIQUE,
  total_due DECIMAL(12, 2) DEFAULT 0,
  total_paid DECIMAL(12, 2) DEFAULT 0,
  outstanding_balance DECIMAL(12, 2) DEFAULT 0,
  last_payment_date DATE,
  late_fee_applied DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_member_id (member_id)
);

-- ===========================
-- Late Fees Table
-- ===========================
CREATE TABLE late_fees (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL,
  month DATE NOT NULL,
  fee_amount DECIMAL(10, 2) NOT NULL,
  is_waived BOOLEAN DEFAULT FALSE,
  waived_reason TEXT,
  waived_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (waived_by) REFERENCES users(id),
  INDEX idx_member_id (member_id),
  INDEX idx_month (month),
  UNIQUE (member_id, month)
);

-- ===========================
-- Expenses Table
-- ===========================
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_expense_date (expense_date)
);

-- ===========================
-- Receipts Table
-- ===========================
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  payment_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method payment_method,
  qr_code VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  FOREIGN KEY (member_id) REFERENCES members(id),
  INDEX idx_receipt_number (receipt_number),
  INDEX idx_member_id (member_id)
);

-- ===========================
-- Notifications Table
-- ===========================
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_id INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- ===========================
-- Audit Logs Table
-- ===========================
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  INDEX idx_entity (entity_type, entity_id)
);

-- ===========================
-- Email Logs Table
-- ===========================
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  email_type VARCHAR(100),
  status VARCHAR(50),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipient_email (recipient_email),
  INDEX idx_sent_at (sent_at)
);

-- ===========================
-- Payment Settings Table
-- ===========================
CREATE TABLE payment_settings (
  id SERIAL PRIMARY KEY,
  due_date_day INTEGER DEFAULT 5,
  grace_period_days INTEGER DEFAULT 5,
  late_fee_amount DECIMAL(10, 2) DEFAULT 500,
  late_fee_percentage DECIMAL(5, 2) DEFAULT 5,
  reminder_frequency VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Bank Details Table
-- ===========================
CREATE TABLE bank_details (
  id SERIAL PRIMARY KEY,
  account_title VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  iban VARCHAR(100),
  easypaisa_number VARCHAR(20),
  jazzcash_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Create Indexes
-- ===========================

-- Composite indexes for common queries
CREATE INDEX idx_payments_member_month ON payments(member_id, month);
CREATE INDEX idx_transactions_member_date ON transactions(member_id, transaction_date);
CREATE INDEX idx_audit_logs_entity_date ON audit_logs(entity_type, entity_id, created_at);
