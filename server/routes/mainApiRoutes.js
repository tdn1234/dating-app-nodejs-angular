const express = require('express');
const router = express.Router();

// Define API routes
router.use('/users', require('./userRoutes'));
router.use('/location', require('./locationRoutes'));
router.use('/matches', require('./matchRoutes'));
router.use('/messages', require('./messageRoutes'));

// API route handler for any unhandled API routes
router.use('/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = router;