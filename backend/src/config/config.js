import dotenv from 'dotenv';

dotenv.config();

/**
 * Application Configuration
 * Centralized configuration for the entire application
 */
const config = {
  app: {
    port: process.env.BACKEND_PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    name: 'KYSB Fitness Center Management System',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: {
      email: process.env.SMTP_FROM_EMAIL || 'noreply@kysbfitness.com',
      name: process.env.SMTP_FROM_NAME || 'KYSB Fitness Center',
    },
  },
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
    path: process.env.UPLOAD_PATH || './uploads',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@kysbfitness.com',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  cron: {
    enabled: process.env.CRON_EMAIL_REMINDER_ENABLED === 'true',
    reminderTime: process.env.CRON_EMAIL_REMINDER_TIME || '0 9 * * *',
  },
  payment: {
    dueDateDay: parseInt(process.env.DUE_DATE_DAY || '5'),
    gracePeriodDays: parseInt(process.env.GRACE_PERIOD_DAYS || '5'),
    lateFeAmount: parseInt(process.env.LATE_FEE_AMOUNT || '500'),
    lateFeePercentage: parseInt(process.env.LATE_FEE_PERCENTAGE || '5'),
  },
};

export default config;
