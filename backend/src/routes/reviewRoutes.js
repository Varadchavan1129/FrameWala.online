// reviewRoutes.js
// Express Router for Product Reviews and Ratings

import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get reviews of a product
router.get('/product/:productId', getProductReviews);

// Protected: Post a new product review
router.post('/', authenticateToken, createReview);

export default router;
