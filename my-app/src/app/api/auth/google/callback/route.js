import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import { createToken } from '@/config/jwt';
import { cookies } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/api/auth/google/callback',
});

export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get('code');

    // Add detailed logging
    console.log('Full OAuth Config:', {
      clientId: process.env.GOOGLE_CLIENT_ID?.slice(0, 8) + '...',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'present' : 'missing',
      redirectUri: 'http://localhost:3000/api/auth/google/callback',
      code: code?.slice(0, 8) + '...'
    });

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing OAuth credentials');
      throw new Error('OAuth credentials not configured');
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=NoCodeProvided`);
    }

    // Add debug logging
    console.log('Google OAuth credentials:', {
      clientId: process.env.GOOGLE_CLIENT_ID?.slice(0, 5) + '...',
      redirectUri: 'http://localhost:3000/api/auth/google/callback',
      code: code.slice(0, 5) + '...'
    });

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No user payload');
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        role: 'Volunteer',
        profileImage: payload.picture || '/default-avatar.png',
        status: 'Active'
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(user.name, user.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId, add it
      user.googleId = payload.sub;
      await user.save();
    }

    // Create JWT token
    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Set cookie
    const cookieStore = cookies();
    await cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=AuthFailed`);
  }
} 