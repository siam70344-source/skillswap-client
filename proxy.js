import { NextResponse } from 'next/server';

export function proxy(request) {
  const session = request.cookies.get('better-auth.session_token') ||
                  request.cookies.get('__Secure-better-auth.session_token');

  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard/client', '/dashboard/freelancer', '/dashboard/admin'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};