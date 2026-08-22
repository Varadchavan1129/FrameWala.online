// reviewService.js
// Product ratings and reviews API service

import api from './api.js';

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getProductReviews = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};
