import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Destination title is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Mountains',
        'Beaches',
        'Adventure',
        'Historical Places',
        'Temples',
        'Wildlife',
        'Cities',
        'Romantic Destinations',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [val => val.length > 0, 'Please add at least one image URL'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    estimatedBudget: {
      min: { type: Number, default: 500 },
      max: { type: Number, default: 3500 },
      currency: { type: String, default: 'USD' },
    },
    bestTimeToVisit: {
      type: String,
      default: 'October - April',
    },
    attractions: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
      },
    ],
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    travelTips: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({ name: 'text', country: 'text', title: 'text', category: 'text' });
destinationSchema.index({ category: 1, isFeatured: 1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
