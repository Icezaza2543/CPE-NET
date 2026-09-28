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
  // express.json() sets `status` (e.g. 400 malformed JSON, 413 payload too large); app errors set `statusCode`
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;
  if (isServerError) console.error(`[Unhandled Error] ${err.stack || err.message}`);

  let errorCode = 'INTERNAL_SERVER_ERROR';
  if (err.type === 'entity.parse.failed') errorCode = 'INVALID_JSON';
  else if (err.type === 'entity.too.large') errorCode = 'PAYLOAD_TOO_LARGE';
  else if (!isServerError) errorCode = err.code || 'BAD_REQUEST';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      // Hide internal details of unexpected failures from clients
      message: isServerError ? 'An unexpected error occurred on the server.' : err.message
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
