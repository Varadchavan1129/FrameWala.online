// responseHelper.js
// Standardized response formatting helper functions

/**
 * Format a successful API response
 * @param {string} message - Description of the operation result
 * @param {object|array} data - Response payload data
 * @returns {object} formatted success object
 */
export const sendSuccess = (message = 'Success', data = {}) => {
  return {
    success: true,
    message,
    data
  };
};

/**
 * Format a failed API response
 * @param {string} message - Description of the failure
 * @param {object} error - Error details or list of validation failures
 * @returns {object} formatted error object
 */
export const sendError = (message = 'Error occurred', error = {}) => {
  return {
    success: false,
    message,
    error: error instanceof Error ? { message: error.message } : error
  };
};
