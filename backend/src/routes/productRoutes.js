// productRoutes.js
// Express Router for Product listings, updates, and gallery images

import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addProductImage, 
  removeProductImage 
} from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin restricted routes
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

// Image management routes (Admin Only)
router.post('/:id/images', authenticateToken, isAdmin, addProductImage);
router.delete('/images/:imageId', authenticateToken, isAdmin, removeProductImage);

export default router;
