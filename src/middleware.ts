/**
 * 🛠️ LEAD DEVELOPER FIX: Middleware neutralized to support static exports.
 * This ensures the app can be compiled for Android APK and Firebase Hosting without errors.
 * Next.js does not allow middleware when using 'output: export'.
 */
export const dynamic = 'force-static';

export default function middleware() {
  // Middleware logic is not supported in static exports.
  // Use Client-side guards for authentication where needed.
  return;
}

export const config = {
  matcher: [], // Do not match any routes to prevent build errors
};
