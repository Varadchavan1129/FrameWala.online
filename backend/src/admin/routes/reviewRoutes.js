// reviewRoutes.js
// Express Router for Product Reviews and Ratings

import express from 'express';
import { createReview, getProductReviews, updateReview, deleteReview } from '../controllers/reviewController.js';


const router = express.Router();

// Public: Get reviews of a product
router.get('/product/:productId', getProductReviews);

// Protected: Post, edit, and delete reviews
router.post('/', createReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;
