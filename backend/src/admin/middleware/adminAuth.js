// adminAuth.js
// Dedicated middleware for the Admin portal

import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/responseHelper.js';

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(sendError('Access Token required.', { details: 'No token provided in Authorization header.' }));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'framewala_jwt_super_secret_key_123!', (err, user) => {
    if (err) {
      return res.status(401).json(sendError('Invalid or expired token.', { details: err.message }));
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json(sendError('Forbidden. Admin access required.', { details: 'User role lacks sufficient permissions.' }));
    }
    
    req.user = user;
    next();
  });
};
