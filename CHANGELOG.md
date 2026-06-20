# Changelog

All notable changes to the AKYSB Fitness Center Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Mobile app (iOS/Android)
- Advanced analytics dashboard
- Multi-branch support
- Integration with payment gateways
- SMS notifications
- WhatsApp integration

## [1.1.0] - 2026-06-20

### Added
- **Membership Tiers System**: Implemented category-wise pricing
  - Kids: Indoor games only (PKR 500)
  - Adults: Gym + Indoor games (PKR 1,500)
  - Seniors: Gym + Indoor games (PKR 1,500)
  - Custom: Flexible pricing
- **RegisterPage Component**: New user registration interface
- **GitHub Actions CI/CD**: Automated build and deployment pipeline
- **Comprehensive Documentation**: README, Contributing guide, Changelog
- **AKYSB Branding**: Updated all UI elements to reflect AKYSB brand

### Changed
- Updated auth store to use backend API instead of Supabase
- Improved login page error handling and display
- Fixed import paths in frontend components
- Enhanced database schema with membership_tiers table

### Fixed
- AdminLayout import path issues
- Login error display functionality
- Frontend server startup issues
- Component file structure organization

## [1.0.0] - 2026-06-15

### Initial Release

#### Added
- **Backend API**
  - Express.js server with RESTful endpoints
  - JWT authentication with bcrypt password hashing
  - PostgreSQL database integration
  - User management (Admin/Member roles)
  - Error handling and validation middleware
  - CORS and security middleware
  - Rate limiting

- **Frontend Application**
  - React.js with Vite build tool
  - React Router for client-side routing
  - Tailwind CSS for styling
  - ShadCN UI component library
  - Zustand for state management
  - Axios HTTP client
  - Login and Dashboard pages
  - Admin layout with sidebar

- **Database**
  - 13 comprehensive tables
  - User management table
  - Members table with tier support
  - Payments table with status tracking
  - Transactions table for financial tracking
  - Member ledger for balance calculations
  - Late fees table
  - Expenses table
  - Audit logs table
  - Email logs table
  - Bank details table
  - Payment settings table
  - Announcements table

- **Docker Support**
  - Dockerfile for backend
  - Dockerfile for frontend
  - Docker Compose configuration
  - Nginx reverse proxy
  - Complete containerization setup

- **Documentation**
  - README with project overview
  - Setup guide for local development
  - API documentation
  - Database schema documentation
  - Deployment guide

- **Features**
  - User authentication (login/logout)
  - Role-based access control
  - Protected routes
  - Member dashboard
  - Admin dashboard skeleton
  - Error handling and validation
  - Responsive UI design

### Technology Stack
- Frontend: React 18.2, Vite 5.0, Tailwind CSS 3.3, React Router 6.18
- Backend: Node.js, Express.js, PostgreSQL, JWT
- DevOps: Docker, Docker Compose, Nginx

---

## Version History

### v1.1.0
- **Date**: 2026-06-20
- **Branch**: agents/smoggy-scallop
- **Commit**: 38cbec5e
- **Status**: ✅ Released

### v1.0.0
- **Date**: 2026-06-15
- **Branch**: main
- **Status**: ✅ Initial Release

---

## Planned Releases

### v1.2.0 (Q3 2026)
- Enhanced member management
- Payment system improvements
- Admin dashboard analytics
- Email notification system

### v2.0.0 (Q4 2026)
- Mobile app support
- Advanced analytics
- Multi-branch management
- Payment gateway integration

---

## Legend

- ✨ New feature
- 🐛 Bug fix
- 📚 Documentation
- ⚡ Performance improvement
- 🔒 Security update
- 🗑️ Deprecated

---

For more information, visit the [GitHub repository](https://github.com/zafarazlay/KYSB-fitness-center-management-system)

**Last Updated**: June 20, 2026
