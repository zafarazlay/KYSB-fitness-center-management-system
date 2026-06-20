/**
 * Authentication Routes
 * All authentication-related endpoints
 */
import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validators.js';
import { loginSchema, registerSchema, updateUserSchema } from '../validators/authValidator.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validate(loginSchema, 'body'), authController.login);

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validate(registerSchema, 'body'), authController.register);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

/**
 * PUT /api/auth/me
 * Update current user
 */
router.put(
  '/me',
  authenticateToken,
  validate(updateUserSchema, 'body'),
  authController.updateCurrentUser
);

export default router;
