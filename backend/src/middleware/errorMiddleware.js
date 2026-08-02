// errorMiddleware.js
// Custom global error and 404 routing middlewares

import { sendError } from '../utils/responseHelper.js';

/**
 * Handle resources not found (404 Fallback)
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json(sendError(`Cannot find ${req.originalUrl} on this server.`, { route: req.originalUrl }));
};

/**
 * Global Exception Handler (500 Server Error)
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error: ', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json(sendError(message, {
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }));
};
