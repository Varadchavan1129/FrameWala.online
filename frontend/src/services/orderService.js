// orderService.js
// Order placement, tracking, and status modifications API service

import api from './api.js';

export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};

// Admin Operations
export const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};
