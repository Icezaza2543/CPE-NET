/**
 * System Diagnostics API v1 Router
 * 
 * @module routes/api/v1/systemRoutes
 * @description Telemetry and health check route handlers.
 */

const express = require('express');
const router = express.Router();
const systemController = require('../../../controllers/systemController');

// GET /api/v1/system/health - Retrieve system health metrics
router.get('/health', systemController.getHealthStatus);

module.exports = router;
