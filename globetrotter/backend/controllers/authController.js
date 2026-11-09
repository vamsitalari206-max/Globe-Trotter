import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const isDBReady = () => mongoose.connection.readyState === 1;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'globetrotter_luxury_jwt_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Send cookie & JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        country: user.country,
        travelPreferences: user.travelPreferences || ['Luxury', 'Adventure', 'Photography'],
        savedDestinations: user.savedDestinations || [],
        createdAt: user.createdAt || new Date().toISOString(),
      },
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (!isDBReady()) {
      // In-memory registration fallback for initial exploration
      const mockUser = {
        _id: '6635000000000000000000aa',
        name,
        email,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Explorer of world wonders.',
        country: 'Global Citizen',
        travelPreferences: ['Adventure', 'Nature', 'Luxury'],
        savedDestinations: [],
      };
      return sendTokenResponse(mockUser, 201, res);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount || email.toLowerCase().includes('admin@globetrotter.com') ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Instant demo credentials support even if DB is still starting
    if (email === 'traveler@globetrotter.com' && password === 'traveler123456') {
      const demoTraveler = {
        _id: '6635000000000000000000bb',
        name: 'Elena Rostova',
        email: 'traveler@globetrotter.com',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Passionate travel writer and sunset seeker.',
        country: 'France',
        travelPreferences: ['Romantic Destinations', 'Temples', 'History', 'Nature'],
        savedDestinations: ['663500000000000000000001'],
      };
      return sendTokenResponse(demoTraveler, 200, res);
    }

    if (email === 'admin@globetrotter.com' && password === 'admin123456') {
      const demoAdmin = {
        _id: '6635000000000000000000cc',
        name: 'Alexander Vance',
        email: 'admin@globetrotter.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Head of Luxury Operations at GLOBETROTTER.',
        country: 'United Kingdom',
        travelPreferences: ['Luxury', 'Adventure', 'Photography'],
        savedDestinations: [],
      };
      return sendTokenResponse(demoAdmin, 200, res);
    }

    if (!isDBReady()) {
      return res.status(401).json({
        success: false,
        message: 'Database is not yet connected. Click "Demo Traveler" or "Demo Admin" to log in instantly.',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    }

    const user = await User.findById(req.user.id).populate('savedDestinations');
    res.status(200).json({
      success: true,
      user: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};
