import Review from '../models/Review.js';
import Destination from '../models/Destination.js';

// @desc    Get reviews for a destination
// @route   GET /api/reviews/:destinationId
// @access  Public
export const getDestinationReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ destination: req.params.destinationId })
      .populate('user', 'name avatar country')
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

// @desc    Add a review for a destination
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { destinationId, rating, title, comment } = req.body;

    if (!destinationId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination ID, rating (1-5), and comment.',
      });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      destination: destinationId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this destination.',
      });
    }

    const review = await Review.create({
      destination: destinationId,
      user: req.user._id,
      rating: Number(rating),
      title: title || '',
      comment,
    });

    // Update destination average rating and count
    const allReviews = await Review.find({ destination: destinationId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    destination.rating = Number(avgRating.toFixed(1));
    destination.reviewsCount = allReviews.length;
    await destination.save();

    await review.populate('user', 'name avatar country');

    res.status(201).json({
      success: true,
      review,
      message: 'Review posted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Must be review author or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const destinationId = review.destination;
    await review.deleteOne();

    // Recalculate destination rating
    const allReviews = await Review.find({ destination: destinationId });
    const destination = await Destination.findById(destinationId);

    if (destination) {
      if (allReviews.length > 0) {
        const avg =
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        destination.rating = Number(avg.toFixed(1));
        destination.reviewsCount = allReviews.length;
      } else {
        destination.rating = 4.8;
        destination.reviewsCount = 0;
      }
      await destination.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
