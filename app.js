/**
 * CPE-NET Main Application Server Entry Point
 * 
 * @description Configures Express middleware, mounts API v1 routes, serves static assets,
 * and sets up global error handling pipelines.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Middlewares
const requestLogger = require('./src/middlewares/logger');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');

// API v1 Routers
const studentRoutes = require('./src/routes/api/v1/studentRoutes');
const systemRoutes = require('./src/routes/api/v1/systemRoutes');

// Legacy Router (for backward compatibility)
const legacyRoutes = require('./src/routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Static Assets Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
app.use('/jquery-ui', express.static(path.join(__dirname, 'node_modules/jquery-ui/dist/')));

// API v1 Route Registrations
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/system', systemRoutes);

// Legacy Web & API Routes
app.use('/', legacyRoutes);

// Centralized Error Handling Pipeline
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`=================================================`);
    console.log(`🚀 CPE-NET Server running at http://localhost:${port}`);
    console.log(`📊 System Health Telemetry: http://localhost:${port}/api/v1/system/health`);
    console.log(`🎓 Student RESTful API: http://localhost:${port}/api/v1/students`);
    console.log(`=================================================`);
});

module.exports = app;