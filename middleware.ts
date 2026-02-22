import { NextRequest, NextResponse } from 'next/server';

// Matches MUTUALS_COOKIE_ID in lib/constants.ts
const AUTH_COOKIE = 'mutuals_auth_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  // If already authenticated and hitting the login page, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Protect all admin routes except the login page
  if (isAdminRoute && !isLoginPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    if (pathname !== '/admin' && pathname !== '/admin/') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
