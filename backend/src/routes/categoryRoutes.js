// categoryRoutes.js
// Express Router for Product Categories CRUD

import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin restricted routes
router.post('/', authenticateToken, isAdmin, createCategory);
router.put('/:id', authenticateToken, isAdmin, updateCategory);
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

export default router;
