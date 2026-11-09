import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Trip from '../models/Trip.js';
import Review from '../models/Review.js';
import Expense from '../models/Expense.js';
import { sampleDestinations } from '../utils/seedData.js';

dotenv.config();

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globetrotter';

  try {
    console.log(`[Seed] Connecting to database: ${uri}`);
    await mongoose.connect(uri);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Trip.deleteMany({});
    await Review.deleteMany({});
    await Expense.deleteMany({});

    // Create Admin and Traveler Users
    console.log('[Seed] Creating default users...');
    const adminUser = await User.create({
      name: 'Alexander Vance',
      email: 'admin@globetrotter.com',
      password: 'admin123456',
      role: 'admin',
      bio: 'Head of Luxury Operations & Lead Curator at GLOBETROTTER.',
      country: 'United Kingdom',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      travelPreferences: ['Luxury', 'Adventure', 'Photography', 'Fine Dining'],
    });

    const demoUser = await User.create({
      name: 'Elena Rostova',
      email: 'traveler@globetrotter.com',
      password: 'traveler123456',
      role: 'user',
      bio: 'Passionate travel writer, cultural anthropologist, and sunset seeker.',
      country: 'France',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      travelPreferences: ['Romantic Destinations', 'Temples', 'History', 'Nature'],
    });

    // Create Destinations
    console.log('[Seed] Inserting luxury destinations...');
    const destinationsWithCreator = sampleDestinations.map((dest) => ({
      ...dest,
      createdBy: adminUser._id,
    }));
    const createdDestinations = await Destination.insertMany(destinationsWithCreator);

    // Save one favorite destination for the demo user
    demoUser.savedDestinations.push(createdDestinations[0]._id, createdDestinations[1]._id);
    await demoUser.save();

    // Create Sample Reviews
    console.log('[Seed] Adding verified luxury reviews...');
    await Review.create([
      {
        destination: createdDestinations[0]._id,
        user: demoUser._id,
        rating: 5,
        title: 'Unrivaled sunset elegance in Oia',
        comment:
          'Our stay at the cliffside villa overlooking the caldera was utterly magical. Private catamaran cruise organized at sunset was the highlight of our European tour!',
      },
      {
        destination: createdDestinations[1]._id,
        user: adminUser._id,
        rating: 5,
        title: 'Spiritual tranquility like nowhere else',
        comment:
          'Walking through the bamboo grove at 6:30 AM before the city wakes up is an ethereal meditation. The Kaiseki dining was pure culinary art.',
      },
      {
        destination: createdDestinations[2]._id,
        user: demoUser._id,
        rating: 5,
        title: 'Alpine perfection beneath the Matterhorn',
        comment:
          'The Gornergrat cogwheel train journey took our breath away. Clean mountain air, world-class fondue, and unmatched Swiss hospitality.',
      },
    ]);

    // Create a Sample AI-planned Trip for Demo User
    console.log('[Seed] Creating demo trip and expenses...');
    const santorini = createdDestinations[0];
    const demoTrip = await Trip.create({
      user: demoUser._id,
      title: 'Romantic Autumn Escape in Santorini',
      startingLocation: 'Paris Charles de Gaulle',
      destination: 'Santorini, Greece',
      destinationRef: santorini._id,
      coverImage: santorini.images[0],
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-15'),
      travelers: 2,
      budget: 4500,
      travelType: 'Couple',
      accommodationPreference: 'Luxury Caldera Suite',
      transportationPreference: 'Business Class Flight & Chauffeur',
      status: 'Upcoming',
      overview:
        'A 5-day romantic sojourn across the Aegean cliffs of Santorini featuring private yacht excursions, volcanic vineyard tours, and clifftop sunsets in Oia.',
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
      travelTips: [
        'Pre-book cliffside dining tables at least 2 weeks ahead.',
        'Wear shoes with traction on smooth marble paths.',
      ],
      isAIGenerated: true,
    });

    // Create Expenses for this trip
    await Expense.create([
      {
        trip: demoTrip._id,
        user: demoUser._id,
        title: 'Flights Paris - Thira (Santorini) Roundtrip',
        amount: 1150,
        category: 'Transportation',
        paymentMethod: 'Card',
        notes: 'Air France business class booking reference #AF8921',
      },
      {
        trip: demoTrip._id,
        user: demoUser._id,
        title: 'Canaves Oia Suites Deposit',
        amount: 1400,
        category: 'Accommodation',
        paymentMethod: 'Card',
        notes: 'Deposit for 5 nights executive cave suite',
      },
      {
        trip: demoTrip._id,
        user: demoUser._id,
        title: 'Private Sunset Catamaran Charter',
        amount: 450,
        category: 'Activities',
        paymentMethod: 'Online Transfer',
        notes: 'Santorini Yachting Club half-day private charter',
      },
      {
        trip: demoTrip._id,
        user: demoUser._id,
        title: 'Fine Dining Welcome Dinner at Lauda',
        amount: 280,
        category: 'Food',
        paymentMethod: 'Card',
        notes: '3-course tasting menu with Greek wine pairing',
      },
    ]);

    console.log('\n======================================================');
    console.log('✅ [Seed Completed Successfully!]');
    console.log('Default Admin Account:');
    console.log('   Email:    admin@globetrotter.com');
    console.log('   Password: admin123456');
    console.log('Default Traveler Account:');
    console.log('   Email:    traveler@globetrotter.com');
    console.log('   Password: traveler123456');
    console.log(`Destinations Created: ${createdDestinations.length}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
