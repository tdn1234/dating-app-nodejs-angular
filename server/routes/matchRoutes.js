const express = require('express');
const router = express.Router();
const { 
  createMatch, 
  updateMatchStatus, 
  getUserMatches,
  getPendingMatches
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserMatches)
  .post(protect, createMatch);

router.put('/:id', protect, updateMatchStatus);
router.get('/pending', protect, getPendingMatches);

module.exports = router;