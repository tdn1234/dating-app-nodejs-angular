const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 4200;
const connectDB = require('./server/config/db');

require('dotenv').config();

// Connect to database
connectDB();


// Middleware
app.use(helmet({
  contentSecurityPolicy: true // Adjust as needed for your application
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/location', require('./server/routes/locationRoutes'));
app.use('/api/matches', require('./server/routes/matchRoutes'));
app.use('/api/messages', require('./server/routes/messageRoutes'));

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'client')));

// API route handler for any unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found111' });
});

// All other routes should serve the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;