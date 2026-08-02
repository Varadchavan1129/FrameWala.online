// Product.js
// SQL models for Products and Product Images

import db from '../config/db.js';

class Product {
  /**
   * Find products with filter criteria (category, price limits, customizability, and searching)
   */
  static async findAll({ categoryId, minPrice, maxPrice, search, isCustomizable } = {}) {
    let sql = `
      SELECT p.*, c.category_name, pi.image_url AS primary_image 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE 1=1
    `;
    const params = [];

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (minPrice !== undefined && minPrice !== '') {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (isCustomizable !== undefined && isCustomizable !== '') {
      // Handle string "true"/"false" from URL query or actual boolean/number
      const customizableVal = (isCustomizable === 'true' || isCustomizable === true || isCustomizable === 1 || isCustomizable === '1');
      sql += ' AND p.is_customizable = ?';
      params.push(customizableVal ? 1 : 0);
    }

    if (search) {
      sql += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.product_id DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Get product detail by ID (including gallery images and average rating)
   */
  static async findById(id) {
    // 1. Fetch main product details
    const [products] = await db.query(
      `SELECT p.*, c.category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE p.product_id = ?`,
      [id]
    );

    if (products.length === 0) return null;
    const product = products[0];

    // 2. Fetch all gallery images sorted by display_order
    const [images] = await db.query(
      'SELECT image_id, image_url, display_order, is_primary FROM product_images WHERE product_id = ? ORDER BY display_order ASC, image_id ASC',
      [id]
    );
    product.images = images;

    // 3. Fetch rating stats (average rating & total review count)
    const [reviews] = await db.query(
      'SELECT COALESCE(AVG(rating), 0) AS average_rating, COUNT(review_id) AS total_reviews FROM reviews WHERE product_id = ?',
      [id]
    );
    product.average_rating = parseFloat(reviews[0].average_rating).toFixed(1);
    product.total_reviews = reviews[0].total_reviews;

    return product;
  }

  /**
   * Insert a new product
   */
  static async create({ category_id, product_name, description, price, stock_quantity, is_customizable }) {
    const [result] = await db.query(
      `INSERT INTO products (category_id, product_name, description, price, stock_quantity, is_customizable) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id || null, product_name, description || null, price, stock_quantity || 0, is_customizable ? 1 : 0]
    );
    return result.insertId;
  }

  /**
   * Update an existing product
   */
  static async update(id, { category_id, product_name, description, price, stock_quantity, is_customizable }) {
    const [result] = await db.query(
      `UPDATE products 
       SET category_id = ?, product_name = ?, description = ?, price = ?, stock_quantity = ?, is_customizable = ? 
       WHERE product_id = ?`,
      [category_id || null, product_name, description || null, price, stock_quantity || 0, is_customizable ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete a product
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Add image path to product_images
   */
  static async addImage(productId, imageUrl, displayOrder = 0, isPrimary = false) {
    const [result] = await db.query(
      'INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES (?, ?, ?, ?)',
      [productId, imageUrl, displayOrder, isPrimary ? 1 : 0]
    );
    return result.insertId;
  }

  /**
   * Remove a single product image
   */
  static async removeImage(imageId) {
    const [result] = await db.query('DELETE FROM product_images WHERE image_id = ?', [imageId]);
    return result.affectedRows > 0;
  }

  /**
   * Clear all images for a product
   */
  static async clearImages(productId) {
    await db.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
  }
}

export default Product;
