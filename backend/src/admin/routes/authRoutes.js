// authRoutes.js
// Express Router for User Authentication endpoints

import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, forgotPassword } from '../controllers/authController.js';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { registerValidationRules, loginValidationRules } from '../../validations/authValidation.js';
import { handleValidationErrors } from '../../middleware/validateMiddleware.js';
import { adminAuth } from '../middleware/adminAuth.js';


const router = express.Router();

// Public auth routes
router.post('/register', registerValidationRules, handleValidationErrors, register);
router.post('/login', loginValidationRules, handleValidationErrors, login);
router.post('/forgot-password', forgotPassword);

// Protected profile routes (Requires valid admin JWT token)
router.get('/profile', adminAuth, getProfile);
router.put('/profile', adminAuth, updateProfile);
router.put('/change-password', adminAuth, changePassword);

// Protected address routes
router.get('/addresses', adminAuth, getAddresses);
router.post('/addresses', adminAuth, createAddress);
router.put('/addresses/:id', adminAuth, updateAddress);
router.delete('/addresses/:id', adminAuth, deleteAddress);

export default router;

