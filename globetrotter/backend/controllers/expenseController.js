import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';

const isDBReady = () => mongoose.connection.readyState === 1;

let memoryExpenses = [
  {
    _id: 'exp-1',
    trip: { _id: '663510000000000000000001', title: 'Romantic Autumn Escape in Santorini', destination: 'Santorini, Greece', budget: 4500 },
    title: 'Roundtrip Business Class Flights',
    amount: 1150,
    category: 'Transportation',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Card',
    notes: 'Air France booking reference #AF8921',
  },
  {
    _id: 'exp-2',
    trip: { _id: '663510000000000000000001', title: 'Romantic Autumn Escape in Santorini', destination: 'Santorini, Greece', budget: 4500 },
    title: 'Canaves Oia Suites Luxury Deposit',
    amount: 1400,
    category: 'Accommodation',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Card',
    notes: 'Deposit for executive cliffside cave suite',
  },
  {
    _id: 'exp-3',
    trip: { _id: '663510000000000000000001', title: 'Romantic Autumn Escape in Santorini', destination: 'Santorini, Greece', budget: 4500 },
    title: 'Private Sunset Catamaran Charter',
    amount: 450,
    category: 'Activities',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Online Transfer',
    notes: 'Santorini Yachting Club half-day private charter',
  },
  {
    _id: 'exp-4',
    trip: { _id: '663510000000000000000001', title: 'Romantic Autumn Escape in Santorini', destination: 'Santorini, Greece', budget: 4500 },
    title: 'Fine Dining Welcome Dinner at Lauda',
    amount: 280,
    category: 'Food',
    date: new Date().toISOString(),
    paymentMethod: 'Card',
    notes: '3-course tasting menu with Greek wine pairing',
  },
];

// @desc    Get expenses (optionally filtered by trip)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.query;

    const categories = [
      'Transportation',
      'Accommodation',
      'Food',
      'Activities',
      'Shopping',
      'Miscellaneous',
    ];

    if (!isDBReady()) {
      let list = [...memoryExpenses];
      if (tripId) {
        list = list.filter((e) => (typeof e.trip === 'object' ? e.trip._id === tripId : e.trip === tripId));
      }
      const categoryBreakdown = categories.map((cat) => {
        const total = list
          .filter((e) => e.category === cat)
          .reduce((sum, item) => sum + item.amount, 0);
        return { category: cat, total };
      });
      const totalSpent = list.reduce((sum, item) => sum + item.amount, 0);

      const tripDetails = {
        _id: '663510000000000000000001',
        title: 'Romantic Autumn Escape in Santorini',
        destination: 'Santorini, Greece',
        budget: 4500,
        budgetBreakdown: {
          transportation: 1200,
          accommodation: 1800,
          food: 800,
          activities: 500,
          shopping: 100,
          misc: 100,
        },
      };

      return res.status(200).json({
        success: true,
        count: list.length,
        totalSpent,
        categoryBreakdown,
        tripDetails,
        expenses: list,
      });
    }

    const query = { user: req.user._id };
    if (tripId) {
      query.trip = tripId;
    }

    const expenses = await Expense.find(query)
      .populate('trip', 'title destination budget')
      .sort({ date: -1 });

    const categoryBreakdown = categories.map((cat) => {
      const total = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, item) => sum + item.amount, 0);
      return { category: cat, total };
    });

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    let tripDetails = null;
    if (tripId) {
      tripDetails = await Trip.findById(tripId).select(
        'title destination budget budgetBreakdown startDate endDate'
      );
    }

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalSpent,
      categoryBreakdown,
      tripDetails,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
  try {
    const { trip: tripId, title, amount, category, date, notes, paymentMethod } = req.body;

    if (!tripId || !title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trip, title, amount, and category',
      });
    }

    if (!isDBReady()) {
      const newExp = {
        _id: `exp_${Date.now()}`,
        trip: { _id: tripId, title: 'Active Trip', destination: 'Destination' },
        title,
        amount: Number(amount),
        category,
        date: date || new Date().toISOString(),
        notes: notes || '',
        paymentMethod: paymentMethod || 'Card',
      };
      memoryExpenses.unshift(newExp);
      return res.status(201).json({
        success: true,
        expense: newExp,
        message: 'Expense recorded successfully',
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Associated trip not found',
      });
    }

    const expense = await Expense.create({
      trip: tripId,
      user: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: date || Date.now(),
      notes: notes || '',
      paymentMethod: paymentMethod || 'Card',
    });

    res.status(201).json({
      success: true,
      expense,
      message: 'Expense recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      const idx = memoryExpenses.findIndex((e) => e._id === req.params.id);
      if (idx !== -1) {
        memoryExpenses[idx] = { ...memoryExpenses[idx], ...req.body };
        return res.status(200).json({
          success: true,
          expense: memoryExpenses[idx],
          message: 'Expense updated successfully',
        });
      }
    }

    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      expense,
      message: 'Expense updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    if (!isDBReady()) {
      memoryExpenses = memoryExpenses.filter((e) => e._id !== req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
      });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
