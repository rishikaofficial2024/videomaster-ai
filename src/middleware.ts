/**
 * NOTE: Middleware is not supported with 'output: export' in Next.js.
 * To prevent build errors during static export (required for Capacitor/APK),
 * this file has been neutralized. Authentication logic is handled client-side 
 * via AuthGuard in src/components/auth-guard.tsx.
 */
export const config = {
  matcher: [],
};
