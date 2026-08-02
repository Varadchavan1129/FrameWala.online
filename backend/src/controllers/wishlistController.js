// wishlistController.js
// Controllers for Wishlist management

import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * GET /api/wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const wishlist = await Wishlist.getWishlist(userId);
    res.status(200).json(sendSuccess('Wishlist retrieved successfully.', { wishlist }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wishlist
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.user_id;

    if (!product_id) {
      return res.status(400).json(sendError('Product ID is required.'));
    }

    // Verify product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }

    const wishlistId = await Wishlist.addItem(userId, product_id);
    const wishlist = await Wishlist.getWishlist(userId);

    res.status(201).json(sendSuccess('Product added to wishlist.', { wishlistId, wishlist }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlist/:productId
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.user_id;

    const deleted = await Wishlist.removeItem(userId, productId);
    if (!deleted) {
      return res.status(404).json(sendError('Product was not found in your wishlist.'));
    }

    const wishlist = await Wishlist.getWishlist(userId);
    res.status(200).json(sendSuccess('Product removed from wishlist.', { wishlist }));
  } catch (error) {
    next(error);
  }
};
