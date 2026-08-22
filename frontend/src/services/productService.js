// productService.js
// Catalog and product details API service

import api from './api.js';

export const getProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Admin Operations
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const addProductImage = async (productId, imageData) => {
  const response = await api.post(`/products/${productId}/images`, imageData);
  return response.data;
};

export const removeProductImage = async (imageId) => {
  const response = await api.delete(`/products/images/${imageId}`);
  return response.data;
};

export const uploadImages = async (formData) => {
  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const uploadCustomizationImage = async (formData) => {
  const response = await api.post('/upload/customization', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
