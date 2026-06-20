# Supabase Setup Checklist - AKYSB Fitness Center

**فوری Checklist - جو کچھ کرنا ہے وہی یہاں ہے**

---

## 🚀 Quick Setup (5 منٹ)

### ✅ Step 1: Account بنائیں (2 منٹ)
- [ ] https://supabase.com پر جائیں
- [ ] GitHub سے Sign Up کریں
- [ ] "New Project" بنائیں
- [ ] Database Password محفوظ رکھیں
- [ ] Region: asia-south1 Select کریں
- [ ] Project بننے کا انتظار کریں (2-3 منٹ)

### ✅ Step 2: Database Schema Load کریں (2 منٹ)
- [ ] SQL Editor کھولیں (بائیں طرف)
- [ ] "New Query" دبائیں
- [ ] یہ فائل سے SQL Copy کریں:
  ```
  D:\AKYSB.worktrees\agents-smoggy-scallop\database\schema.sql
  ```
- [ ] Paste کریں اور "Run" دبائیں
- [ ] Tables بننے کا انتظار کریں

### ✅ Step 3: Keys حاصل کریں (1 منٹ)
- [ ] Settings → API میں جائیں
- [ ] Project URL Copy کریں:
  ```
  https://xxxxx.supabase.co
  ```
- [ ] Anon Key Copy کریں
- [ ] Service Role Key Copy کریں
- [ ] کہیں محفوظ رکھیں!

---

## 🔧 Authentication Setup (10 منٹ)

### ✅ Step 4: Email Templates
- [ ] Authentication → Email Templates میں جائیں
- [ ] "Confirm signup" Template کو اپنا نام سے بنائیں:
  ```
  Subject: AKYSB - Confirm Your Email
  Body میں شامل کریں:
  - AKYSB Fitness Center Logo
  - مرحبا کا پیغام
  - Confirmation Link: {{ .ConfirmationURL }}
  ```
- [ ] "Magic link" Template بھی Update کریں

### ✅ Step 5: Authentication Settings
- [ ] Settings → Auth میں جائیں
- [ ] Site URL Set کریں: `http://localhost:3000`
- [ ] Redirect URLs شامل کریں:
  ```
  http://localhost:3000/login
  http://localhost:3000/register
  http://localhost:3000/dashboard
  ```
- [ ] JWT Expiry: 3600 seconds (1 hour)
- [ ] Enable Email Confirmations: ON
- [ ] Auto Confirm Users: OFF (محفوظ کے لیے)

### ✅ Step 6: CORS Setup
- [ ] Settings → API → CORS میں جائیں
- [ ] یہ URLs شامل کریں:
  ```
  http://localhost:3000
  http://localhost
  ```
- [ ] Save دبائیں

---

## 🛡️ Security Setup (5 منٹ)

### ✅ Step 7: Row Level Security Enable کریں
- [ ] SQL Editor میں جائیں
- [ ] یہ Query چلائیں:
  ```sql
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
  ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE member_ledgers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE late_fees ENABLE ROW LEVEL SECURITY;
  ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
  ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
  ```
- [ ] Run دبائیں

### ✅ Step 8: RLS Policies بنائیں
- [ ] SQL Editor میں نیا Query بنائیں
- [ ] یہ Policies شامل کریں:

```sql
-- Users Table
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid()::text = id::text OR (SELECT role FROM users WHERE id = auth.uid()::int) = 'admin');

-- Members Table
CREATE POLICY "Members visible to admins and owner"
ON members FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()::int) = 'admin' OR user_id = auth.uid()::int);

-- Payments Table
CREATE POLICY "Payments visible to admins and member"
ON payments FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()::int) = 'admin' OR 
       member_id IN (SELECT id FROM members WHERE user_id = auth.uid()::int));
```

- [ ] Run دبائیں

---

## 📝 Environment Variables Setup (5 منٹ)

### ✅ Step 9: Backend .env Setup
- [ ] فائل کھولیں: `backend/.env`
- [ ] یہ معلومات شامل کریں:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Server
NODE_ENV=development
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:3000

# Email (بعد میں)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password

# Application
APP_NAME=AKYSB Fitness Center
APP_VERSION=1.1.0
```

- [ ] Save کریں

### ✅ Step 10: Frontend .env Setup
- [ ] فائل کھولیں: `frontend/.env`
- [ ] یہ معلومات شامل کریں:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# API
VITE_API_URL=http://localhost:5000/api

# App
VITE_APP_NAME=AKYSB Fitness Center
VITE_APP_VERSION=1.1.0
```

- [ ] Save کریں

---

## 🧪 Testing (10 منٹ)

### ✅ Step 11: Database Connection Test
- [ ] Backend Start کریں:
  ```bash
  cd backend
  npm run dev
  ```
