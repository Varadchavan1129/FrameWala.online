// cartService.js
// Shopping Cart management API service

import api from './api.js';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1, customization = {}) => {
  const response = await api.post('/cart/items', { product_id: productId, quantity, ...customization });
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await api.delete(`/cart/items/${cartItemId}`);
  return response.data;
};
