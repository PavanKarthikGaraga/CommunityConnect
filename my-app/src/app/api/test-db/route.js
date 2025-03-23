import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Check current connection state
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connectionState: stateMap[connectionState] || connectionState,
      mongoURI: process.env.MONGODB_URI.replace(/mongodb:\/\/.*@/, 'mongodb://[REDACTED]@'),
      databaseName: mongoose.connection.name
    });
  } catch (error) {
    console.error('DB Test Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
} 