// User.js
// SQL models for User accounts

import db from '../config/db.js';

class User {
  /**
   * Find a user by their unique email address
   */
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  /**
   * Find a user by their user ID (exclude password hash for security)
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT user_id, first_name, last_name, email, phone, role, is_active, created_at, updated_at FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Insert a new user into the database (default role: customer)
   */
  static async create({ first_name, last_name, email, phone, password, role = 'customer' }) {
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone || null, password, role]
    );
    return result.insertId;
  }

  /**
   * Update profile details (first name, last name, phone)
   */
  static async updateProfile(id, { first_name, last_name, phone }) {
    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE user_id = ?',
      [first_name, last_name, phone || null, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update password hash for a user
   */
  static async updatePassword(id, hashedPassword) {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }
}

export default User;
