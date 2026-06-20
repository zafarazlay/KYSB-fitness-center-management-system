# File Directory & Reference Guide

## Overview

This guide provides a complete reference of all files created and modified in Phase 2.

## New Files Created (21 files)

### Frontend - Pages (7 files)

| File | Purpose | Features |
|------|---------|----------|
| `frontend/src/pages/AdminDashboardPage.jsx` | Real-time admin dashboard | Live metrics, recent transactions, quick actions, stats cards |
| `frontend/src/pages/AdminMembersPage.jsx` | Member management interface | Create, edit, delete, search members with Supabase integration |
| `frontend/src/pages/AdminExportPage.jsx` | Data export center | Export to Excel/CSV, select data type and format |
| `frontend/src/pages/AdminImportPage.jsx` | Bulk data import | Parse, validate, preview, import Excel/CSV with error reporting |
| `frontend/src/pages/AdminSettingsPage.jsx` | System configuration | Gym info, payment settings, bank details, no code needed |
| `frontend/src/pages/LoginPage.jsx` | Enhanced login page | Email/password login with Supabase Auth integration |
| `frontend/src/pages/DashboardPage.jsx` | Member dashboard template | Welcome message, member profile, quick links |

### Frontend - Services (3 files)

| File | Purpose | Functions |
|------|---------|-----------|
| `frontend/src/services/supabase.js` | Supabase client & helpers | CRUD operations, real-time subscriptions, file storage, admin functions |
| `frontend/src/services/excelService.js` | Excel/CSV operations | Parse files, validate data, export to Excel/CSV, error handling |
| `frontend/src/services/backupService.js` | Backup operations interface | Backup management, restore functionality, scheduling |

### Frontend - Layouts (1 file)

| File | Purpose | Components |
|------|---------|-----------|
| `frontend/src/layouts/AdminLayout.jsx` | Admin dashboard layout | Sidebar navigation, top bar, 10 menu items, responsive design |

### Database (1 file)

| File | Purpose | Content |
|------|---------|---------|
| `database/migrations/001_supabase_schema.sql` | Complete Supabase schema | 13+ tables, RLS policies, storage buckets, triggers |

### Documentation (4 files)

| File | Purpose | Content |
|------|---------|---------|
| `docs/SUPABASE_GUIDE.md` | Supabase setup guide | Create project, config, migrations, troubleshooting, ~50 pages |
| `docs/ADVANCED_FEATURES.md` | Feature documentation | All features explained, workflows, examples, ~40 pages |
| `QUICKSTART.md` | Quick start checklist | 20-step setup guide, testing checklist, troubleshooting |
| `IMPLEMENTATION_SUMMARY.md` | Phase 2 technical summary | What was built, files created, architecture, metrics |

### Project Files (5 files)

| File | Purpose | Content |
|------|---------|---------|
| `README.md` | Main project readme | Updated with Supabase, features, quick start |
| `PHASE2_COMPLETION.md` | Phase 2 summary | Completion status, achievements, next steps |
| `.github/copilot-instructions.md` | Development guidelines | Project standards, conventions, workflows |

## Modified Files (6 files)

### Frontend - Core (5 files)

