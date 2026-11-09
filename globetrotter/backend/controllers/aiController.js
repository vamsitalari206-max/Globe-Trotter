import { generateGeminiTripPlan } from '../services/geminiService.js';
import Destination from '../models/Destination.js';

// @desc    Generate AI-powered personalized itinerary
// @route   POST /api/ai/generate-itinerary
// @access  Public / Private
export const generateItinerary = async (req, res, next) => {
  try {
    const {
      destination,
      startingLocation,
      startDate,
      endDate,
      travelers,
      budget,
      preferences,
      travelType,
      accommodationPreference,
      transportationPreference,
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination name is required to generate an itinerary.',
      });
    }

    // Try matching with existing destination for rich imagery
    const destinationDoc = await Destination.findOne({
      $or: [
        { name: { $regex: destination, $options: 'i' } },
        { title: { $regex: destination, $options: 'i' } },
      ],
    });

    const itineraryResult = await generateGeminiTripPlan({
      destination,
      startingLocation,
      startDate,
      endDate,
      travelers: Number(travelers) || 1,
      budget: Number(budget) || 2000,
      preferences: preferences || ['Sightseeing', 'Luxury'],
      travelType: travelType || 'Leisure',
      accommodationPreference: accommodationPreference || 'Luxury Boutique Hotel',
      transportationPreference: transportationPreference || 'Flight',
    });

    // Attach destination image or ID if found
    if (destinationDoc) {
      itineraryResult.destinationRef = destinationDoc._id;
      itineraryResult.coverImage = destinationDoc.images[0];
      itineraryResult.coordinates = destinationDoc.coordinates;
    } else {
      itineraryResult.coverImage =
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    }

    res.status(200).json({
      success: true,
      data: itineraryResult,
    });
  } catch (error) {
    next(error);
  }
};
