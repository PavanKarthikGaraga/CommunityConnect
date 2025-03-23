import { NextResponse } from 'next/server';
import { verifyToken } from './config/jwt';

// Define the config for matcher
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/create',
    '/profile'
  ]
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // If no token exists, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify and decode the token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Get user role from decoded token
    const userRole = decoded.role;

    // Handle dashboard routes
    if (path.startsWith('/dashboard')) {
      // Extract the role from the URL (e.g., /dashboard/Volunteer -> Volunteer)
      const requestedRole = path.split('/')[2];

      // If trying to access root dashboard, redirect to role-specific dashboard
      if (path === '/dashboard') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }

      // If trying to access a role-specific dashboard that doesn't match their role
      if (requestedRole && requestedRole !== userRole) {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
    }

    // Add role to request headers for potential use in the application
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-role', userRole);

    // Return the request with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // If token verification fails, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}