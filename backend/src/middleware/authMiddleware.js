// authMiddleware.js
// Authentication and authorization middlewares

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendError } from '../utils/responseHelper.js';

dotenv.config();

/**
 * Verify JWT token and attach user to request object
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token could be 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(sendError('Access Token required.', { details: 'No token provided in Authorization header.' }));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'framewala_jwt_super_secret_key_123!', (err, user) => {
    if (err) {
      return res.status(403).json(sendError('Invalid or expired token.', { details: err.message }));
    }
    
    // Attach user payload (user_id, email, role) to the request object
    req.user = user;
    next();
  });
};

/**
 * Authorize only administrator accounts
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json(sendError('Forbidden. Admin access required.', { details: 'User role lacks sufficient permissions.' }));
  }
  next();
};
