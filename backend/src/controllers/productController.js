// productController.js
// Controllers for Products and Images CRUD

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * GET /api/products
 * Query Parameters: categoryId, minPrice, maxPrice, search, isCustomizable
 */
export const getProducts = async (req, res, next) => {
  try {
    const { categoryId, minPrice, maxPrice, search, isCustomizable, isActive } = req.query;
    
    const products = await Product.findAll({
      categoryId,
      minPrice,
      maxPrice,
      search,
      isCustomizable,
      isActive
    });

    res.status(200).json(sendSuccess('Products retrieved successfully.', { products }));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }
    res.status(200).json(sendSuccess('Product details retrieved successfully.', { product }));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products (Admin Only)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { category_id, product_name, description, price, stock_quantity, is_customizable, is_active, images, template_image, print_area_json } = req.body;

    if (!product_name || !price) {
      return res.status(400).json(sendError('Product name and price are required.'));
    }

    // Validate category existence if supplied
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json(sendError('Specified category does not exist.'));
      }
    }

    // Verify naming uniqueness in the same category
    const duplicate = await Product.findByNameAndCategory(product_name, category_id);
    if (duplicate) {
      return res.status(400).json(sendError('Product with this name already exists in this category.'));
    }

    const newProductId = await Product.create({
      category_id,
      product_name,
      description,
      price,
      stock_quantity,
      is_customizable,
      is_active: is_active !== undefined ? is_active : true,
      template_image: template_image || null,
      print_area_json: print_area_json || null
    });

    // Handle primary and optional images if supplied in request body
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        // Set first image as primary, rest as secondary
        await Product.addImage(newProductId, images[i], i + 1, i === 0);
      }
    }

    const product = await Product.findById(newProductId);
    res.status(201).json(sendSuccess('Product created successfully.', { product }));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id (Admin Only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { category_id, product_name, description, price, stock_quantity, is_customizable, is_active, images, template_image, print_area_json } = req.body;

    const existing = await Product.findById(productId);
    if (!existing) {
      return res.status(404).json(sendError('Product not found.'));
    }

    // Validate category if changing
    if (category_id && category_id !== existing.category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json(sendError('Specified category does not exist.'));
      }
    }

    // Verify naming uniqueness in the same category
    if (product_name || category_id !== undefined) {
      const nameToCheck = product_name || existing.product_name;
      const catIdToCheck = category_id !== undefined ? category_id : existing.category_id;
      const duplicate = await Product.findByNameAndCategory(nameToCheck, catIdToCheck);
      if (duplicate && duplicate.product_id !== parseInt(productId)) {
        return res.status(400).json(sendError('Product with this name already exists in this category.'));
      }
    }

    const updated = await Product.update(productId, {
      category_id: category_id !== undefined ? category_id : existing.category_id,
      product_name: product_name || existing.product_name,
      description: description !== undefined ? description : existing.description,
      price: price !== undefined ? price : existing.price,
      stock_quantity: stock_quantity !== undefined ? stock_quantity : existing.stock_quantity,
      is_customizable: is_customizable !== undefined ? is_customizable : existing.is_customizable,
      is_active: is_active !== undefined ? is_active : existing.is_active,
      template_image: template_image !== undefined ? template_image : existing.template_image,
      print_area_json: print_area_json !== undefined ? print_area_json : existing.print_area_json
    });

    if (images && Array.isArray(images)) {
      await Product.clearImages(productId);
      for (let i = 0; i < images.length; i++) {
        await Product.addImage(productId, images[i], i + 1, i === 0);
      }
    }

    const product = await Product.findById(productId);
    res.status(200).json(sendSuccess('Product updated successfully.', { product }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id (Admin Only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const existing = await Product.findById(productId);
    if (!existing) {
      return res.status(404).json(sendError('Product not found.'));
    }

    const deleted = await Product.delete(productId);
    if (!deleted) {
      return res.status(500).json(sendError('Failed to delete product. Check if it is referenced in active orders.'));
    }

    res.status(200).json(sendSuccess('Product deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products/:id/images (Admin Only)
 */
export const addProductImage = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { image_url, display_order, is_primary } = req.body;

    if (!image_url) {
      return res.status(400).json(sendError('image_url is required.'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(sendError('Product not found.'));
    }

    // If setting as primary, we might want to check or reset existing primary images (optional)
    // For simplicity, we just insert. We can write a simple toggle if needed.
    const imageId = await Product.addImage(productId, image_url, display_order || 0, is_primary || false);

    const updatedProduct = await Product.findById(productId);
    res.status(201).json(sendSuccess('Image added successfully.', { imageId, product: updatedProduct }));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/images/:imageId (Admin Only)
 */
export const removeProductImage = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;
    const deleted = await Product.removeImage(imageId);

    if (!deleted) {
      return res.status(404).json(sendError('Image not found.'));
    }

    res.status(200).json(sendSuccess('Product image removed successfully.'));
  } catch (error) {
    next(error);
  }
};
