const User = require('../models/User');

// @desc    Update user location
// @route   PUT /api/location
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        lastUpdated: Date.now()
      };

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        location: updatedUser.location
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Find nearby users
// @route   GET /api/location/nearby
// @access  Private
exports.getNearbyUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's preferences
    const { gender, ageMin, ageMax, distance } = user.preferences;
    const [longitude, latitude] = user.location.coordinates;

    // Calculate the date for minimum age
    const maxBirthDate = new Date();
    maxBirthDate.setFullYear(maxBirthDate.getFullYear() - ageMin);

    // Calculate the date for maximum age
    const minBirthDate = new Date();
    minBirthDate.setFullYear(minBirthDate.getFullYear() - ageMax);

    // Find nearby users based on location and preferences
    const nearbyUsers = await User.find({
      _id: { $ne: req.user._id }, // Exclude the current user
      gender: { $in: gender }, // Match gender preferences
      birthday: { $lte: maxBirthDate, $gte: minBirthDate }, // Match age range
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance * 1000 // Convert km to meters
        }
      }
    }).select('-password');

    res.json(nearbyUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};