import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback',
});

export async function GET() {
  try {
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
  } catch (error) {
    return NextResponse.redirect('/auth/login?error=OAuthInitFailed');
  }
} 