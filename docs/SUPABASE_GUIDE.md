# Supabase Integration Guide
# KYSB Fitness Center Management System

## Overview

The KYSB Fitness Center Management System now uses **Supabase** as the complete backend service, replacing the Express.js backend. This document guides you through the setup and configuration.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **Authentication** - User sign-up, sign-in, role management
- **PostgreSQL Database** - Powerful relational database
- **Real-time Subscriptions** - Live data updates
- **File Storage** - Upload and manage files
- **Row Level Security (RLS)** - Data access control

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Node.js v18+
- npm or yarn

## Setup Instructions

### Step 1: Create Supabase Project

1. Visit https://supabase.com and sign up
2. Create a new project (choose PostgreSQL 15)
3. Wait for the database to initialize
4. Note your project URL and anon key (from Settings → API Keys)

### Step 2: Configure Frontend Environment

Update `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard → Settings → API Keys
- Copy the URL and `anon` public key

### Step 3: Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the entire content from `database/migrations/001_supabase_schema.sql`
4. Run the query
5. Verify all tables are created

### Step 4: Configure Storage Buckets

In Supabase Dashboard → Storage:

1. Create bucket: `member-photos` (Public)
2. Create bucket: `payment-screenshots` (Public)
3. Create bucket: `backups` (Private)

### Step 5: Set Up Authentication

1. Go to Authentication → Providers
2. Email/Password should be enabled by default
3. Go to Authentication → Users
4. Create initial admin user:
   - Email: `admin@kysbfitness.com`
   - Password: `Admin@123` (change in production)
   - Set `user_metadata` → `role: admin`

### Step 6: Install Dependencies

```bash
cd frontend
npm install
```

### Step 7: Start Development

```bash
npm run frontend:dev
```

Access at http://localhost:3000

## Key Features

### 1. Controlled Member Registration

- No public registration allowed
- Only admins can create members
- Process:
  1. Admin enters member details
  2. System creates Supabase Auth account
  3. Member receives email invitation
  4. Member sets password via invite link
  5. Member can login

### 2. Excel Import System

**Features:**
- Import members from Excel/CSV
- Bulk import transactions
- Data validation before import
- Import preview with error reporting
- Create member accounts automatically

**Supported formats:**
- .xlsx, .xls, .csv

**Import types:**
- Members (with all profile details)
- Transactions (historical data)

**File location:** `Admin → Import Data`

### 3. Excel Export System

**Export options:**
- Members List
- Payment History
- Member Ledger
- Transactions
- Expenses

**Supported formats:**
- Excel (.xlsx)
- CSV

**File location:** `Admin → Export Center`

### 4. Real-time Dashboard

**Features:**
- Live updates when:
  - Payments are approved
  - Members are added
  - Transactions are recorded
  - Announcements are posted
- No page refresh needed
- Uses Supabase Realtime

**Metrics:**
- Total members
- Active members
- Total revenue
- Pending payments
- Recent transactions

### 5. System Settings

**Configurable without code:**
- Gym name and contact info
- Payment due dates
- Late fee rules
- Email templates
- Bank account details
- Membership plans

**Location:** `Admin → Settings`

### 6. Automated Backups

**Features:**
- Daily backups
- Weekly backups
- Monthly backups
- Manual backup option
- Download and restore functionality

**Location:** `Admin → Backups`

### 7. Advanced Search & Filtering

**Search by:**
- Member name
- Member ID
- Email
- Phone number
- Transaction date
- Payment status

**Filter options:**
- Paid members
- Unpaid members
- Overdue members
- Active/Inactive members

## Database Schema

### Core Tables

- **members** - Member profiles linked to auth users
- **payments** - Payment records with approval workflow
- **transactions** - All financial transactions
- **member_ledgers** - Summary ledger per member
- **announcements** - Gym announcements
- **expenses** - Expense tracking
- **system_settings** - Configuration
- **bank_details** - Payment account information
- **import_history** - Record of all imports
- **backup_history** - Backup records

### Security

- Row Level Security (RLS) enabled
- Admins see all data
- Members see only their own data
- Encrypted passwords
- Session-based authentication

## API Architecture

### Supabase Client (`services/supabase.js`)

Provides helper functions:

```javascript
// Authentication
await supabase.auth.signInWithPassword({ email, password })
await supabase.auth.signOut()

