/**
 * Centralized Application Error Handling Middleware
 * 
 * @module middlewares/errorHandler
 * @description Catches unhandled errors across execution contexts and returns standardized JSON error responses.
 */

/**
 * Express error handler middleware
 * 
 * @param {Error} err - Error object thrown by downstream handlers
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Unhandled Error] ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred on the server.'
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * 404 Route Not Found Middleware
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
