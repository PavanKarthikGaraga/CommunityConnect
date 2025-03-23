import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import { sendResetPasswordEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists, you will receive a password reset email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendResetPasswordEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account exists, you will receive a password reset email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}