| File | Changes | Purpose |
|------|---------|---------|
| `frontend/src/App.jsx` | Added admin routes, role-based routing | Complete routing with /admin/* support |
| `frontend/src/context/authStore.js` | Rewrote with Supabase Auth | Supabase authentication instead of JWT |
| `frontend/src/hooks/useAuth.js` | Updated to use authStore | Provides auth context with Supabase methods |
| `frontend/src/components/ProtectedRoute.jsx` | Added role checking | Support for requiredRole parameter |
| `frontend/.env.example` | Added Supabase variables | VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY |

### Configuration (1 file)

| File | Changes | Purpose |
|------|---------|---------|
| `frontend/package.json` | Added new dependencies | @supabase/supabase-js, xlsx, papaparse |

## File Organization by Feature

### 🔐 Authentication
- `frontend/src/context/authStore.js` - Supabase Auth
- `frontend/src/hooks/useAuth.js` - Auth hook
- `frontend/src/components/ProtectedRoute.jsx` - Protected routes
- `frontend/src/pages/LoginPage.jsx` - Login UI

### 👥 Member Management
- `frontend/src/pages/AdminMembersPage.jsx` - Member CRUD
- `frontend/src/services/supabase.js` - Member DB operations

### 📥 Data Import
- `frontend/src/pages/AdminImportPage.jsx` - Import UI
- `frontend/src/services/excelService.js` - Parsing & validation

### 📤 Data Export
- `frontend/src/pages/AdminExportPage.jsx` - Export UI
- `frontend/src/services/excelService.js` - Export functions

### 🎛️ Settings
- `frontend/src/pages/AdminSettingsPage.jsx` - Settings UI
- `frontend/src/services/supabase.js` - Settings DB operations

### 📊 Dashboard
- `frontend/src/pages/AdminDashboardPage.jsx` - Dashboard UI
- `frontend/src/services/supabase.js` - Real-time subscriptions
- `frontend/src/layouts/AdminLayout.jsx` - Layout

### 💾 Backups
- `frontend/src/pages/AdminBackupsPage.jsx` - Backups UI (ready)
- `frontend/src/services/backupService.js` - Backup operations

### 🗄️ Database
- `database/migrations/001_supabase_schema.sql` - All tables & policies

### 📖 Documentation
- `docs/SUPABASE_GUIDE.md` - Setup
- `docs/ADVANCED_FEATURES.md` - Usage
- `QUICKSTART.md` - Quick start
- `IMPLEMENTATION_SUMMARY.md` - Summary
- `README.md` - Overview
- `PHASE2_COMPLETION.md` - Completion

## How to Navigate the Codebase

### To Understand the Project
1. Start with [README.md](README.md) - Overview
2. Read [QUICKSTART.md](QUICKSTART.md) - Setup
3. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What was built

### To Setup the System
1. Follow [QUICKSTART.md](QUICKSTART.md) step by step
2. Refer to [docs/SUPABASE_GUIDE.md](docs/SUPABASE_GUIDE.md) for detailed setup

### To Use the Features
1. Read [docs/ADVANCED_FEATURES.md](docs/ADVANCED_FEATURES.md)
2. Each feature has workflow examples
3. Screenshots would be helpful (to be added)

### To Understand the Code
1. Start with `frontend/src/App.jsx` - Routing
2. Check `frontend/src/layouts/AdminLayout.jsx` - Layout
3. Review `frontend/src/pages/` - Each feature's UI
4. Check `frontend/src/services/supabase.js` - Data operations

### To Extend the System
1. Review file structure and naming conventions
2. Follow patterns in existing pages
3. Use Supabase client helpers
4. Refer to `.github/copilot-instructions.md` for standards

## File Size Reference

### Pages (Large files - 150-300 lines each)
- AdminMembersPage.jsx
- AdminImportPage.jsx
- AdminExportPage.jsx
- AdminSettingsPage.jsx
- AdminDashboardPage.jsx

### Services (Medium files - 100-200 lines each)
- supabase.js
- excelService.js
- backupService.js

### Layouts (Small-Medium files - 50-100 lines)
- AdminLayout.jsx

### Database (Large - 500+ lines)
- 001_supabase_schema.sql

### Documentation (Large - 1000+ lines each)
- SUPABASE_GUIDE.md (~2000 lines)
- ADVANCED_FEATURES.md (~1500 lines)

## Quick File Lookup

### I want to...

**Create a new page**
→ Look at: `frontend/src/pages/AdminMembersPage.jsx`
→ Pattern: Use components from `frontend/src/components/ui.jsx`

**Add real-time features**
→ Look at: `frontend/src/services/supabase.js` (subscriptions)
→ Example: `frontend/src/pages/AdminDashboardPage.jsx`

**Work with Excel data**
→ Look at: `frontend/src/services/excelService.js`
→ Example: `frontend/src/pages/AdminImportPage.jsx`

**Access database**
→ Look at: `frontend/src/services/supabase.js` (db helpers)
→ Schema: `database/migrations/001_supabase_schema.sql`

**Protect routes by role**
→ Look at: `frontend/src/components/ProtectedRoute.jsx`
→ Usage: `frontend/src/App.jsx`

**Manage auth state**
→ Look at: `frontend/src/context/authStore.js`
→ Hook: `frontend/src/hooks/useAuth.js`

**Configure system**
→ Look at: `frontend/src/pages/AdminSettingsPage.jsx`
→ Settings table: `database/migrations/001_supabase_schema.sql` (system_settings)

## Dependency Tree

```
App.jsx
  ├── AdminLayout.jsx
  │   └── [10 admin pages]
  ├── ProtectedRoute.jsx
  │   └── useAuth hook
  │       └── authStore (Zustand)
  │           └── supabase.js
  └── [Public pages]
      └── LoginPage
          └── authStore

Admin Pages (all use)
  ├── supabase.js (data operations)
  ├── excelService.js (import/export)
  ├── ui.jsx components
  └── useAuth hook
```

## Import Paths Reference

```javascript
// Authentication
import { useAuth } from '../hooks/useAuth.js'
import { useAuthStore } from '../context/authStore.js'

// UI Components
import { Button, Card, Input, Spinner } from '../components/ui.jsx'

// Services
import { supabase, db, realtime } from '../services/supabase.js'
import { parseFile, exportToExcel, validateMemberData } from '../services/excelService.js'
import { createBackup, restoreBackup } from '../services/backupService.js'

// Layouts
import AdminLayout from '../layouts/AdminLayout.jsx'
```

## Environment Configuration

**Frontend (.env)**
```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[anon_key]
VITE_API_URL=http://localhost:5000/api
```

**Get from:**
- Supabase Dashboard → Settings → API Keys → Project URL
- Supabase Dashboard → Settings → API Keys → Anon Key

## Database Configuration

**Supabase Dashboard → SQL Editor**
- Run: `database/migrations/001_supabase_schema.sql`
- Creates 13+ tables with RLS policies
- Sets up 3 storage buckets
- Configures real-time subscriptions

## Testing the Setup

1. **Verify Supabase connection**
   - Check `.env` variables
   - Test at http://localhost:3000/login

2. **Verify database**
   - Go to Supabase Dashboard → Tables
   - Should see all 13 tables

3. **Verify admin user**
   - Go to Supabase Dashboard → Authentication → Users
   - Should see admin@kysbfitness.com

4. **Test dashboard**
   - Login with admin credentials
   - Go to Admin → Dashboard
   - Should see stats and recent transactions

## Common Tasks

### Add a new admin page
1. Create `frontend/src/pages/AdminNewPage.jsx`
2. Use AdminLayout wrapper
3. Import supabase helpers
4. Add route to `App.jsx`
5. Add menu item to `AdminLayout.jsx`

### Add a new database table
1. Modify `database/migrations/001_supabase_schema.sql`
2. Re-run migration in Supabase
3. Add db helpers to `frontend/src/services/supabase.js`
4. Use in pages

### Export data
1. Add export function to `frontend/src/services/excelService.js`
2. Use in `AdminExportPage.jsx`
3. Test download

### Import data
1. Add validation to `frontend/src/services/excelService.js`
2. Use in `AdminImportPage.jsx`
3. Test with sample file

---

**Last Updated:** June 20, 2026
**Version:** 1.0.0
