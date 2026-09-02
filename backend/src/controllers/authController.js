// authController.js
// Authentication controllers for users and administrators

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Generate a JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'framewala_jwt_super_secret_key_123!',
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(sendError('Email address is already registered.'));
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUserId = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role: 'customer' // default role
    });

    const user = await User.findById(newUserId);
    const token = generateToken(user);

    res.status(201).json(sendSuccess('User registered successfully.', { user, token }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user by email
    const userRecord = await User.findByEmail(email);
    if (!userRecord) {
      return res.status(401).json(sendError('Invalid email or password.'));
    }

    // Verify account active status
    if (!userRecord.is_active) {
      return res.status(403).json(sendError('Your account has been deactivated. Please contact support.'));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      return res.status(401).json(sendError('Invalid email or password.'));
    }

    // Format safe user info object (exclude password)
    const { password: _, ...user } = userRecord;
    const token = generateToken(user);

    res.status(200).json(sendSuccess('Login successful.', { user, token }));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json(sendError('User not found.'));
    }
    res.status(200).json(sendSuccess('Profile retrieved successfully.', { user }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const userId = req.user.user_id;

    const updated = await User.updateProfile(userId, { first_name, last_name, phone });
    if (!updated) {
      return res.status(400).json(sendError('Could not update profile or profile details unchanged.'));
    }

    const user = await User.findById(userId);
    res.status(200).json(sendSuccess('Profile updated successfully.', { user }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.user_id;

    // Load full user details including the password hash
    const userRecord = await User.findByEmail(req.user.email);
    if (!userRecord) {
      return res.status(404).json(sendError('User record not found.'));
    }

    // Check old password
    const isMatch = await bcrypt.compare(old_password, userRecord.password);
    if (!isMatch) {
      return res.status(400).json(sendError('Incorrect current password.'));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const updated = await User.updatePassword(userId, hashedPassword);

    if (!updated) {
      return res.status(500).json(sendError('Failed to change password. Please try again.'));
    }

    res.status(200).json(sendSuccess('Password changed successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password (Mock Service)
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // Security best practice: don't reveal if email doesn't exist
      return res.status(200).json(sendSuccess('If that email is registered, we have sent instructions to reset the password.'));
    }

    // In a real application: generate token, save to db, send mail.
    // For Phase 3: return mock message
    console.log(`[Mock Reset Request] Password reset token requested for: ${email}`);

    res.status(200).json(sendSuccess('Password reset link sent successfully (mocked).'));
  } catch (error) {
    next(error);
  }
};
