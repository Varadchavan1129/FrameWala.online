// Order.js
// SQL models for Orders, Order Items, Payments, and Shipments

import db from '../config/db.js';

class Order {
  /**
   * Insert a base order record
   */
  static async create({ user_id, address_id, total_amount, order_status = 'pending', payment_status = 'pending' }) {
    const [result] = await db.query(
      `INSERT INTO orders (user_id, address_id, total_amount, order_status, payment_status) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, address_id, total_amount, order_status, payment_status]
    );
    return result.insertId;
  }

  /**
   * Insert an order item log
   */
  static async createItem({ 
    order_id, product_id, quantity, price,
    custom_image_url = null,
    custom_text = null,
    custom_font = null,
    custom_font_size = null,
    custom_font_color = null,
    custom_rotation = null,
    custom_scale = null,
    custom_position_x = null,
    custom_position_y = null
  }) {
    const [result] = await db.query(
      `INSERT INTO order_items (
        order_id, product_id, quantity, price,
        custom_image_url, custom_text, custom_font, custom_font_size, custom_font_color,
        custom_rotation, custom_scale, custom_position_x, custom_position_y
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id, product_id, quantity, price,
        custom_image_url, custom_text, custom_font, custom_font_size, custom_font_color,
        custom_rotation, custom_scale, custom_position_x, custom_position_y
      ]
    );
    return result.insertId;
  }

  /**
   * Find orders for a user or all orders (if no userId supplied, for Admin dashboards)
   */
  static async findAll(userId = null) {
    let sql = `
      SELECT o.*, u.first_name, u.last_name, u.email, a.full_name AS shipping_name, a.city, a.state
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN addresses a ON o.address_id = a.address_id
    `;
    const params = [];

    if (userId) {
      sql += ' WHERE o.user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY o.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Load order by ID, appending order items, shipping info, and payment records
   */
  static async findById(orderId) {
    // 1. Fetch core order detail
    const [orders] = await db.query(
      `SELECT o.*, u.first_name, u.last_name, u.email, u.phone AS user_phone,
              a.full_name AS shipping_name, a.phone AS shipping_phone, 
              a.address_line, a.city, a.state, a.pincode
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       JOIN addresses a ON o.address_id = a.address_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) return null;
    const order = orders[0];

    // 2. Fetch order items
    const [items] = await db.query(
      `SELECT oi.*, p.product_name, pi.image_url AS primary_image,
              pc.id AS customization_id, pc.template_name, pc.design_json, pc.preview_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
       LEFT JOIN product_customizations pc ON oi.order_item_id = pc.order_item_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    order.items = items;

    // 3. Fetch payment logs
    const [payments] = await db.query('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    order.payment = payments[0] || null;

    // 4. Fetch shipment info
    const [shipments] = await db.query('SELECT * FROM shipments WHERE order_id = ?', [orderId]);
    order.shipment = shipments[0] || null;

    return order;
  }

  /**
   * Update order and payment statuses
   */
  static async updateStatus(orderId, { order_status, payment_status }) {
    let sql = 'UPDATE orders SET ';
    const params = [];
    const sets = [];

    if (order_status) {
      sets.push('order_status = ?');
      params.push(order_status);
    }
    if (payment_status) {
      sets.push('payment_status = ?');
      params.push(payment_status);
    }

    if (sets.length === 0) return false;

    sql += sets.join(', ') + ' WHERE order_id = ?';
    params.push(orderId);

    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * Log transaction payment details
   */
  static async createPayment({ order_id, payment_method, razorpay_payment_id = null, payment_status = 'pending' }) {
    const [result] = await db.query(
      `INSERT INTO payments (order_id, payment_method, razorpay_payment_id, payment_status) 
       VALUES (?, ?, ?, ?)`,
      [order_id, payment_method, razorpay_payment_id, payment_status]
    );
    return result.insertId;
  }

  /**
   * Create shipment dispatch tracking record
   */
  static async createShipment({ order_id, courier_name = null, tracking_number = null, shipment_status = 'pending', expected_delivery = null }) {
    const [result] = await db.query(
      `INSERT INTO shipments (order_id, courier_name, tracking_number, shipment_status, expected_delivery) 
       VALUES (?, ?, ?, ?, ?)`,
      [order_id, courier_name, tracking_number, shipment_status, expected_delivery]
    );
    return result.insertId;
  }
}

export default Order;
