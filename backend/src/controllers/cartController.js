// cartController.js
// Controllers for Cart items management

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const items = await Cart.getCartItems(userId);

    // Calculate cart totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json(sendSuccess('Cart retrieved successfully.', {
      items,
      total_items: totalItems,
      total_amount: parseFloat(totalAmount.toFixed(2))
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cart/items
 */
export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.user_id;

    if (!product_id) {
      return res.status(400).json(sendError('Product ID is required.'));
    }

    if (quantity <= 0) {
      return res.status(400).json(sendError('Quantity must be greater than 0.'));
    }

    // 1. Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }

    // 2. Check stock
    if (product.stock_quantity < quantity) {
      return res.status(400).json(sendError(`Insufficient stock. Only ${product.stock_quantity} item(s) left.`));
    }

    // 3. Add or update in cart
    const cartItemId = await Cart.addItem(userId, product_id, quantity);
    
    // Fetch refreshed cart
    const items = await Cart.getCartItems(userId);
    res.status(200).json(sendSuccess('Product added to cart successfully.', { cart_item_id: cartItemId, items }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cart/items/:id
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;
    const userId = req.user.user_id;

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json(sendError('Quantity must be greater than 0.'));
    }

    // 1. Fetch user's cart items to verify ownership
    const items = await Cart.getCartItems(userId);
    const cartItem = items.find(item => item.cart_item_id == cartItemId);

    if (!cartItem) {
      return res.status(404).json(sendError('Cart item not found or unauthorized.'));
    }

    // 2. Verify product inventory limits
    const product = await Product.findById(cartItem.product_id);
    if (product.stock_quantity < quantity) {
      return res.status(400).json(sendError(`Insufficient stock. Only ${product.stock_quantity} item(s) left.`));
    }

    // 3. Update quantity
    const updated = await Cart.updateItemQuantity(cartItemId, quantity);
    if (!updated) {
      return res.status(500).json(sendError('Failed to update cart item.'));
    }

    const refreshedItems = await Cart.getCartItems(userId);
    res.status(200).json(sendSuccess('Cart item updated successfully.', { items: refreshedItems }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart/items/:id
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user.user_id;

    // Verify ownership
    const items = await Cart.getCartItems(userId);
    const hasItem = items.some(item => item.cart_item_id == cartItemId);

    if (!hasItem) {
      return res.status(404).json(sendError('Cart item not found or unauthorized.'));
    }

    const deleted = await Cart.removeItem(cartItemId);
    if (!deleted) {
      return res.status(500).json(sendError('Failed to remove cart item.'));
    }

    const refreshedItems = await Cart.getCartItems(userId);
    res.status(200).json(sendSuccess('Cart item removed successfully.', { items: refreshedItems }));
  } catch (error) {
    next(error);
  }
};
