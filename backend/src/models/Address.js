// Address.js
// SQL models for Addresses

import db from '../config/db.js';

class Address {
  /**
   * Get all addresses belonging to a user
   */
  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    return rows;
  }

  /**
   * Find a specific address by ID
   */
  static async findById(addressId) {
    const [rows] = await db.query('SELECT * FROM addresses WHERE address_id = ?', [addressId]);
    return rows[0] || null;
  }

  /**
   * Create a new address for a user
   */
  static async create({ user_id, full_name, phone, address_line, city, state, pincode }) {
    const [result] = await db.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, phone, address_line, city, state, pincode]
    );
    return result.insertId;
  }

  /**
   * Update address details
   */
  static async update(addressId, userId, { full_name, phone, address_line, city, state, pincode }) {
    const [result] = await db.query(
      `UPDATE addresses 
       SET full_name = ?, phone = ?, address_line = ?, city = ?, state = ?, pincode = ? 
       WHERE address_id = ? AND user_id = ?`,
      [full_name, phone, address_line, city, state, pincode, addressId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete an address
   */
  static async delete(addressId, userId) {
    const [result] = await db.query(
      'DELETE FROM addresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
    return result.affectedRows > 0;
  }
}

export default Address;
