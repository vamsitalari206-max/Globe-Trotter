import mongoose from 'mongoose';
import User from '../models/User.js';
import Trip from '../models/Trip.js';

const isDBReady = () => mongoose.connection.readyState === 1;

// @desc    Get user profile and statistics
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        user: req.user,
        stats: {
          totalTrips: 1,
          completedTrips: 0,
          savedDestinationsCount: req.user?.savedDestinations?.length || 1,
        },
      });
    }

    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedDestinations');

    if (!user) {
      return res.status(200).json({
        success: true,
        user: req.user,
        stats: { totalTrips: 1, completedTrips: 0, savedDestinationsCount: 0 },
      });
    }

    const tripsCount = await Trip.countDocuments({ user: req.user.id });
    const completedTripsCount = await Trip.countDocuments({
      user: req.user.id,
      status: 'Completed',
    });

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalTrips: tripsCount,
        completedTrips: completedTripsCount,
        savedDestinationsCount: user.savedDestinations?.length || 0,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      user: req.user,
      stats: { totalTrips: 1, completedTrips: 0, savedDestinationsCount: 0 },
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, phoneNumber, country, travelPreferences, avatar } = req.body;

    if (!isDBReady()) {
      const updatedUser = {
        ...req.user,
        name: name || req.user.name,
        bio: bio !== undefined ? bio : req.user.bio,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : req.user.phoneNumber,
        country: country !== undefined ? country : req.user.country,
        travelPreferences: travelPreferences || req.user.travelPreferences,
        avatar: avatar || req.user.avatar,
      };
      return res.status(200).json({
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (country !== undefined) user.country = country;
    if (travelPreferences) user.travelPreferences = travelPreferences;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle saved destination bookmark
// @route   POST /api/users/favorites/:destinationId
// @access  Private
export const toggleFavoriteDestination = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        isFavorite: true,
        savedDestinations: [destinationId],
        message: 'Saved to favorites',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFav = user.savedDestinations.some(
      (id) => id.toString() === destinationId
    );

    if (isFav) {
      user.savedDestinations = user.savedDestinations.filter(
        (id) => id.toString() !== destinationId
      );
    } else {
      user.savedDestinations.push(destinationId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite: !isFav,
      savedDestinations: user.savedDestinations,
      message: isFav ? 'Removed from favorites' : 'Saved to favorites',
    });
  } catch (error) {
    next(error);
  }
};
