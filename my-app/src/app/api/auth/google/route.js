import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback',
});

export async function GET() {
  try {
    console.log('Initializing Google OAuth...');
    console.log('Redirect URI:', process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback');
    
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'openid',
        'email',
        'profile',
      ],
      prompt: 'consent',
    });

    console.log('Generated OAuth URL:', url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Google OAuth initialization error:', error);
    return NextResponse.redirect('/auth/login?error=OAuthInitFailed');
  }
} 