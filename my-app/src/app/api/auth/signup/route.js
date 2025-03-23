import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import { createToken } from '@/config/jwt';
import { cookies } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req) {
  try {
    console.log('Starting signup process...');
    
    // Connect to database with improved error handling
    try {
      await connectDB();
      console.log('Connected to database');
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }
    
    const { name, email, password, role = 'Volunteer' } = await req.json();
    console.log('Received data:', { name, email, role }); // Don't log password

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Create token
    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Set cookie - fix for async cookies API
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(name, email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't return error - continue with signup process
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' }, // Include actual error message
      { status: 500 }
    );
  }
}