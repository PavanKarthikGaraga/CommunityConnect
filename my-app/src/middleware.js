import { NextResponse } from 'next/server';
import { verifyToken } from '@/config/jwt';

export async function middleware(request) {
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/projects/create', '/profile'];
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/create/:path*', '/profile/:path*']
};