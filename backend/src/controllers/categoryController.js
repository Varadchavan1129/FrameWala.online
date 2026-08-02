// categoryController.js
// Controllers for Product Categories CRUD

import Category from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * GET /api/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(sendSuccess('Categories retrieved successfully.', { categories }));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:id
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(sendError('Category not found.'));
    }
    res.status(200).json(sendSuccess('Category retrieved successfully.', { category }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories (Admin Only)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json(sendError('Category name is required.'));
    }

    // Check if category name already exists
    const duplicate = await Category.findByName(category_name);
    if (duplicate) {
      return res.status(400).json(sendError('Category with this name already exists.'));
    }

    const newId = await Category.create({ category_name, description });
    const category = await Category.findById(newId);

    res.status(201).json(sendSuccess('Category created successfully.', { category }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/categories/:id (Admin Only)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    const categoryId = req.params.id;

    // Check if category exists
    const existing = await Category.findById(categoryId);
    if (!existing) {
      return res.status(404).json(sendError('Category not found.'));
    }

    // Verify naming uniqueness if name is changing
    if (category_name && category_name !== existing.category_name) {
      const duplicate = await Category.findByName(category_name);
      if (duplicate) {
        return res.status(400).json(sendError('Category with this name already exists.'));
      }
    }

    const updated = await Category.update(categoryId, {
      category_name: category_name || existing.category_name,
      description: description !== undefined ? description : existing.description
    });

    if (!updated) {
      return res.status(500).json(sendError('Failed to update category or details unchanged.'));
    }

    const category = await Category.findById(categoryId);
    res.status(200).json(sendSuccess('Category updated successfully.', { category }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/categories/:id (Admin Only)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const existing = await Category.findById(categoryId);
    if (!existing) {
      return res.status(404).json(sendError('Category not found.'));
    }

    const deleted = await Category.delete(categoryId);
    if (!deleted) {
      return res.status(500).json(sendError('Failed to delete category.'));
    }

    res.status(200).json(sendSuccess('Category deleted successfully.'));
  } catch (error) {
    next(error);
  }
};
