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
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=NoCodeProvided`);
    }

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

    let user = await User.findOne({ 
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });

    if (!user) {
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
        // Silently handle email errors
      }
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileImage: user.profileImage
    });

    const redirectUrl = new URL(`/dashboard/${user.role}`, process.env.NEXT_PUBLIC_APP_URL).toString();
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (error) {
    const errorUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL);
    errorUrl.searchParams.set('error', 'AuthFailed');
    return NextResponse.redirect(errorUrl.toString());
  }
} 