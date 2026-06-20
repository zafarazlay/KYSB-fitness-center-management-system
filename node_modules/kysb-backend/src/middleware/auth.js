/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
import { verifyToken } from '../utils/auth.js';
import { sendError } from '../utils/response.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

/**
 * Verify JWT Token Middleware
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendError(res, 401, 'Access token is required');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired token');
    }

    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 401, 'Authentication failed');
  }
};

/**
 * Role-Based Authorization Middleware
 * Restricts access to specific user roles
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'You do not have permission to access this resource');
    }

    next();
  };
};

/**
 * Optional Authentication
 * Attaches user to request if token is valid, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
