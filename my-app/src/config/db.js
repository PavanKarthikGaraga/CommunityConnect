import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error('Database connection failed');
    throw error;
  }
}