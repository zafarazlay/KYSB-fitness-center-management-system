# Supabase Setup Guide - AKYSB Fitness Center Management System

**مکمل Step by Step Guide - Urdu + English**

---

## 📋 Table of Contents

1. [Supabase Account اور Project بنانا](#1-supabase-account-setup)
2. [Database Schema Import کرنا](#2-database-schema)
3. [Authentication Setup](#3-authentication)
4. [Row Level Security (RLS)](#4-row-level-security)
5. [API Configuration](#5-api-configuration)
6. [Environment Variables](#6-environment-variables)
7. [Frontend Integration](#7-frontend-integration)
8. [Testing](#8-testing)

---

## 1️⃣ Supabase Account Setup

### Step 1.1: Supabase پر Account بنانا

1. **Website پر جائیں**: https://supabase.com
2. **"Sign Up" بٹن دبائیں**
3. **GitHub سے Sign Up کریں** (آسان ہے)
   - GitHub سے login کریں
   - Authorize Supabase کریں

### Step 1.2: نیا Project بنانا

```
1. Supabase Dashboard میں جائیں
2. "New Project" بٹن دبائیں
3. درج ذیل معلومات بھریں:

   ┌─────────────────────────────────────────┐
   │ Project Name: AKYSB Fitness Center      │
   │ Database Password: [Strong Password!]   │
   │ Region: asia-south1 (بہتر رفتار)        │
   │ Pricing Plan: Free (ابتدائی طور پر)    │
   └─────────────────────────────────────────┘

4. "Create New Project" دبائیں
5. **انتظار کریں** (2-5 منٹ لگ سکتے ہیں)
```

### Step 1.3: Project تیار ہونے کی تصدیق

```
جب Project تیار ہو تو یہ نظر آئے گا:

✅ Project Dashboard
✅ Database Active
✅ API URLs دستیاب
✅ Authentication Active
```

---

## 2️⃣ Database Schema Import

### Step 2.1: SQL Editor میں جانا

```
1. Supabase Dashboard میں جائیں
2. بائیں طرف "SQL Editor" پر کلک کریں
3. "New Query" بٹن دبائیں
```

### Step 2.2: Schema SQL Copy کریں

**فائل سے SQL حاصل کریں:**

```bash
# Project root میں جائیں
cd D:\AKYSB.worktrees\agents-smoggy-scallop

# Schema فائل کھولیں
cat database/schema.sql
```

### Step 2.3: SQL کو Paste اور چلائیں

```sql
-- یہ Code Database میں چلائیں:

-- ===========================
-- CREATE ENUM TYPES
-- ===========================
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'late');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'easypaisa', 'jazzcash', 'online');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE notification_type AS ENUM ('payment', 'announcement', 'system', 'reminder');
CREATE TYPE membership_tier AS ENUM ('kids', 'adults', 'seniors', 'custom');

-- [باقی Schema یہاں آئے گا]

-- اب "Run" بٹن دبائیں یا Ctrl+Enter
```

### Step 2.4: Verification

```
Schema کامیاب ہو گیا اگر:
✅ کوئی Error نہ آئے
✅ Output میں "executed successfully" دکھے
✅ SQL Editor میں Tables دیکھنے کو ملیں
```

---

## 3️⃣ Authentication Setup

### Step 3.1: Authentication providers Enable کریں

```
Dashboard میں:

1. بائیں طرف "Authentication" → "Providers" پر جائیں
2. مختلف Providers کو Enable/Disable کریں:

   ✅ Enable کریں:
   - Email (پہلے سے Enable ہے)
   - GitHub (ڈیمو کے لیے)
   - Google (اختیاری)

   ⚠️ Disable رہے (ابھی):
   - SMS
   - OAuth (جب تیار ہوں)
```

### Step 3.2: Email Templates Setup

```
1. "Email Templates" میں جائیں
2. یہ Templates Customize کریں:

   a) Confirm signup email
      ├─ Subject: AKYSB - Confirm Your Email
      └─ Body: [AKYSB وہ لوگو اور رنگ استعمال کریں]

   b) Invite user
      ├─ Subject: AKYSB - Gym Membership Invitation
      └─ Body: [کسٹمائز کریں]

   c) Magic link
      ├─ Subject: AKYSB - Your Login Link
      └─ Body: [کسٹمائز کریں]

   d) Change email
      ├─ Subject: AKYSB - Confirm Email Change
      └─ Body: [کسٹمائز کریں]

   e) Reset password
      ├─ Subject: AKYSB - Reset Your Password
      └─ Body: [کسٹمائز کریں]
```

### Step 3.3: Authentication Settings

```
1. "Settings" → "Auth" میں جائیں
2. یہ Configure کریں:

   ┌─────────────────────────────────────┐
   │ Site URL: http://localhost:3000     │
   │ Redirect URLs:                      │
   │ ├─ http://localhost:3000/login      │
   │ ├─ http://localhost:3000/register   │
   │ └─ http://localhost:3000/dashboard  │
   │                                     │
   │ JWT Expiry: 3600 seconds (1 hour)  │
   │ Refresh Token: 604800 (7 days)     │
   │ Enable Email Confirmations: ON      │
   │ Auto Confirm Users: OFF (زیادہ محفوظ) │
   └─────────────────────────────────────┘

3. "Save" دبائیں
```

---

## 4️⃣ Row Level Security (RLS)

### Step 4.1: RLS Enable کریں

```
1. "SQL Editor" میں جائیں
2. یہ Query چلائیں:

   -- تمام Tables کے لیے RLS Enable کریں
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE members ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
   -- ... باقی Tables

3. "Run" دبائیں
```

### Step 4.2: RLS Policies بنائیں

```sql
-- Users Table Policy
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Members Table Policy
CREATE POLICY "Members visible to everyone" ON members
  FOR SELECT
  USING (true);

CREATE POLICY "Members can update own profile" ON members
  FOR UPDATE
  USING (user_id = (SELECT id FROM users WHERE auth.uid()::text = users.id::text))
  WITH CHECK (user_id = (SELECT id FROM users WHERE auth.uid()::text = users.id::text));

-- Payments Table Policy
CREATE POLICY "Users can view payments" ON payments
  FOR SELECT
  USING (
    member_id IN (SELECT id FROM members WHERE user_id = (SELECT id FROM users WHERE auth.uid()::text = users.id::text))
    OR (SELECT role FROM users WHERE auth.uid()::text = users.id::text) = 'admin'
  );

-- [باقی Policies]
```

---

## 5️⃣ API Configuration

### Step 5.1: API Keys حاصل کریں

```
1. Settings → API میں جائیں
2. یہ Keys دیکھیں:

   ┌────────────────────────────────────────┐
   │ Project URL (بیڈ یہ ہے):              │
   │ https://xxxxx.supabase.co              │
   │                                        │
   │ Anon Key (Public - محفوظ):            │
   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  │
   │                                        │
   │ Service Role Key (Secret - محفوظ):    │
   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  │
   └────────────────────────────────────────┘

3. یہ Keys **کہیں محفوظ رکھیں** - Share نہ کریں!
```

### Step 5.2: CORS Setup (اہم!)

```
1. Settings → API → CORS میں جائیں
2. یہ URLs شامل کریں:

   ┌──────────────────────────────────────┐
   │ http://localhost:3000                │
   │ http://localhost                     │
   │ https://yourdomain.com (بعد میں)    │
   └──────────────────────────────────────┘

3. "Save" دبائیں
```

---

## 6️⃣ Environment Variables

### Step 6.1: Backend میں Environment Setup

```bash
# File: backend/.env

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-key-here-min-32-chars

NODE_ENV=development
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:3000

# Email Configuration (بعد میں)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 6.2: Frontend میں Environment Setup

```bash
# File: frontend/.env

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AKYSB Fitness Center
```

---

## 7️⃣ Frontend Integration

### Step 7.1: Supabase Client Setup

```bash
# Frontend میں Supabase Package install کریں
cd frontend
npm install @supabase/supabase-js
```

### Step 7.2: Supabase Config بنائیں

```javascript
// File: frontend/src/services/supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth subscription کے لیے
export const setupAuthListener = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );
  return subscription;
};
```

### Step 7.3: Login Function Setup

```javascript
// File: frontend/src/services/authService.js

import { supabase } from './supabase';

export const authService = {
  // Email/Password Login
  loginWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Email/Password Register
  registerWithEmail: async (email, password, firstName, lastName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get Current Session
  getCurrentSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};
```

### Step 7.4: Update Auth Store

```javascript
// File: frontend/src/context/authStore.js

import { create } from 'zustand';
import { supabase } from '../services/supabase';
import * as authService from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, session } = await authService.loginWithEmail(email, password);
      set({
        user,
        isAuthenticated: !!session,
        isLoading: false,
      });
      localStorage.setItem('authToken', session?.access_token);
      return { user, session };
    } catch (error) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
      localStorage.removeItem('authToken');
    } catch (error) {
      set({ error: error.message || 'Logout failed' });
      throw error;
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const session = await authService.getCurrentSession();
      if (session) {
        set({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },
}));
```

---

## 8️⃣ Testing

### Step 8.1: Supabase Connection Test

```bash
# Backend میں Test کریں
cd backend

# Supabase سے Connect کریں
npm run dev
```

### Step 8.2: Database Query Test

```javascript
// Test Script بنائیں
// File: backend/test-supabase.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Database میں Query چلائیں
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase Connected!');
    console.log('Users found:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testConnection();
```

### Step 8.3: Frontend Login Test

```
1. Frontend کو Start کریں:
   npm run frontend:dev

2. http://localhost:3000 کھولیں

3. یہ Test کریں:
   ✅ Signup سے نیا Account بنائیں
   ✅ Email سے Confirm کریں
   ✅ Login کریں
   ✅ Dashboard دیکھیں
```

---

## ⚙️ Advanced Configuration

### Configuration 1: Automatic Backups

```
1. Settings → Backups میں جائیں
2. Backup Frequency: Daily
3. Retention: 7 days (Free Plan)
4. "Enable Automated Backups" چیک کریں
```

### Configuration 2: Monitoring

```
1. Database → Query Performance میں جائیں
2. Slow Queries دیکھیں
3. Indexes Optimize کریں اگر ضرورت ہو
```

### Configuration 3: Real-Time Updates

```javascript
// Real-time Subscriptions کے لیے

const subscription = supabase
  .from('payments')
  .on('*', payload => {
    console.log('Payment updated:', payload);
    // UI Update کریں
  })
  .subscribe();

// Unsubscribe کریں جب ضرورت نہ ہو
subscription.unsubscribe();
```

---

## 🔐 Security Checklist

```
✅ Checklist پوری کریں:

1. ☐ RLS Enable ہے تمام Tables میں
2. ☐ CORS صحیح URLs میں ہے
3. ☐ Email Confirmations Enable ہے
4. ☐ Service Role Key محفوظ رکھی گئی ہے
5. ☐ Anon Key صرف Public operations میں استعمال ہو رہی ہے
6. ☐ Rate Limiting Enable ہے (Pro Plan میں)
7. ☐ Firewall Rules Configure ہیں (اگر ضروری ہو)
8. ☐ Backups Enable ہیں
9. ☐ Two-Factor Authentication Setup کیا ہے (بعد میں)
10. ☐ اہم Data Encrypted ہے
```

---

## 🚀 Deployment (بعد میں)

```
جب Production میں جانے سے پہلے:

1. Database Migrate کریں Production میں
2. Environment Variables Update کریں
3. SSL Certificate Setup کریں
4. Rate Limiting Enable کریں
5. Monitoring Setup کریں
6. Backup Strategy تیار کریں
```

---

## ❓ FAQ

**Q: Supabase Free Plan کتنا استعمال دیتا ہے?**
A: 
- 500 MB Database
- 1 GB Storage
- API Calls Unlimited (Rate Limited)
- بہت اچھا چھوٹے Projects کے لیے

**Q: کیا ہم PostgreSQL Directly استعمال کر سکتے ہیں?**
A: جی ہاں! Connection String سے:
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Q: Data کو کیسے Backup کریں?**
A:
```bash
# Supabase سے Export کریں
pg_dump postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres > backup.sql

# دوبارہ Import کریں
psql postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres < backup.sql
```

**Q: RLS میں مسئلہ ہو رہا ہے?**
A: 
```
1. RLS Policy دوبارہ Check کریں
2. auth.uid() صحیح ہے یا نہیں دیکھیں
3. Database Logs میں Errors دیکھیں
```

---

## 📞 Support اور Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Discord Community**: https://discord.supabase.com

---

**آخری Update**: June 21, 2026
**Status**: ✅ مکمل اور تیار

مزید سوالات کے لیے GitHub Issues میں رابطہ کریں!
