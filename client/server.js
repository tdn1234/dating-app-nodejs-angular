const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4200; // Changed to 4200 to match your current setup

// Ensure proper MIME types
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the root directory
app.use(express.static('./'));

// All routes should serve the index.html file (for SPA)
// EXCEPT for actual file requests
app.get('*', (req, res, next) => {
  // Skip files with extensions to avoid serving HTML instead of JS
  if (path.extname(req.url) !== '') {
    return next();
  }
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Root directory: ${path.resolve('./')}`);
});