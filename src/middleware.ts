
/**
 * Middleware is disabled for this project because it is not compatible 
 * with Next.js 'output: export' which is required for Capacitor mobile builds.
 * 
 * Route protection is handled client-side via the <AuthGuard /> component 
 * in sensitive route layouts.
 */
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
