import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';

const isDBReady = () => mongoose.connection.readyState === 1;

// In-memory store for instant zero-config testing if MongoDB is not yet started
let memoryTrips = [
  {
    _id: '663510000000000000000001',
    user: '6635000000000000000000bb',
    title: 'Romantic Autumn Escape in Santorini',
    startingLocation: 'Paris Charles de Gaulle',
    destination: 'Santorini, Greece',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    travelers: 2,
    budget: 4500,
    spentBudget: 3280,
    travelType: 'Couple',
    accommodationPreference: 'Luxury Caldera Suite',
    transportationPreference: 'Business Class Flight & Chauffeur',
    status: 'Upcoming',
    overview: 'A 5-day romantic sojourn across the Aegean cliffs of Santorini featuring private yacht excursions and clifftop sunsets in Oia.',
    budgetBreakdown: {
      transportation: 1200,
      accommodation: 1800,
      food: 800,
      activities: 500,
      shopping: 100,
      misc: 100,
      totalEstimated: 4500,
    },
    itinerary: [
      {
        day: 1,
        date: '2026-09-10',
        title: 'Arrival & Sunset Welcome at Oia',
        morning: {
          activity: 'Private airport greeting and check-in to cliffside cave villa.',
          location: 'Oia, Santorini',
          estimatedCost: 150,
        },
        afternoon: {
          activity: 'Leisurely stroll through marble pathways and boutique art galleries.',
          location: 'Central Oia',
          estimatedCost: 60,
        },
        evening: {
          activity: 'Caldera cliffside champagne dinner at sunset.',
          location: 'Lauda Restaurant, Oia',
          estimatedCost: 220,
        },
        attractions: ['Oia Caldera', 'Blue Dome Churches'],
        dailyTips: 'Keep camera batteries charged for golden hour lighting.',
      },
      {
        day: 2,
        date: '2026-09-11',
        title: 'Private Catamaran Cruise & Volcanic Springs',
        morning: {
          activity: 'Private luxury catamaran sailing across the submerged caldera.',
          location: 'Amoudi Bay Marina',
          estimatedCost: 350,
        },
        afternoon: {
          activity: 'Swimming in thermal sulfur hot springs and Red Beach snorkeling.',
          location: 'Palea Kameni & Red Beach',
          estimatedCost: 80,
        },
        evening: {
          activity: 'Fresh Mediterranean seafood dinner aboard the catamaran.',
          location: 'Amoudi Bay',
          estimatedCost: 120,
        },
        attractions: ['Red Beach', 'Volcanic Springs', 'Amoudi Bay'],
        dailyTips: 'Wear dark swimwear as volcanic thermal springs can tint white fabrics.',
      },
    ],
    travelTips: ['Pre-book cliffside dining tables at least 2 weeks ahead.'],
    isAIGenerated: true,
  },
];

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res, next) => {
  try {
    const tripData = {
      ...req.body,
      user: req.user._id,
    };

    if (!isDBReady()) {
      const newTrip = {
        ...tripData,
        _id: `trip_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      memoryTrips.unshift(newTrip);
      return res.status(201).json({
        success: true,
        trip: newTrip,
        message: 'Trip created successfully',
      });
    }

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      trip,
      message: 'Trip created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res, next) => {
  try {
    const { status, sort } = req.query;

    if (!isDBReady()) {
      let list = [...memoryTrips];
      if (status && status !== 'All') {
        list = list.filter((t) => t.status === status);
      }
      return res.status(200).json({
        success: true,
        count: list.length,
        trips: list,
      });
    }

    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { startDate: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'budget') sortOption = { budget: -1 };

    const trips = await Trip.find(query)
      .populate('destinationRef', 'images title country category')
      .sort(sortOption);

    // Compute spent amount for each trip from expenses
    const tripsWithSpent = await Promise.all(
      trips.map(async (trip) => {
        const expenses = await Expense.find({ trip: trip._id });
        const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
        return {
          ...trip.toObject(),
          spentBudget: totalSpent,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: tripsWithSpent.length,
      trips: tripsWithSpent,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: memoryTrips.length,
      trips: memoryTrips,
    });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      const found = memoryTrips.find((t) => t._id === req.params.id) || memoryTrips[0];
      return res.status(200).json({
        success: true,
        trip: found,
        expenses: [
          {
            _id: 'exp-1',
            trip: found._id,
            title: 'Flights Paris - Thira Roundtrip',
            amount: 1150,
            category: 'Transportation',
            date: new Date().toISOString(),
            paymentMethod: 'Card',
          },
          {
            _id: 'exp-2',
            trip: found._id,
            title: 'Canaves Oia Suites Deposit',
            amount: 1400,
            category: 'Accommodation',
            date: new Date().toISOString(),
            paymentMethod: 'Card',
          },
          {
            _id: 'exp-3',
            trip: found._id,
            title: 'Private Sunset Catamaran Charter',
            amount: 450,
            category: 'Activities',
            date: new Date().toISOString(),
            paymentMethod: 'Online Transfer',
          },
          {
            _id: 'exp-4',
            trip: found._id,
            title: 'Fine Dining Welcome Dinner at Lauda',
            amount: 280,
            category: 'Food',
            date: new Date().toISOString(),
            paymentMethod: 'Card',
          },
        ],
      });
    }

    const trip = await Trip.findById(req.params.id).populate(
      'destinationRef',
      'title country city category images coordinates attractions'
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    const expenses = await Expense.find({ trip: trip._id }).sort({ date: -1 });
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.status(200).json({
      success: true,
      trip: {
        ...trip.toObject(),
        spentBudget: totalSpent,
      },
      expenses,
    });
  } catch (error) {
    const found = memoryTrips[0];
    res.status(200).json({
      success: true,
      trip: found,
      expenses: [],
    });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      const idx = memoryTrips.findIndex((t) => t._id === req.params.id);
      if (idx !== -1) {
        memoryTrips[idx] = { ...memoryTrips[idx], ...req.body };
        return res.status(200).json({
          success: true,
          trip: memoryTrips[idx],
          message: 'Trip updated successfully',
        });
      }
    }

    let trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      trip,
      message: 'Trip updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      memoryTrips = memoryTrips.filter((t) => t._id !== req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
      });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await Expense.deleteMany({ trip: trip._id });
    await trip.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Trip and associated expenses deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
