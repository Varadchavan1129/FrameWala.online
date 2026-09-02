// Wishlist.js
// SQL models for Wishlist

import db from '../config/db.js';

class Wishlist {
  /**
   * Fetch all items in a user's wishlist
   */
  static async getWishlist(userId) {
    const [rows] = await db.query(
      `SELECT w.wishlist_id, w.product_id, 
              p.product_name, p.price, p.stock_quantity, p.is_customizable,
              pi.image_url AS primary_image
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
       WHERE w.user_id = ?`,
      [userId]
    );
    return rows;
  }

  /**
   * Add a product to the user's wishlist (prevents duplicate entries due to database UNIQUE key)
   */
  static async addItem(userId, productId) {
    // Check if it already exists
    const [existing] = await db.query(
      'SELECT wishlist_id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      return existing[0].wishlist_id;
    }

    const [result] = await db.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.insertId;
  }

  /**
   * Remove a product from the user's wishlist
   */
  static async removeItem(userId, productId) {
    const [result] = await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }
}

export default Wishlist;
