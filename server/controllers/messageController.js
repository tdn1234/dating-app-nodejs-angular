const Message = require('../models/Message');
const Match = require('../models/Match');

// @desc    Get messages for a match
// @route   GET /api/messages/:matchId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    
    // Check if match exists and user is part of it
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access these messages' });
    }
    
    // Get messages
    const messages = await Message.find({ match: matchId })
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages/:matchId
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Check if match exists and user is part of it
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this match' });
    }
    
    // Create message
    const message = await Message.create({
      match: matchId,
      sender: req.user._id,
      content
    });
    
    // Update match's lastActivity
    match.lastActivity = Date.now();
    await match.save();
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};