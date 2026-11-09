import mongoose from 'mongoose';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Trip from '../models/Trip.js';
import Review from '../models/Review.js';
import Expense from '../models/Expense.js';

const isDBReady = () => mongoose.connection.readyState === 1;

// @desc    Get Admin dashboard overview metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        stats: {
          totalUsers: 12,
          totalDestinations: 10,
          totalTrips: 18,
          totalReviews: 24,
        },
        recentUsers: [
          { _id: 'u1', name: 'Alexander Vance', email: 'admin@globetrotter.com', role: 'admin' },
          { _id: 'u2', name: 'Elena Rostova', email: 'traveler@globetrotter.com', role: 'user' },
          { _id: 'u3', name: 'Lord Arthur Sterling', email: 'arthur@sterling.co.uk', role: 'user' },
        ],
        recentTrips: [
          { _id: 't1', title: 'Romantic Autumn Escape in Santorini', destination: 'Santorini, Greece', budget: 4500, status: 'Upcoming', user: { name: 'Elena Rostova' } },
          { _id: 't2', title: 'Kyoto Zen Shrines & Bamboo Grove', destination: 'Kyoto, Japan', budget: 3200, status: 'Planned', user: { name: 'Alexander Vance' } },
        ],
        categoryStats: [
          { _id: 'Romantic Destinations', count: 3 },
          { _id: 'Mountains', count: 2 },
          { _id: 'Temples', count: 2 },
          { _id: 'Adventure', count: 3 },
        ],
      });
    }

    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalReviews = await Review.countDocuments();

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTrips = await Trip.find()
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const categoryStats = await Destination.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDestinations,
        totalTrips,
        totalReviews,
      },
      recentUsers,
      recentTrips,
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        total: 2,
        page: 1,
        totalPages: 1,
        users: [
          { _id: '6635000000000000000000cc', name: 'Alexander Vance', email: 'admin@globetrotter.com', role: 'admin', country: 'United Kingdom', createdAt: new Date().toISOString() },
          { _id: '6635000000000000000000bb', name: 'Elena Rostova', email: 'traveler@globetrotter.com', role: 'user', country: 'France', createdAt: new Date().toISOString() },
        ],
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      users,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote to admin or demote)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Allowed values: user, admin',
      });
    }

    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        user: { _id: req.params.id, role },
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    await Trip.deleteMany({ user: user._id });
    await Expense.deleteMany({ user: user._id });
    await Review.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all related records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle destination featured status
// @route   PUT /api/admin/destinations/:id/toggle-featured
// @access  Private/Admin
export const toggleFeaturedDestination = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        isFeatured: true,
        message: 'Destination featured status updated',
      });
    }

    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    destination.isFeatured = !destination.isFeatured;
    await destination.save();

    res.status(200).json({
      success: true,
      isFeatured: destination.isFeatured,
      message: `Destination ${destination.isFeatured ? 'marked as featured' : 'unmarked from featured'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for admin moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        count: 1,
        reviews: [
          {
            _id: 'rev-demo-1',
            destination: { title: 'Santorini Sunset Haven', country: 'Greece' },
            user: { name: 'Elena Rostova', email: 'traveler@globetrotter.com' },
            rating: 5,
            title: 'Unrivaled sunset elegance in Oia',
            comment: 'Our stay at the cliffside villa overlooking the caldera was utterly magical.',
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .populate('destination', 'title country')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
