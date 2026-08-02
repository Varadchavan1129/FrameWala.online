// Review.js
// SQL models for Reviews

import db from '../config/db.js';

class Review {
  /**
   * Add a review for a product (unique constraint prevents multiple reviews by same user for same product)
   */
  static async create({ product_id, user_id, rating, review }) {
    const [result] = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, review) VALUES (?, ?, ?, ?)',
      [product_id, user_id, rating, review || null]
    );
    return result.insertId;
  }

  /**
   * Retrieve all reviews for a product (joins users to show who wrote it)
   */
  static async findByProductId(productId) {
    const [rows] = await db.query(
      `SELECT r.review_id, r.product_id, r.user_id, r.rating, r.review, r.created_at,
              u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );
    return rows;
  }

  /**
   * Optional check to verify if a user has already reviewed a product
   */
  static async hasUserReviewed(userId, productId) {
    const [rows] = await db.query(
      'SELECT review_id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }
}

export default Review;
