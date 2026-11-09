import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
    },
    startingLocation: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    destinationRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    travelers: {
      type: Number,
      default: 1,
      min: 1,
    },
    budget: {
      type: Number,
      default: 1000,
      min: 0,
    },
    preferences: {
      type: [String],
      default: [],
    },
    travelType: {
      type: String,
      default: 'Leisure',
    },
    accommodationPreference: {
      type: String,
      default: 'Luxury',
    },
    transportationPreference: {
      type: String,
      default: 'Flight',
    },
    status: {
      type: String,
      enum: ['Planned', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Planned',
    },
    overview: {
      type: String,
      default: '',
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        date: { type: String, default: '' },
        title: { type: String, default: '' },
        morning: {
          activity: { type: String, default: '' },
          location: { type: String, default: '' },
          estimatedCost: { type: Number, default: 0 },
        },
        afternoon: {
          activity: { type: String, default: '' },
          location: { type: String, default: '' },
          estimatedCost: { type: Number, default: 0 },
        },
        evening: {
          activity: { type: String, default: '' },
          location: { type: String, default: '' },
          estimatedCost: { type: Number, default: 0 },
        },
        attractions: { type: [String], default: [] },
        dailyTips: { type: String, default: '' },
      },
    ],
    budgetBreakdown: {
      transportation: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      misc: { type: Number, default: 0 },
      totalEstimated: { type: Number, default: 0 },
    },
    travelTips: {
      type: [String],
      default: [],
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ user: 1, startDate: 1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
