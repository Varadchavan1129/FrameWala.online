// Category.js
// SQL models for Categories

import db from '../config/db.js';

class Category {
  /**
   * Fetch all categories
   */
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY category_name ASC');
    return rows;
  }

  /**
   * Find category by ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE category_id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Find category by category name (useful for duplicate prevention)
   */
  static async findByName(categoryName) {
    const [rows] = await db.query('SELECT * FROM categories WHERE category_name = ?', [categoryName]);
    return rows[0] || null;
  }

  /**
   * Add a new category
   */
  static async create({ category_name, description }) {
    const [result] = await db.query(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [category_name, description || null]
    );
    return result.insertId;
  }

  /**
   * Update category information
   */
  static async update(id, { category_name, description }) {
    const [result] = await db.query(
      'UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?',
      [category_name, description || null, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete a category
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM categories WHERE category_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Category;
