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
              ci.custom_image_url, ci.custom_text, ci.custom_font, ci.custom_font_size, ci.custom_font_color,
              ci.custom_rotation, ci.custom_scale, ci.custom_position_x, ci.custom_position_y,
              p.product_name, p.price, p.stock_quantity, p.is_customizable, p.template_image, p.print_area_json,
              pi.image_url AS primary_image,
              pc.id AS customization_id, pc.template_name, pc.design_json, pc.preview_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
       LEFT JOIN product_customizations pc ON ci.cart_item_id = pc.cart_item_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return rows;
  }

  /**
   * Add a product to the cart (or updates quantity if already in cart with identical customizations)
   */
  static async addItem(userId, productId, quantity, customization = {}) {
    const cartId = await this.findOrCreateCart(userId);
    
    // Extract new customization parameters
    const design_json = customization.design_json ? (typeof customization.design_json === 'string' ? customization.design_json : JSON.stringify(customization.design_json)) : null;
    const preview_image = customization.preview_image || null;
    const template_name = customization.template_name || null;

    // Map customization properties to legacy columns for backward compatibility
    let legacy = {
      custom_image_url: customization.custom_image_url || null,
      custom_text: customization.custom_text || null,
      custom_font: customization.custom_font || null,
      custom_font_size: customization.custom_font_size || null,
      custom_font_color: customization.custom_font_color || null,
      custom_rotation: customization.custom_rotation || null,
      custom_scale: customization.custom_scale || null,
      custom_position_x: customization.custom_position_x || null,
      custom_position_y: customization.custom_position_y || null
    };

    if (design_json) {
      try {
        const parsed = JSON.parse(design_json);
        legacy.custom_image_url = parsed.image || legacy.custom_image_url;
        legacy.custom_text = parsed.text || legacy.custom_text;
        legacy.custom_font = parsed.font || legacy.custom_font;
        legacy.custom_font_size = parsed.fontSize || legacy.custom_font_size;
        legacy.custom_font_color = parsed.fontColor || legacy.custom_font_color;
        legacy.custom_rotation = parsed.rotation !== undefined ? parsed.rotation : legacy.custom_rotation;
        legacy.custom_scale = parsed.scale !== undefined ? parsed.scale : legacy.custom_scale;
        legacy.custom_position_x = parsed.positionX !== undefined ? parsed.positionX : legacy.custom_position_x;
        legacy.custom_position_y = parsed.positionY !== undefined ? parsed.positionY : legacy.custom_position_y;
      } catch (err) {
        console.error('Failed to parse design_json for legacy mapping:', err.message);
      }
    }

    // Check if the item already exists in the cart with the exact same customization
    const [existing] = await db.query(
      `SELECT ci.cart_item_id, ci.quantity 
       FROM cart_items ci
       LEFT JOIN product_customizations pc ON ci.cart_item_id = pc.cart_item_id
       WHERE ci.cart_id = ? AND ci.product_id = ? 
         AND (
           (pc.design_json IS NULL AND ? IS NULL) OR
           (pc.design_json = ?)
         )`,
      [cartId, productId, design_json, design_json]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
        [newQty, existing[0].cart_item_id]
      );
      
      // Update template and preview image if it changed
      if (design_json || preview_image) {
        await db.query(
          `UPDATE product_customizations 
           SET template_name = ?, preview_image = ? 
           WHERE cart_item_id = ?`,
          [template_name, preview_image, existing[0].cart_item_id]
        );
      }
      return existing[0].cart_item_id;
    } else {
      // Insert new item
      const [result] = await db.query(
        `INSERT INTO cart_items (
           cart_id, product_id, quantity, 
           custom_image_url, custom_text, custom_font, custom_font_size, custom_font_color,
           custom_rotation, custom_scale, custom_position_x, custom_position_y
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cartId, productId, quantity, 
          legacy.custom_image_url, legacy.custom_text, legacy.custom_font, legacy.custom_font_size, legacy.custom_font_color,
          legacy.custom_rotation, legacy.custom_scale, legacy.custom_position_x, legacy.custom_position_y
        ]
      );
      const cartItemId = result.insertId;

      // Create customization record
      if (design_json || preview_image) {
        await db.query(
          `INSERT INTO product_customizations (
             cart_item_id, product_id, template_name, design_json, preview_image
           ) VALUES (?, ?, ?, ?, ?)`,
          [cartItemId, productId, template_name, design_json, preview_image]
        );
      }
      return cartItemId;
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
    await db.query('DELETE FROM product_customizations WHERE cart_item_id = ?', [cartItemId]);
    const [result] = await db.query('DELETE FROM cart_items WHERE cart_item_id = ?', [cartItemId]);
    return result.affectedRows > 0;
  }

  /**
   * Delete all items in a cart (used after successful order placement)
   */
  static async clearCart(userId) {
    const cartId = await this.findOrCreateCart(userId);
    // Remove optimizations for items that are cleared without ordering (this is a backup; checkout links them to order first)
    await db.query('DELETE FROM product_customizations WHERE cart_item_id IN (SELECT cart_item_id FROM cart_items WHERE cart_id = ?)', [cartId]);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}

export default Cart;
