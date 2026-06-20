/**
 * Error Handling Middleware
 * Catches errors and sends standardized error responses
 */
import { sendError } from '../utils/response.js';

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  sendError(res, statusCode, message, err.errors || null);
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  sendError(res, 404, 'Route not found');
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
