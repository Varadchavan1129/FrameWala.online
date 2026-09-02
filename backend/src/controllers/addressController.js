// addressController.js
// Controllers for User Addresses CRUD

import Address from '../models/Address.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * GET /api/addresses
 */
export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const addresses = await Address.findByUserId(userId);
    res.status(200).json(sendSuccess('Addresses retrieved successfully.', { addresses }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/addresses
 */
export const createAddress = async (req, res, next) => {
  try {
    const { full_name, phone, address_line, city, state, pincode } = req.body;
    const userId = req.user.user_id;

    if (!full_name || !phone || !address_line || !city || !state || !pincode) {
      return res.status(400).json(sendError('All address fields are required.'));
    }

    const addressId = await Address.create({
      user_id: userId,
      full_name,
      phone,
      address_line,
      city,
      state,
      pincode
    });

    const addresses = await Address.findByUserId(userId);
    res.status(201).json(sendSuccess('Address created successfully.', { address_id: addressId, addresses }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/addresses/:id
 */
export const updateAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.user_id;
    const { full_name, phone, address_line, city, state, pincode } = req.body;

    const existing = await Address.findById(addressId);
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json(sendError('Address not found or unauthorized.'));
    }

    const updated = await Address.update(addressId, userId, {
      full_name: full_name || existing.full_name,
      phone: phone || existing.phone,
      address_line: address_line || existing.address_line,
      city: city || existing.city,
      state: state || existing.state,
      pincode: pincode || existing.pincode
    });

    if (!updated) {
      return res.status(400).json(sendError('Failed to update address or no changes made.'));
    }

    const addresses = await Address.findByUserId(userId);
    res.status(200).json(sendSuccess('Address updated successfully.', { addresses }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/addresses/:id
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.user_id;

    const existing = await Address.findById(addressId);
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json(sendError('Address not found or unauthorized.'));
    }

    const deleted = await Address.delete(addressId, userId);
    if (!deleted) {
      return res.status(500).json(sendError('Failed to delete address. Check if it is used in orders.'));
    }

    const addresses = await Address.findByUserId(userId);
    res.status(200).json(sendSuccess('Address deleted successfully.', { addresses }));
  } catch (error) {
    next(error);
  }
};
