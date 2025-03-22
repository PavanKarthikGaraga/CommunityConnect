import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Debug log (remove in production)
console.log('Attempting to connect with URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    try {
      console.log('Initializing MongoDB connection...');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      cached.conn = await cached.promise;
      console.log('Successfully connected to MongoDB Atlas');
      return cached.conn;
    } catch (error) {
      console.error('Detailed MongoDB Connection Error:', {
        name: error.name,
        code: error.code,
        codeName: error.codeName,
        message: error.message,
        uri: MONGODB_URI.replace(/:[^:]*@/, ':****@')
      });
      cached.promise = null;
      throw error;
    }
  }

  return cached.conn;
}

export default connectDB;