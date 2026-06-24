
/**
 * 🛠️ FIXED: Neutralized middleware for Next.js 15 Static Export compatibility.
 * Middleware is not supported when using 'output: export' for Capacitor APK builds.
 */
export const dynamic = 'force-static';
export default function middleware() {}
