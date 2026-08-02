// authRoutes.js
// Express Router for User Authentication endpoints

import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, forgotPassword } from '../controllers/authController.js';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { registerValidationRules, loginValidationRules } from '../validations/authValidation.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerValidationRules, handleValidationErrors, register);
router.post('/login', loginValidationRules, handleValidationErrors, login);
router.post('/forgot-password', forgotPassword);

// Protected profile routes (Requires JWT token)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Protected address routes
router.get('/addresses', authenticateToken, getAddresses);
router.post('/addresses', authenticateToken, createAddress);
router.put('/addresses/:id', authenticateToken, updateAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);

export default router;
