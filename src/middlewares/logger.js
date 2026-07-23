/**
 * HTTP Request Logger Middleware
 * 
 * @module middlewares/logger
 * @description Intercepts incoming HTTP requests to log method, path, HTTP status, and latency.
 * Provides real-time telemetry for API diagnostics and system monitoring.
 */

/**
 * Express middleware for logging request metadata
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Intercept response finish event to capture status and execution duration
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    
    // Formatting log message with color indicators for console output
    const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${statusColor}${statusCode}${resetColor} - ${durationMs}ms (${ip})`
    );
  });

  next();
};

module.exports = requestLogger;
