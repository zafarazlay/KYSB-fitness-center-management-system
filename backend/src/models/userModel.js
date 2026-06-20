/**
 * User Model
 * Database operations for users
 */
import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

/**
 * Create User
 */
export const createUser = async (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
  } = userData;

  const hashedPassword = await hashPassword(password);

  const query = `
    INSERT INTO users (email, password, first_name, last_name, role, phone_number, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING id, email, first_name, last_name, role, phone_number, created_at
  `;

  const result = await pool.query(query, [
    email,
    hashedPassword,
    firstName,
    lastName,
    role,
    phoneNumber,
  ]);

  return result.rows[0];
};

/**
 * Get User by Email
 */
export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * Get User by ID
 */
export const getUserById = async (id) => {
  const query = 'SELECT id, email, first_name, last_name, role, phone_number, status FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Verify User Password
 */
export const verifyUserPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return null;

  return user;
};

/**
 * Update User
 */
export const updateUser = async (userId, updateData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    status,
  } = updateData;

  const query = `
    UPDATE users 
    SET first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone_number = COALESCE($3, phone_number),
        status = COALESCE($4, status),
        updated_at = NOW()
    WHERE id = $5
    RETURNING id, email, first_name, last_name, role, phone_number, status, updated_at
  `;

  const result = await pool.query(query, [
    firstName,
    lastName,
    phoneNumber,
    status,
    userId,
  ]);

  return result.rows[0] || null;
};
