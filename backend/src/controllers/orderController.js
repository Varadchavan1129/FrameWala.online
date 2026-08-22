// orderController.js
// Controllers for Order processing and tracking

import db from '../config/db.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * POST /api/orders
 * Places a new order from active cart items
 */
export const placeOrder = async (req, res, next) => {
  const userId = req.user.user_id;
  const { address_id, payment_method = 'COD' } = req.body;

  if (!address_id) {
    return res.status(400).json(sendError('Address ID is required.'));
  }

  // 1. Check address exists and belongs to user
  const address = await Address.findById(address_id);
  if (!address || address.user_id !== userId) {
    return res.status(400).json(sendError('Invalid address selection.'));
  }

  // 2. Fetch cart items
  const cartItems = await Cart.getCartItems(userId);
  if (cartItems.length === 0) {
    return res.status(400).json(sendError('Your shopping cart is empty.'));
  }

  // 3. Establish transaction connection
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let totalAmount = 0;
    const itemsToInsert = [];

    // Verify stock and calculate totals
    for (const item of cartItems) {
      // Fetch latest stock directly via connection to avoid read race conditions
      const [productRows] = await connection.query(
        'SELECT product_name, price, stock_quantity FROM products WHERE product_id = ? FOR UPDATE',
        [item.product_id]
      );
      
      const product = productRows[0];
      if (!product) {
        throw new Error(`Product ${item.product_name} no longer exists.`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.product_name}. Only ${product.stock_quantity} left.`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      itemsToInsert.push({
        cart_item_id: item.cart_item_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        custom_image_url: item.custom_image_url,
        custom_text: item.custom_text,
        custom_font: item.custom_font,
        custom_font_size: item.custom_font_size,
        custom_font_color: item.custom_font_color,
        custom_rotation: item.custom_rotation,
        custom_scale: item.custom_scale,
        custom_position_x: item.custom_position_x,
        custom_position_y: item.custom_position_y
      });
    }

    // 4. Create base order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, address_id, total_amount, order_status, payment_status) 
       VALUES (?, ?, ?, 'pending', 'pending')`,
      [userId, address_id, totalAmount]
    );
    const orderId = orderResult.insertId;

    // 5. Create order items and adjust stock quantities
    for (const item of itemsToInsert) {
      // Insert item
      const [orderItemResult] = await connection.query(
        `INSERT INTO order_items (
          order_id, product_id, quantity, price,
          custom_image_url, custom_text, custom_font, custom_font_size, custom_font_color,
          custom_rotation, custom_scale, custom_position_x, custom_position_y
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.product_id, item.quantity, item.price,
          item.custom_image_url, item.custom_text, item.custom_font, item.custom_font_size, item.custom_font_color,
          item.custom_rotation, item.custom_scale, item.custom_position_x, item.custom_position_y
        ]
      );
      const orderItemId = orderItemResult.insertId;

      // Move customization from cart to order
      await connection.query(
        `UPDATE product_customizations 
         SET order_item_id = ?, cart_item_id = NULL 
         WHERE cart_item_id = ?`,
        [orderItemId, item.cart_item_id]
      );

      // Deduct stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 6. Create payment logs (Mock Payment)
    const isPaid = payment_method === 'UPI' || payment_method === 'Card';
    await connection.query(
      `INSERT INTO payments (order_id, payment_method, razorpay_payment_id, payment_status) 
       VALUES (?, ?, ?, ?)`,
      [orderId, payment_method, isPaid ? `pay_mock_${Date.now()}` : null, isPaid ? 'completed' : 'pending']
    );

    if (isPaid) {
      // Update payment status on order
      await connection.query(
        "UPDATE orders SET payment_status = 'paid' WHERE order_id = ?",
        [orderId]
      );
    }

    // 7. Create shipment logs (Mock Shipment setup)
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 5); // 5 days expected delivery
    await connection.query(
      `INSERT INTO shipments (order_id, courier_name, tracking_number, shipment_status, expected_delivery) 
       VALUES (?, 'Delhivery (Mock)', ?, 'pending', ?)`,
      [orderId, `TRK_MOCK_${orderId}_${Date.now()}`, expectedDelivery]
    );

    // 8. Clear user shopping cart
    await connection.query(
      'DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = ?)',
      [userId]
    );

    // Commit Transaction
    await connection.commit();
    connection.release();

    const orderDetails = await Order.findById(orderId);
    res.status(201).json(sendSuccess('Order placed successfully.', { order: orderDetails }));
  } catch (error) {
    // Rollback changes on errors
    await connection.rollback();
    connection.release();
    res.status(400).json(sendError('Failed to place order.', { details: error.message }));
  }
};

/**
 * GET /api/orders
 * Returns personal order history for customers, or ALL orders for Admins
 */
export const getOrders = async (req, res, next) => {
  try {
    const isUserAdmin = req.user.role === 'admin';
    const userId = isUserAdmin ? null : req.user.user_id;

    const orders = await Order.findAll(userId);
    res.status(200).json(sendSuccess('Orders retrieved successfully.', { orders }));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json(sendError('Order not found.'));
    }

    // Verify access rights: Admins can see any order, users can only see their own
    if (req.user.role !== 'admin' && order.user_id !== req.user.user_id) {
      return res.status(403).json(sendError('Unauthorized access to this order details.'));
    }

    res.status(200).json(sendSuccess('Order details retrieved successfully.', { order }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/orders/:id/cancel
 * Cancels a pending order and restores inventories
 */
export const cancelOrder = async (req, res, next) => {
  const orderId = req.params.id;
  const userId = req.user.user_id;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json(sendError('Order not found.'));
  }

  // Ensure authorized user cancels
  if (req.user.role !== 'admin' && order.user_id !== userId) {
    return res.status(403).json(sendError('Unauthorized. Cannot cancel this order.'));
  }

  // Only allow cancelling if order status is pending or processing
  if (order.order_status !== 'pending' && order.order_status !== 'processing') {
    return res.status(400).json(sendError(`Cannot cancel order. Order is already ${order.order_status}.`));
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Update order status to cancelled
    await connection.query(
      "UPDATE orders SET order_status = 'cancelled', payment_status = ? WHERE order_id = ?",
      [order.payment_status === 'paid' ? 'refunded' : order.payment_status, orderId]
    );

    // 2. Restore products stock quantities
    for (const item of order.items) {
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 3. Update payment status inside payment log table (if paid)
    if (order.payment) {
      await connection.query(
        "UPDATE payments SET payment_status = ? WHERE order_id = ?",
        [order.payment_status === 'paid' ? 'refunded' : 'failed', orderId]
      );
    }

    // 4. Update shipment status
    if (order.shipment) {
      await connection.query(
        "UPDATE shipments SET shipment_status = 'returned' WHERE order_id = ?",
        [orderId]
      );
    }

    await connection.commit();
    connection.release();

    const updatedOrder = await Order.findById(orderId);
    res.status(200).json(sendSuccess('Order cancelled successfully. Stock restored.', { order: updatedOrder }));
  } catch (error) {
    await connection.rollback();
    connection.release();
    res.status(500).json(sendError('Failed to cancel order.', { details: error.message }));
  }
};

/**
 * PUT /api/orders/:id/status (Admin Only)
 * Update delivery status (processing/shipped/delivered/cancelled)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { order_status, payment_status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(sendError('Order not found.'));
    }

    const updated = await Order.updateStatus(orderId, { order_status, payment_status });
    if (!updated) {
      return res.status(400).json(sendError('Failed to update status or status unchanged.'));
    }

    // Sync shipment state if order status is updated
    if (order_status) {
      let shipment_status = 'pending';
      if (order_status === 'shipped') shipment_status = 'shipped';
      if (order_status === 'delivered') shipment_status = 'delivered';
      if (order_status === 'cancelled') shipment_status = 'returned';

      await db.query(
        'UPDATE shipments SET shipment_status = ? WHERE order_id = ?',
        [shipment_status, orderId]
      );
    }

    const updatedOrder = await Order.findById(orderId);
    res.status(200).json(sendSuccess('Order status updated successfully.', { order: updatedOrder }));
  } catch (error) {
    next(error);
  }
};
