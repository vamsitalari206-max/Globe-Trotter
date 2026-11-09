import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import { sampleDestinations } from '../utils/seedData.js';

// Ensure sample destinations have deterministic IDs
const fallbackDestinations = sampleDestinations.map((d, i) => ({
  ...d,
  _id: d._id || `66350000000000000000000${(i + 1).toString(16).padStart(2, '0')}`,
}));

const isDBReady = () => mongoose.connection.readyState === 1;

// @desc    Get all destinations with search, filter, and sort
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const {
      search,
      category,
      country,
      minBudget,
      maxBudget,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    if (!isDBReady()) {
      // In-memory filter for seamless demo when MongoDB isn't running
      let list = [...fallbackDestinations];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (d) =>
            d.name.toLowerCase().includes(s) ||
            d.title.toLowerCase().includes(s) ||
            d.country.toLowerCase().includes(s) ||
            d.description.toLowerCase().includes(s)
        );
      }
      if (category && category !== 'All') {
        list = list.filter((d) => d.category === category);
      }
      if (country && country !== 'All') {
        list = list.filter((d) => d.country.toLowerCase() === country.toLowerCase());
      }
      if (minBudget) {
        list = list.filter((d) => d.estimatedBudget.min >= Number(minBudget));
      }
      if (maxBudget) {
        list = list.filter((d) => d.estimatedBudget.max <= Number(maxBudget));
      }
      if (sort === 'budget-asc') {
        list.sort((a, b) => a.estimatedBudget.min - b.estimatedBudget.min);
      } else if (sort === 'budget-desc') {
        list.sort((a, b) => b.estimatedBudget.max - a.estimatedBudget.max);
      } else {
        list.sort((a, b) => b.rating - a.rating);
      }

      return res.status(200).json({
        success: true,
        count: list.length,
        total: list.length,
        totalPages: 1,
        currentPage: 1,
        destinations: list,
      });
    }

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Country filter
    if (country && country !== 'All') {
      query.country = { $regex: `^${country}$`, $options: 'i' };
    }

    // Budget range
    if (minBudget || maxBudget) {
      query['estimatedBudget.min'] = {};
      if (minBudget) query['estimatedBudget.min'].$gte = Number(minBudget);
      if (maxBudget) query['estimatedBudget.max'] = { $lte: Number(maxBudget) };
    }

    // Sort order
    let sortOptions = { rating: -1, createdAt: -1 };
    if (sort === 'budget-asc') {
      sortOptions = { 'estimatedBudget.min': 1 };
    } else if (sort === 'budget-desc') {
      sortOptions = { 'estimatedBudget.max': -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOptions = { reviewsCount: -1, rating: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    if (destinations.length === 0 && total === 0 && !search && !category) {
      return res.status(200).json({
        success: true,
        count: fallbackDestinations.length,
        total: fallbackDestinations.length,
        totalPages: 1,
        currentPage: 1,
        destinations: fallbackDestinations,
      });
    }

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      destinations,
    });
  } catch (error) {
    // If DB fails, fallback
    res.status(200).json({
      success: true,
      count: fallbackDestinations.length,
      total: fallbackDestinations.length,
      totalPages: 1,
      currentPage: 1,
      destinations: fallbackDestinations,
    });
  }
};

// @desc    Get featured destinations for hero & landing page
// @route   GET /api/destinations/featured
// @access  Public
export const getFeaturedDestinations = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      return res.status(200).json({
        success: true,
        destinations: fallbackDestinations.filter((d) => d.isFeatured).slice(0, 6),
      });
    }

    const featured = await Destination.find({ isFeatured: true }).limit(6);
    if (featured.length === 0) {
      const top = await Destination.find({}).sort({ rating: -1 }).limit(6);
      if (top.length === 0) {
        return res.status(200).json({
          success: true,
          destinations: fallbackDestinations.filter((d) => d.isFeatured).slice(0, 6),
        });
      }
      return res.status(200).json({ success: true, destinations: top });
    }

    res.status(200).json({
      success: true,
      destinations: featured,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      destinations: fallbackDestinations.filter((d) => d.isFeatured).slice(0, 6),
    });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      const found = fallbackDestinations.find(
        (d) => d._id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase()
      );
      if (found) {
        return res.status(200).json({
          success: true,
          destination: found,
          reviews: [
            {
              _id: 'rev-1',
              user: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
              rating: 5,
              title: 'Utterly magical sunset view',
              comment: 'The cliffside villa reservation was sublime. Private catamaran cruise organized by Globetrotter was the highlight of our journey!',
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }
    }

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      const foundFallback = fallbackDestinations.find((d) => d._id === req.params.id);
      if (foundFallback) {
        return res.status(200).json({
          success: true,
          destination: foundFallback,
          reviews: [],
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    const reviews = await Review.find({ destination: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      destination,
      reviews,
    });
  } catch (error) {
    const foundFallback = fallbackDestinations.find((d) => d._id === req.params.id);
    if (foundFallback) {
      return res.status(200).json({
        success: true,
        destination: foundFallback,
        reviews: [],
      });
    }
    next(error);
  }
};

// @desc    Create new destination (Admin)
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      destination,
      message: 'Destination created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination (Admin)
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      destination,
      message: 'Destination updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination (Admin)
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    await destination.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Destination removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
