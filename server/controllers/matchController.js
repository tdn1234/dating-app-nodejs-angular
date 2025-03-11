const Match = require('../models/Match');
const User = require('../models/User');

// @desc    Create a new match request
// @route   POST /api/matches
// @access  Private
exports.createMatch = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    // Check if users exist
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if a match already exists between these users
    const existingMatch = await Match.findOne({
      users: { $all: [req.user._id, targetUserId] }
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists between these users' });
    }

    // Create the match
    const match = await Match.create({
      users: [req.user._id, targetUserId],
      initiatedBy: req.user._id,
      status: 'pending'
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update match status
// @route   PUT /api/matches/:id
// @access  Private
exports.updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['matched', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is part of this match
    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this match' });
    }

    // Check if user is the one who received the match request
    if (match.initiatedBy.equals(req.user._id)) {
      return res.status(400).json({ message: 'Cannot update status of a match you initiated' });
    }

    match.status = status;
    match.lastActivity = Date.now();

    const updatedMatch = await match.save();
    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's matches
// @route   GET /api/matches
// @access  Private
exports.getUserMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
      status: 'matched'
    })
      .populate('users', 'name avatar')
      .sort({ lastActivity: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending match requests
// @route   GET /api/matches/pending
// @access  Private
exports.getPendingMatches = async (req, res) => {
  try {
    // Get match requests that the user has received but not initiated
    const pendingMatches = await Match.find({
      users: req.user._id,
      initiatedBy: { $ne: req.user._id },
      status: 'pending'
    })
      .populate('initiatedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(pendingMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};