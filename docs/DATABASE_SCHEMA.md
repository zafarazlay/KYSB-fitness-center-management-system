# Database Schema
# KYSB Fitness Center Management System

## Overview

The database uses PostgreSQL with normalized relational design following 3NF principles. All tables have audit timestamps (created_at, updated_at).

## Tables

### Users
Primary table for all system users (admins and members).

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (hashed) |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| role | ENUM('admin', 'member') | NOT NULL, DEFAULT 'member' |
| phone_number | VARCHAR(20) | - |
| status | ENUM('active', 'inactive', 'suspended') | DEFAULT 'active' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- email (UNIQUE)
- role
- status

### Members
Extended information for member users.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | UNIQUE, FK → users(id) |
| member_id | VARCHAR(50) | UNIQUE |
| cnic | VARCHAR(20) | - |
| address | TEXT | - |
| photo_url | VARCHAR(255) | - |
| join_date | DATE | NOT NULL |
| membership_plan | VARCHAR(100) | - |
| monthly_fee | DECIMAL(10,2) | DEFAULT 0 |
| admission_fee | DECIMAL(10,2) | - |
| notes | TEXT | - |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- member_id (UNIQUE)
- join_date

### Announcements
System announcements for members.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| admin_id | INTEGER | NOT NULL, FK → users(id) |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| scheduled_date | TIMESTAMP | - |
| published_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- published_date
- is_active

### Payments
Member payment records.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| member_id | INTEGER | NOT NULL, FK → members(id) |
| amount | DECIMAL(10,2) | NOT NULL |
| month | DATE | NOT NULL |
| payment_date | DATE | - |
| payment_method | ENUM | - |
| status | ENUM('pending', 'approved', 'rejected', 'late') | DEFAULT 'pending' |
| screenshot_url | VARCHAR(255) | - |
| reference_number | VARCHAR(100) | - |
| approved_by | INTEGER | FK → users(id) |
| rejection_reason | TEXT | - |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- member_id, month (UNIQUE)
- status
- Composite: member_id, month

### Transactions
All financial transactions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| member_id | INTEGER | NOT NULL, FK → members(id) |
| type | ENUM('credit', 'debit') | NOT NULL |
| amount | DECIMAL(10,2) | NOT NULL |
| description | VARCHAR(255) | - |
| transaction_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| created_by | INTEGER | FK → users(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- member_id
- transaction_date
- type
- Composite: member_id, transaction_date

### Member Ledgers
Summary ledger for each member.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| member_id | INTEGER | UNIQUE, FK → members(id) |
| total_due | DECIMAL(12,2) | DEFAULT 0 |
| total_paid | DECIMAL(12,2) | DEFAULT 0 |
| outstanding_balance | DECIMAL(12,2) | DEFAULT 0 |
| last_payment_date | DATE | - |
| late_fee_applied | DECIMAL(10,2) | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Audit Logs
Complete audit trail of all actions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id) |
| action | VARCHAR(255) | NOT NULL |
| entity_type | VARCHAR(100) | - |
| entity_id | INTEGER | - |
| old_values | JSONB | - |
| new_values | JSONB | - |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- user_id
- action
- created_at
- Composite: entity_type, entity_id

### Other Important Tables

- **late_fees** - Track late fee charges per member per month
- **expenses** - Financial expenses with categories
- **receipts** - Payment receipts with QR codes
- **notifications** - User notifications
- **email_logs** - Email sending logs
- **payment_settings** - System configuration
- **bank_details** - Bank account information

## Entity Relationships

### ER Diagram (Simplified)

```
Users
├── Members (1:1)
│   ├── Payments (1:N)
│   ├── Transactions (1:N)
│   ├── Member_Ledgers (1:1)
│   ├── Late_Fees (1:N)
│   └── Receipts (1:N)
├── Announcements (1:N)
├── Audit_Logs (1:N)
└── Expenses (1:N)
```

## Key Constraints

1. **Referential Integrity**: All foreign keys enforce cascade delete where appropriate
2. **Uniqueness**: Email addresses, member IDs, and payment months are unique
3. **Data Types**: Decimal used for financial amounts to prevent floating-point errors
4. **Timestamps**: All tables track creation and modification times
5. **JSONB**: Used for storing flexible audit trail data

## Performance Considerations

1. **Indexes**: Created on frequently queried columns
2. **Partitioning**: Not needed at current scale but can be added for payment/transaction tables
3. **Materialized Views**: Can be created for financial reports
4. **Connection Pooling**: Implemented in backend

## Backup & Recovery

Regular backups recommended:

```bash
pg_dump kysb_fitness > backup.sql
```

Restore from backup:

```bash
psql kysb_fitness < backup.sql
```

## Future Enhancements

- Archive old transactions (> 2 years) to separate table
- Add materialized views for reports
- Implement table partitioning for large datasets
- Add full-text search indexes
