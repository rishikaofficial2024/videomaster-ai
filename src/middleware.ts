import { NextResponse } from 'next/server';

/**
 * 🛠️ MIDDLEWARE STUB: Middleware is technically incompatible with 'output: export'.
 * We return NextResponse.next() to satisfy Next.js request lifecycle without intervention.
 */
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
