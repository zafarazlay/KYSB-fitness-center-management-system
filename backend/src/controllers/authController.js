/**
 * Authentication Controller
 * Handles user login, registration, and token management
 */
import * as userModel from '../models/userModel.js';
import { generateToken } from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ValidationError, ConflictError, AuthenticationError } from '../utils/errors.js';

/**
 * Login Controller
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verify user credentials
    const user = await userModel.verifyUserPassword(email, password);
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'active') {
      return sendError(res, 403, 'User account is inactive');
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Return user data and token
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phoneNumber: user.phone_number,
    };

    sendSuccess(res, 200, 'Login successful', {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register Controller
 */
export const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, 'Email already registered');
    }

    // Create new user
    const user = await userModel.createUser({
      email,
      password,
      firstName,
      lastName,
      role: 'member',
      phoneNumber,
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    sendSuccess(res, 201, 'User registered successfully', {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User retrieved successfully', {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phoneNumber: user.phone_number,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Current User
 */
export const updateCurrentUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    const user = await userModel.updateUser(req.user.id, {
      firstName,
      lastName,
      phoneNumber,
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User updated successfully', {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
    });
  } catch (error) {
    next(error);
  }
};
