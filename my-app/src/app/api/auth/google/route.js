import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/api/auth/google/callback',
});

export async function GET() {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'openid',
      'email',
      'profile',
    ],
    prompt: 'consent',
  });

  return NextResponse.redirect(url);
} 