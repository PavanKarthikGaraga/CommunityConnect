import { NextResponse } from 'next/server';
import connectDB from '@/config/db';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      mongoURI: process.env.MONGODB_URI.replace(/mongodb:\/\/.*@/, 'mongodb://[REDACTED]@')
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