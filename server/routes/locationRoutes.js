const express = require('express');
const router = express.Router();
const { 
  updateLocation, 
  getNearbyUsers 
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

router.put('/', protect, updateLocation);
router.get('/nearby', protect, getNearbyUsers);

module.exports = router;