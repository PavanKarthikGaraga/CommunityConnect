import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import { createToken } from '@/config/jwt';
import { sendWelcomeEmail } from '@/lib/email';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback',
});

export async function GET(req) {
  try {
    console.log('Starting Google OAuth callback...');
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get('code');

    if (!code) {
      console.error('No code provided in callback');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=NoCodeProvided`);
    }

    console.log('Getting tokens from Google...');
    const { tokens } = await client.getToken(code);
    
    if (!tokens.id_token) {
      console.error('No ID token received from Google');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=NoIdToken`);
    }

    console.log('Verifying ID token...');
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.error('No payload in ID token');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=NoPayload`);
    }

    console.log('Connecting to database...');
    await connectDB();

    console.log('Checking for existing user...');
    let user = await User.findOne({ 
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });

    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        role: 'Volunteer',
        profileImage: payload.picture || '/default-avatar.png',
        status: 'Active'
      });

      try {
        await sendWelcomeEmail(user.name, user.email);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
      }
    } else if (!user.googleId) {
      console.log('Updating existing user with Google ID...');
      user.googleId = payload.sub;
      await user.save();
    }

    console.log('Creating JWT token...');
    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileImage: user.profileImage
    });

    // Create the response with absolute URL
    const redirectUrl = new URL(`/dashboard/${user.role}`, process.env.NEXT_PUBLIC_APP_URL).toString();
    const response = NextResponse.redirect(redirectUrl);

    // Set cookie with proper configuration
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    console.log('Redirecting to:', redirectUrl);
    return response;

  } catch (error) {
    console.error('Google callback error:', error);
    const errorUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL);
    errorUrl.searchParams.set('error', 'AuthFailed');
    return NextResponse.redirect(errorUrl.toString());
  }
} 