# Quick Start Checklist
# KYSB Fitness Center Management System

## Pre-Setup Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Internet connection
- [ ] Email address for Supabase account
- [ ] Text editor or VS Code

## Step 1: Create Supabase Project (5 min)

- [ ] Visit https://supabase.com
- [ ] Click "Sign Up"
- [ ] Create account with email
- [ ] Verify email
- [ ] Create new project
  - [ ] Choose database password (note it)
  - [ ] Select PostgreSQL 15
  - [ ] Choose region (same as your location)
  - [ ] Wait 3-5 minutes for initialization
- [ ] Copy Project URL
- [ ] Copy Anon Key (from Settings → API Keys)
- [ ] Save these values temporarily

## Step 2: Setup Frontend Environment (2 min)

```bash
cd frontend
```

- [ ] Copy environment template:
```bash
cp .env.example .env
```

- [ ] Edit `.env` file with your values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Install Dependencies (3 min)

```bash
npm install
```

- [ ] Wait for installation to complete
- [ ] No errors should appear

## Step 4: Setup Database (2 min)

- [ ] Go to Supabase Dashboard
- [ ] Click "SQL Editor"
- [ ] Click "New Query"
- [ ] Open `database/migrations/001_supabase_schema.sql`
- [ ] Copy entire content
- [ ] Paste into SQL editor
- [ ] Click "Run"
- [ ] Wait for query to complete
- [ ] All 13 tables should be created

**Verify:**
- [ ] Go to "Tables" in Supabase
- [ ] Should see: members, payments, transactions, etc.

## Step 5: Create Admin User (2 min)

In Supabase Dashboard → Authentication → Users:

- [ ] Click "Invite user"
- [ ] Email: `admin@kysbfitness.com`
- [ ] Click "Send invite"
- [ ] Admin will receive email
- [ ] Click link and set password: `Admin@123`

**Note:** Change this password immediately after first login!

## Step 6: Create Storage Buckets (1 min)

In Supabase Dashboard → Storage:

- [ ] Click "New bucket"
- [ ] Name: `member-photos`
- [ ] Public: Yes
- [ ] Create

- [ ] Repeat for `payment-screenshots`
- [ ] Repeat for `backups` (set to Private)

## Step 7: Start Development (1 min)

```bash
npm run frontend:dev
```

- [ ] Wait for build to complete
- [ ] Should see "Local: http://localhost:3000"
- [ ] No errors in terminal

## Step 8: Test Login (1 min)

- [ ] Open http://localhost:3000
- [ ] Should see login page
- [ ] Enter:
  - Email: `admin@kysbfitness.com`
  - Password: `Admin@123`
- [ ] Click "Login"
- [ ] Should redirect to admin dashboard

**Congratulations! 🎉 System is running!**

## Initial Configuration (5 min)

Now that system is running, configure it:

### 1. Update Settings
- [ ] Go to Admin → Settings
- [ ] Update gym name
- [ ] Update gym email
- [ ] Update phone number
- [ ] Update address
- [ ] Review payment settings
- [ ] Click "Save Settings"

### 2. Create First Member (2 min)
- [ ] Go to Admin → Members
- [ ] Click "+ Add Member"
- [ ] Fill test member data
- [ ] Click "Create Member"
- [ ] Check member list updated

### 3. View Dashboard (1 min)
- [ ] Go to Admin → Dashboard
- [ ] Should see:
  - [ ] Total Members: 1
  - [ ] Active Members: 1
  - [ ] Recent Transactions list
- [ ] Dashboard is real-time ready

## Testing Checklist

### Member Management
- [ ] ✅ Create new member
- [ ] ✅ View member in list
- [ ] ✅ Search for member
- [ ] ✅ Edit member details
- [ ] ✅ Delete member

### Data Import
- [ ] ✅ Create sample Excel file with 3 members
- [ ] ✅ Go to Admin → Import Data
- [ ] ✅ Upload file
- [ ] ✅ Preview shows data
- [ ] ✅ Confirm import
- [ ] ✅ Check members created

### Data Export
- [ ] ✅ Go to Admin → Export Center
- [ ] ✅ Select "Members List"
- [ ] ✅ Select "Excel"
- [ ] ✅ Click Export
- [ ] ✅ File downloads

### Real-time Dashboard
- [ ] ✅ Open admin dashboard in two browser tabs
- [ ] ✅ In first tab: Add new member
- [ ] ✅ In second tab: Member count increases
- [ ] ✅ No refresh needed

### Settings
- [ ] ✅ Update gym name
- [ ] ✅ Update payment due date
- [ ] ✅ Save settings
- [ ] ✅ Settings persisted

## Troubleshooting

### "Cannot connect to Supabase"
- [ ] Check internet connection
- [ ] Verify VITE_SUPABASE_URL in .env
- [ ] Verify it starts with https://
- [ ] Check Supabase project is active

### "Invalid credentials"
- [ ] Verify admin user created in Supabase
- [ ] Check email is correct
- [ ] Verify password is correct
- [ ] Try password reset

### "Tables don't exist"
- [ ] Go back to Step 4
- [ ] Rerun database migration
- [ ] Verify no SQL errors
- [ ] Check tables in Supabase UI

### "Port 3000 already in use"
```bash
# Kill existing process or use different port:
npm run frontend:dev -- --port 3001
```

### "npm install fails"
```bash
# Clear npm cache and retry:
npm cache clean --force
npm install
```

## Next Steps

### Learn System Features
- [ ] Read SUPABASE_GUIDE.md
- [ ] Read ADVANCED_FEATURES.md
- [ ] Explore each admin page

### Add Test Data
- [ ] Create 10 test members
- [ ] Create test transactions
- [ ] Test member import
- [ ] Generate test reports

### Customize System
- [ ] Update gym information
- [ ] Configure payment settings
- [ ] Set late fee rules
- [ ] Update bank details

### Prepare for Production
- [ ] Change admin password
- [ ] Configure email templates
- [ ] Setup automated backups
- [ ] Review security settings
- [ ] Test complete workflows

### Deploy to Production
- [ ] Set up production Supabase project
- [ ] Configure production environment
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Setup custom domain
- [ ] Enable SSL/HTTPS
- [ ] Configure backups

## Important Notes

### Security
⚠️ Change default admin password immediately!
⚠️ Never commit .env file to git
⚠️ Use strong passwords (12+ characters)
⚠️ Enable 2FA for important accounts

### Backups
💾 Enable automatic backups (Supabase Pro)
💾 Download manual backups weekly
💾 Test restore process monthly

### Data
📊 Backup before major changes
📊 Test imports on dev environment first
📊 Verify exports are correct
📊 Keep audit logs enabled

## Help & Support

### Documentation
- SUPABASE_GUIDE.md - Setup and configuration
- ADVANCED_FEATURES.md - Feature usage
- IMPLEMENTATION_SUMMARY.md - What was built
- docs/ folder - All other documentation

### Resources
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- PostgreSQL Docs: https://postgresql.org/docs

### Issues
1. Check documentation first
2. Review error messages in console
3. Check Supabase dashboard logs
4. Try troubleshooting section above
5. Contact support if still stuck

## Estimated Timeline

- **Quick Start:** 20-30 minutes
- **Initial Config:** 5 minutes
- **Testing:** 10-15 minutes
- **Production Ready:** Add 1-2 hours for customization

**Total Time to Production:** ~2 hours

---

**Last Updated:** June 20, 2026
**Version:** 1.0.0

Ready to start? Begin with Step 1! 🚀