- [ ] Console میں یہ دیکھیں:
  ```
  ✅ AKYSB Fitness Center Management System
  Backend Server Started Successfully
  Server running on: http://localhost:5000
  ```

### ✅ Step 12: Frontend Start کریں
- [ ] نیا Terminal کھولیں
- [ ] Frontend Start کریں:
  ```bash
  cd frontend
  npm run dev
  ```
- [ ] Console میں یہ دیکھیں:
  ```
  VITE v5.4.21 ready in XXX ms
  ➜ Local: http://localhost:3000/
  ```

### ✅ Step 13: Application Test کریں
- [ ] Browser میں جائیں: http://localhost:3000
- [ ] یہ Test کریں:
  - [ ] Login Page کھلا ہے
  - [ ] "Register here" لنک ہے
  - [ ] Register کریں نیا Account
  - [ ] Email میں Confirmation Link آئے
  - [ ] Email Confirm کریں
  - [ ] Login کریں
  - [ ] Dashboard دیکھیں

---

## 🔍 Troubleshooting

### اگر Error آئے تو:

**Error: "Connection refused"**
```
❌ Problem: Backend نہیں چل رہا
✅ Solution:
1. backend میں چیک کریں کہ npm run dev چل رہا ہے
2. Port 5000 استعمال ہو رہا ہے
3. firewall سے اجازت لیں
```

**Error: "Invalid CORS origin"**
```
❌ Problem: CORS Settings غلط ہیں
✅ Solution:
1. Supabase میں Settings → API → CORS دیکھیں
2. http://localhost:3000 شامل ہے؟
3. اگر نہیں تو شامل کریں اور Save کریں
4. Browser Cache صاف کریں (Ctrl+Shift+Delete)
```

**Error: "Authentication failed"**
```
❌ Problem: Email Confirmation نہیں ہوا
✅ Solution:
1. Email میں Confirmation Link ڈھونڈیں
2. اگر نہیں ملا تو Spam folder دیکھیں
3. اگر Supabase نے Email نہیں بھیجی:
   - Email Templates Check کریں
   - Enable Email Confirmations دیکھیں
   - Supabase Logs دیکھیں
```

---

## 📊 Data Test کریں

### Sample Data Insert کریں:

```sql
-- Membership Tiers شامل کریں
INSERT INTO membership_tiers (tier_name, display_name, gym_fee, indoor_games_fee, combined_fee, is_active)
VALUES 
  ('kids', 'Kids Package', 0, 500, 500, TRUE),
  ('adults', 'Adults Package', 1000, 500, 1500, TRUE),
  ('seniors', 'Seniors Package', 1000, 500, 1500, TRUE),
  ('custom', 'Custom Package', 0, 0, 0, TRUE);

-- Admin User شامل کریں
INSERT INTO users (email, password, first_name, last_name, role, phone_number, status)
VALUES 
  ('admin@akysb.com', 'hashed_password', 'Admin', 'User', 'admin', '03001234567', 'active');
```

---

## ✨ Advanced (اختیاری - بعد میں)

- [ ] Google OAuth Setup کریں
- [ ] GitHub OAuth Setup کریں
- [ ] Email Sending Service Configure کریں
- [ ] Backups Automatic Setup کریں
- [ ] Monitoring Dashboard بنائیں
- [ ] Analytics Track کریں

---

## 🎯 Final Checklist

```
تمام اگلا قدم مکمل کریں؟

☑️ Supabase Account بنایا
☑️ Project بنایا
☑️ Database Schema Load کیا
☑️ Keys حاصل کیے
☑️ Authentication Setup کیا
☑️ CORS Configure کیا
☑️ RLS Enable کیا
☑️ Environment Variables Setup کیے
☑️ Backend Start ہوا
☑️ Frontend Start ہوا
☑️ Testing مکمل کی
☑️ Sample Data Insert کیا
☑️ Registration ✅ کام کر رہی ہے
☑️ Login ✅ کام کر رہی ہے
☑️ Dashboard ✅ کھل رہی ہے

🎉 تمام کچھ تیار ہے!
```

---

## 🚀 اگلا Step

```
اب آپ یہ کر سکتے ہیں:

1. ✅ GitHub پر Push کریں
2. ✅ Production Database Setup کریں
3. ✅ Domain Configure کریں
4. ✅ SSL Certificate Setup کریں
5. ✅ Production میں Deploy کریں
6. ✅ Monitoring اور Analytics Setup کریں
```

---

**بنایا**: June 21, 2026
**Version**: 1.0
**Status**: ✅ مکمل اور تیار ہے استعمال کے لیے!

کوئی سوال؟ GitHub Issues میں پوچھیں! 🎯
