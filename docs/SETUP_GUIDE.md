# KYSB Fitness Center Management System
# Setup and Deployment Guide

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- Docker & Docker Compose (for containerized deployment)
- Git
- npm or yarn

## Local Development Setup

### 1. Environment Configuration

Copy the environment templates:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit each `.env` file with your configuration:

**backend/.env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kysb_fitness
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=KYSB Fitness Center
```

### 2. Database Setup

Create PostgreSQL database:

```bash
createdb kysb_fitness
```

Run migrations:

```bash
psql -U postgres -d kysb_fitness -f database/schema.sql
```

Seed sample data:

```bash
psql -U postgres -d kysb_fitness -f database/seeds/seed.sql
```

### 3. Install Dependencies

```bash
npm install
```

This will install dependencies for both backend and frontend (monorepo setup).

### 4. Start Development Servers

**Option 1: Start all services**
```bash
npm run dev
```

**Option 2: Start individually**

Backend:
```bash
npm run backend:dev
```

Frontend:
```bash
npm run frontend:dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This will start:
- PostgreSQL database
- Node.js backend
- React frontend (Nginx)

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Stop Services

```bash
docker-compose -f docker/docker-compose.yml down
```

## Default Credentials

**Admin Account:**
- Email: admin@kysbfitness.com
- Password: Admin@123

**Member Account:**
- Email: member1@example.com
- Password: Member@123

⚠️ **IMPORTANT:** Change all default credentials in production!

## Project Structure

```
AKYSB/
├── backend/                  # Express.js backend
├── frontend/                 # React frontend
├── database/                 # Database files
│   ├── schema.sql
│   └── seeds/
├── docker/                   # Docker configuration
├── docs/                     # Documentation
└── README.md
```

## Build for Production

```bash
npm run build
```

This will build both backend and frontend for production.

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| BACKEND_PORT | Backend server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | kysb_fitness |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| SMTP_HOST | SMTP server host | smtp.gmail.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | - |
| SMTP_PASSWORD | SMTP password | - |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |
| VITE_APP_NAME | Application name | KYSB Fitness Center |

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -c "SELECT 1"
```

### Port Already in Use

Change port in environment variables or kill process using the port:

```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Installation Issues

Clear cache and reinstall:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions, contact the development team.
