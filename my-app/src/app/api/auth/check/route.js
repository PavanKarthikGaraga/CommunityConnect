import { NextResponse } from 'next/server';
import { verifyToken } from '@/config/jwt';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const tokenValue = token?.value;

    if (!tokenValue) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No authentication token found'
      }, { status: 401 });
    }

    try {
      const decoded = await verifyToken(tokenValue);
      if (!decoded) {
        return NextResponse.json({ 
          authenticated: false,
          message: 'Invalid token'
        }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
          profileImage: decoded.profileImage
        }
      });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError.message);
      return NextResponse.json({ 
        authenticated: false,
        message: 'Token verification failed'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      message: 'Authentication check failed'
    }, { status: 500 });
  }
} 