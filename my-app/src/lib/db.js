import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.log("Not Accessible");
    throw new Error("MONGO_URL is not defined. Check your environment variables.");  
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    cached.conn = await cached.promise;
    global.mongoose = cached;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function disconnect() {
  try {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
