// Response helper utilities for API endpoints

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Object} data - Data to include in the response
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    ...data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} additionalData - Additional data to include in the response
 */
const sendError = (res, message, statusCode = 500, additionalData = {}) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...additionalData
  });
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {string|Object} errors - Validation errors (string or object)
 */
const sendValidationError = (res, errors) => {
  return sendError(
    res,
    'Validation error',
    400,
    { errors: typeof errors === 'string' ? { message: errors } : errors }
  );
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError
}; 