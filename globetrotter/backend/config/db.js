import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globetrotter';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`\n======================================================`);
    console.warn(`[MongoDB Warning] Could not connect to database.`);
    console.warn(`Connection URI attempted: ${uri}`);
    console.warn(`Error message: ${error.message}`);
    console.warn(`Tip: Ensure MongoDB local service is running or provide a valid MONGODB_URI (e.g. MongoDB Atlas) in backend/.env`);
    console.warn(`======================================================\n`);
  }
};

export const getDBStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'none',
});

export default connectDB;
