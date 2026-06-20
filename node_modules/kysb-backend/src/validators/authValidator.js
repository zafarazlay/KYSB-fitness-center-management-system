/**
 * Validation Schemas
 * Joi validation schemas for API endpoints
 */
import Joi from 'joi';

/**
 * Login Validation Schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

/**
 * Register Validation Schema
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
});

/**
 * Update User Validation Schema
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
}).min(1);
