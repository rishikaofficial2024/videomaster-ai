
/**
 * 🛠️ FIXED: Middleware neutralized for Next.js 15 Static Export compatibility.
 * Required for Capacitor Android APK builds and Firebase Hosting.
 */
export const dynamic = 'force-static';
export default function middleware() {}
