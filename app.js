// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
app.use('/jquery-ui', express.static(path.join(__dirname, 'node_modules/jquery-ui/dist/')));

// Routes
app.use('/', routes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting node.js server on port ${port}`);
});