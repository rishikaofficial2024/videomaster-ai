/**
 * Middleware is disabled for this project because it is not compatible 
 * with Next.js 'output: export' which is required for Capacitor mobile builds.
 * 
 * Route protection is handled client-side via the <AuthGuard /> component 
 * in sensitive route layouts.
 */
export const config = {
  unstable_allowMiddleware: false,
};
