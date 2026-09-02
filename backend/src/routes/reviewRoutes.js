// reviewRoutes.js
// Express Router for Product Reviews and Ratings

import express from 'express';
import { createReview, getProductReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get reviews of a product
router.get('/product/:productId', getProductReviews);

// Protected: Post, edit, and delete reviews
router.post('/', authenticateToken, createReview);
router.put('/:reviewId', authenticateToken, updateReview);
router.delete('/:reviewId', authenticateToken, deleteReview);

export default router;
