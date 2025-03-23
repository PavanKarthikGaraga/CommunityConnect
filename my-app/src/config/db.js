import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('MongoDB Connection Error Details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    throw error;
  }
}