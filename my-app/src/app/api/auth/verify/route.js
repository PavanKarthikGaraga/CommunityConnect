import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/config/db';
import { User } from '@/config/schema';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-failed`
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-failed`
      );
    }

    user.isEmailVerified = true;
    user.status = 'Active';
    await user.save();

    // Redirect based on organization type
    const redirectPath = user.role === 'NGO' ? '/dashboard/NGO' : '/dashboard/Government';
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`
    );

  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-failed`
    );
  }
} 