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


const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin restricted routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Image management routes (Admin Only)
router.post('/:id/images', addProductImage);
router.delete('/images/:imageId', removeProductImage);

export default router;
