// reviewController.js
// Controllers for Reviews and Ratings

import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * POST /api/reviews
 * Creates a rating and review on a product
 */
export const createReview = async (req, res, next) => {
  try {
    const { product_id, rating, review } = req.body;
    const userId = req.user.user_id;

    if (!product_id || rating === undefined) {
      return res.status(400).json(sendError('Product ID and rating are required.'));
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json(sendError('Rating must be an integer between 1 and 5.'));
    }

    // 1. Verify product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }

    // 2. Verify duplicate review prevention (one review per user per product)
    const alreadyReviewed = await Review.hasUserReviewed(userId, product_id);
    if (alreadyReviewed) {
      return res.status(400).json(sendError('You have already reviewed this product.'));
    }

    // 3. Save review
    const reviewId = await Review.create({
      product_id,
      user_id: userId,
      rating: ratingVal,
      review
    });

    const productReviews = await Review.findByProductId(product_id);
    res.status(201).json(sendSuccess('Review posted successfully.', { review_id: reviewId, reviews: productReviews }));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/product/:productId
 * Fetch all reviews for a product
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }

    const reviews = await Review.findByProductId(productId);
    res.status(200).json(sendSuccess('Product reviews retrieved successfully.', { reviews }));
  } catch (error) {
    next(error);
  }
};
