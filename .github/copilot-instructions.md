<!-- KYSB Fitness Center Management System - Development Instructions -->

## Project Overview

This is a production-grade full-stack gym management system built with:
- **Frontend**: React.js with Vite, Tailwind CSS, ShadCN UI
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Deployment**: Docker & Docker Compose

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Setup Database**
   ```bash
   createdb kysb_fitness
   psql -U postgres -d kysb_fitness -f database/schema.sql
   psql -U postgres -d kysb_fitness -f database/seeds/seed.sql
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

### Docker Deployment

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## Project Structure

```
AKYSB/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database queries
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic (email, PDF, etc)
│   │   ├── validators/     # Input validation schemas
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Helper functions
│   │   ├── cron/           # Scheduled jobs
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/               # React.js Web App
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Layout templates
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # State management (Zustand)
│   │   ├── services/      # API calls
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── database/
│   ├── schema.sql         # Database tables and indexes
│   └── seeds/
│       └── seed.sql       # Sample data
├── docker/                # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── nginx.conf
├── docs/                  # Documentation
│   ├── SETUP_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
└── README.md
```

## Key Features Status

### ✅ Completed
- Project structure and scaffolding
- Backend server with Express.js
- Authentication system (JWT, bcrypt)
- User model and auth routes
- Frontend setup with React + Vite
- Tailwind CSS configuration
- Database schema with 13 tables
- Docker containerization
- Documentation

### 🔄 In Progress / To Implement

**Phase 2 - Member Management:**
- Member profile CRUD
- Member search and filtering
- Member status management
- Bulk operations

**Phase 3 - Payment System:**
- Payment recording (admin & member)
- Payment approval workflow
- Late fee calculation
- Payment notifications

**Phase 4 - Financial Module:**
- Transaction management
- Expense tracking
- Ledger management
- Financial reports

**Phase 5 - Admin Dashboard:**
- Dashboard analytics
- Charts and graphs
- Revenue reports
- Member statistics

**Phase 6 - Additional Features:**
- Email notification system
- Cron jobs for reminders
- Receipt generation (PDF)
- Audit logging
- Announcement system

## Development Workflow

### Starting a New Feature

1. **Create feature branch**
   ```bash
   git checkout -b feature/member-management
   ```

2. **Update database (if needed)**
   - Add migrations
   - Update schema.sql

3. **Create API endpoints**
   - Add routes in `backend/src/routes/`
   - Create controllers in `backend/src/controllers/`
   - Create models in `backend/src/models/`
   - Add validators in `backend/src/validators/`

4. **Create React components**
   - Create pages in `frontend/src/pages/`
   - Create components in `frontend/src/components/`
   - Add hooks in `frontend/src/hooks/`
   - Update routing in `frontend/src/App.jsx`

5. **Test locally**
   ```bash
   npm run backend:dev
   npm run frontend:dev
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: implement member management"
   git push origin feature/member-management
   ```

## Code Standards

### Backend (Node.js)

- Use ES modules (import/export)
- Follow REST API conventions
- Add JSDoc comments for functions
- Use try-catch for async operations
- Validate all inputs
- Return consistent response format

### Frontend (React)

- Use functional components with hooks
- Implement proper error handling
- Add loading states
- Use context/Zustand for state management
- Keep components modular and reusable
- Add prop validation

## Testing

### Manual Testing

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kysbfitness.com","password":"Admin@123"}'

# Test API health
curl http://localhost:5000/api/health
```

### Browser DevTools

- Use React DevTools for component debugging
- Use Redux/Zustand DevTools for state management
- Check Network tab for API calls

## Database Queries

### Common Queries

```sql
-- Get all active members
SELECT * FROM members 
JOIN users ON members.user_id = users.id 
WHERE users.status = 'active';

-- Get unpaid members
SELECT * FROM members 
WHERE id IN (
  SELECT member_id FROM payments 
  WHERE status = 'pending' AND month = CURRENT_DATE
);

-- Get monthly revenue
SELECT SUM(amount) FROM payments 
WHERE status = 'approved' 
AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE);
```

## Environment Variables

### Backend
- `BACKEND_PORT` - Server port (default: 5000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database config
- `JWT_SECRET` - Secret key for JWT tokens
- `SMTP_*` - Email configuration
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

## Debugging

### Backend Debugging

1. **Add console.logs**
   ```js
   console.log('Debug info:', variable);
   ```

2. **Use Morgan for request logging** (already configured)

3. **Check backend logs**
   ```bash
   npm run backend:dev
   ```

### Frontend Debugging

1. **Use React DevTools**
   - Install browser extension
   - Inspect component hierarchy
   - Watch state changes

2. **Use browser console**
   ```js
   console.log('Component rendered');
   ```

## Common Commands

```bash
# Development
npm run dev                 # Start all services
npm run backend:dev        # Backend only
npm run frontend:dev       # Frontend only

# Production build
npm run build              # Build both
npm run backend:build      # Backend build
npm run frontend:build     # Frontend build

# Database
npm run db:migrate        # Run migrations
npm run db:seed           # Seed test data

# Docker
docker-compose up -d      # Start containers
docker-compose down       # Stop containers
docker-compose logs -f    # View logs
```

## Performance Tips

1. **Database**
   - Use indexes on frequently queried columns
   - Batch operations when possible
   - Use pagination for large datasets

2. **Frontend**
   - Lazy load components
   - Memoize expensive computations
   - Optimize re-renders with React.memo

3. **Backend**
   - Use connection pooling
   - Cache frequent queries
   - Implement rate limiting

## Security Checklist

- [ ] All inputs validated
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS protection (React auto-escapes)
- [ ] CSRF tokens if needed
- [ ] Passwords hashed with bcrypt
- [ ] JWT secrets strong and unique
- [ ] HTTPS enabled in production
- [ ] Sensitive data not logged
- [ ] Environment variables not committed

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Docker Documentation](https://docs.docker.com/)

## Support

For questions or issues:
1. Check documentation in `/docs` folder
2. Review existing code and comments
3. Contact the development team

---

**Last Updated:** June 20, 2026
