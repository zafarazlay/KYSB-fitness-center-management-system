-- ===========================
-- Seed Data for KYSB Fitness Center
-- ===========================

-- Insert Membership Tiers
INSERT INTO membership_tiers (tier_name, display_name, description, gym_fee, indoor_games_fee, combined_fee, is_active)
VALUES 
  ('kids', 'Kids Package', 'Indoor games only for children', 0, 500, 500, TRUE),
  ('adults', 'Adults Package', 'Gym access and indoor games for adults', 1000, 500, 1500, TRUE),
  ('seniors', 'Seniors Package', 'Complete access - Gym and indoor games for seniors', 1000, 500, 1500, TRUE),
  ('custom', 'Custom Package', 'Custom membership plan', 0, 0, 0, TRUE);

-- Insert Payment Settings
INSERT INTO payment_settings (due_date_day, grace_period_days, late_fee_amount, late_fee_percentage, reminder_frequency)
VALUES (5, 5, 500, 5, 'daily');

-- Insert Bank Details
INSERT INTO bank_details (account_title, bank_name, account_number, iban, easypaisa_number, jazzcash_number)
VALUES 
  ('KYSB Fitness Center', 'Bank Alfalah', '1234567890', 'PK12ALFL1234567890', '03001234567', '03005678901');

-- Insert Admin User
INSERT INTO users (email, password, first_name, last_name, role, phone_number, status)
VALUES ('admin@kysbfitness.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Admin', 'User', 'admin', '03001234567', 'active');

-- Insert Sample Member Users
INSERT INTO users (email, password, first_name, last_name, role, phone_number, status)
VALUES 
  ('member1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Ahmed', 'Khan', 'member', '03005678901', 'active'),
  ('member2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Fatima', 'Ali', 'member', '03009876543', 'active'),
  ('member3@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'Hassan', 'Malik', 'member', '03004567890', 'active');

-- Insert Sample Members
INSERT INTO members (user_id, member_id, cnic, address, join_date, membership_tier_id, membership_plan, monthly_fee, admission_fee, notes)
VALUES
  (2, 'MEM001', '12345-1234567-1', '123 Main Street, Karachi', '2024-01-15', 2, 'Adults', 1500.00, 1000.00, 'Gold Member'),
  (3, 'MEM002', '12346-1234568-2', '456 Park Avenue, Karachi', '2024-02-20', 3, 'Seniors', 1500.00, 1500.00, 'Premium Member'),
  (4, 'MEM003', '12347-1234569-3', '789 Ocean Lane, Karachi', '2024-03-10', 1, 'Kids', 500.00, 500.00, 'Regular Member');

-- Insert Sample Announcements
INSERT INTO announcements (admin_id, title, description, published_date, is_active)
VALUES 
  (1, 'Gym Maintenance', 'We will be conducting maintenance on Sunday. Gym will be closed.', NOW(), TRUE),
  (1, 'New Equipment Arrived', 'New cardio equipment has been installed. Feel free to try them!', NOW(), TRUE),
  (1, 'Summer Special Offer', 'Get 20% discount on yearly membership. Valid until end of month.', NOW(), TRUE);

-- Insert Sample Transactions
INSERT INTO transactions (member_id, type, amount, description, transaction_date, created_by)
VALUES
  (1, 'credit', 3000.00, 'Monthly fee payment - January', NOW(), 1),
  (2, 'credit', 5000.00, 'Monthly fee payment - January', NOW(), 1),
  (3, 'credit', 3000.00, 'Monthly fee payment - January', NOW(), 1);

-- Insert Sample Payments
INSERT INTO payments (member_id, amount, month, payment_date, payment_method, status, approved_by)
VALUES
  (1, 3000.00, '2024-01-01', '2024-01-10', 'cash', 'approved', 1),
  (2, 5000.00, '2024-01-01', '2024-01-12', 'bank_transfer', 'approved', 1),
  (3, 3000.00, '2024-01-01', '2024-01-15', 'cash', 'approved', 1);

-- Insert Sample Member Ledgers
INSERT INTO member_ledgers (member_id, total_due, total_paid, outstanding_balance, last_payment_date)
VALUES
  (1, 3000.00, 3000.00, 0.00, '2024-01-10'),
  (2, 5000.00, 5000.00, 0.00, '2024-01-12'),
  (3, 3000.00, 3000.00, 0.00, '2024-01-15');

-- Insert Sample Expenses
INSERT INTO expenses (category, description, amount, expense_date, created_by)
VALUES
  (1, 'Rent', 'Gym space rent for January', 50000.00, '2024-01-01', 1),
  (1, 'Utilities', 'Electricity and water bills', 15000.00, '2024-01-05', 1),
  (1, 'Equipment Maintenance', 'Maintenance of treadmills', 5000.00, '2024-01-10', 1);

-- Insert Sample Bank Details (already added above, but keeping for reference)

-- ===========================
-- End of Seed Data
-- ===========================
