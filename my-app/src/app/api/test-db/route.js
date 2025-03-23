import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    
    // Try to list databases to verify authentication
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();
    
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB Atlas',
      databases: result.databases.map(db => db.name),
      connectionString: process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')
    });
  } catch (error) {
    console.error('Detailed connection error:', {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to database',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 