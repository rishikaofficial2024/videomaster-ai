
/**
 * 🛠️ PRODUCTION STABILIZED: Middleware neutralized.
 * Next.js static export does not support middleware.ts.
 * This is required for Capacitor Android APK builds and Firebase Hosting static deploys.
 */
export const dynamic = 'force-static';
export default function middleware() {}
