// Cart.js
// SQL models for Carts and Cart Items

import db from '../config/db.js';

class Cart {
  /**
   * Find a user's cart. If none exists, create a new one.
   */
  static async findOrCreateCart(userId) {
    // 1. Try finding the cart
    const [rows] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      return rows[0].cart_id;
    }

    // 2. Create one if not exists
    const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }

  /**
   * Retrieve all items inside a user's cart (joins products and grabs primary image)
   */
  static async getCartItems(userId) {
    const cartId = await this.findOrCreateCart(userId);
    const [rows] = await db.query(
      `SELECT ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, 
              p.product_name, p.price, p.stock_quantity, p.is_customizable,
              pi.image_url AS primary_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return rows;
  }

  /**
   * Add a product to the cart (or updates quantity if already in cart)
   */
  static async addItem(userId, productId, quantity) {
    const cartId = await this.findOrCreateCart(userId);
    
    // Check if the item already exists in the cart
    const [existing] = await db.query(
      'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
        [newQty, existing[0].cart_item_id]
      );
      return existing[0].cart_item_id;
    } else {
      // Insert new item
      const [result] = await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
      return result.insertId;
    }
  }

  /**
   * Update quantity of a specific cart item
   */
  static async updateItemQuantity(cartItemId, quantity) {
    const [result] = await db.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
      [quantity, cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Remove an item from the cart
   */
  static async removeItem(cartItemId) {
    const [result] = await db.query('DELETE FROM cart_items WHERE cart_item_id = ?', [cartItemId]);
    return result.affectedRows > 0;
  }

  /**
   * Delete all items in a cart (used after successful order placement)
   */
  static async clearCart(userId) {
    const cartId = await this.findOrCreateCart(userId);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}

export default Cart;