// Database operations
await db.getMembers()
await db.createMember(data)
await db.updateMember(id, data)
await db.deleteMember(id)

// Real-time subscriptions
realtime.subscribeToPayments(callback)
realtime.subscribeToMembers(callback)

// File storage
await storage.uploadMemberPhoto(memberId, file)
```

## User Roles

### Admin
- Create/edit/delete members
- Approve payments
- View financial reports
- Export data
- Manage settings
- Import bulk data
- Access all dashboards

### Member
- View own profile
- View payment history
- Submit payment proof
- View announcements
- Download receipts
- Limited to own data only

## Workflows

### Member Creation (Admin Only)

1. Admin navigates to `Admin → Members`
2. Click "+ Add Member"
3. Enter member details:
   - Full Name
   - Email
   - Phone
   - Membership Plan
   - Monthly Fee
   - Admission Fee
4. System creates:
   - Supabase Auth account
   - Member profile
   - Ledger entry
5. Email invitation sent to member
6. Member sets password and logs in

### Payment Approval

1. Member uploads payment proof
2. Admin receives notification
3. Admin reviews screenshot
4. Admin approves or rejects
5. If approved:
   - Payment status → Approved
   - Ledger updated
   - Receipt generated
   - Member notified
6. If rejected:
   - Member can resubmit

### Data Import

1. Prepare Excel file with data
2. Go to `Admin → Import Data`
3. Select import type (Members/Transactions)
4. Upload file
5. System validates data
6. Review errors (if any)
7. Confirm import
8. System creates records automatically

## Troubleshooting

### Connection Issues

**Error:** "Cannot connect to Supabase"
- Check VITE_SUPABASE_URL in .env
- Verify Supabase project is active
- Check internet connection

### Authentication Issues

**Error:** "Invalid credentials"
- Verify email exists in Supabase Auth
- Check password is correct
- Try password reset

### Database Errors

**Error:** "Permission denied"
- Check RLS policies
- Verify user role
- Check if user data exists

## Performance Tips

1. **Database Queries**
   - Use indexes (already set up)
   - Filter on RLS policies (automatic)
   - Paginate large datasets

2. **Real-time Updates**
   - Subscribe only to needed tables
   - Unsubscribe when leaving page
   - Debounce frequent updates

3. **File Storage**
   - Compress images before upload
   - Use unique file names
   - Clean up old files

## Security Best Practices

1. **API Keys**
   - Use anon key for frontend (public)
   - Use service role key only in backend (secret)
   - Never commit keys to version control

2. **Passwords**
   - Always change default credentials
   - Use strong passwords (min 12 chars)
   - Enable 2FA for admin accounts

3. **RLS Policies**
   - Already configured
   - Review before production
   - Test user access restrictions

4. **Backups**
   - Enable automatic backups (Supabase Pro)
   - Download regular backups
   - Test restore process

## Production Deployment

### Before Going Live

- [ ] Change all default passwords
- [ ] Update environment variables
- [ ] Enable HTTPS
- [ ] Configure email templates
- [ ] Set up automated backups
- [ ] Test all workflows
- [ ] Verify RLS policies
- [ ] Enable audit logging
- [ ] Set up monitoring

### Supabase Production Setup

1. Upgrade to Supabase Pro
2. Enable automated backups
3. Set up custom domains
4. Configure email templates
5. Enable multi-factor authentication
6. Set up row security policies
7. Monitor usage and costs

## Support

For issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Review error messages in console
3. Check database logs in Supabase Dashboard
4. Contact support

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Updates](https://supabase.com/docs/guides/realtime)

---

**Last Updated:** June 20, 2026
