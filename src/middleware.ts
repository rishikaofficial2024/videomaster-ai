
/**
 * 🛠️ FIXED: Neutralized middleware for Next.js 15 Static Export compatibility.
 * Middleware is not supported when using 'output: export' for Capacitor APK builds.
 * Routing security is handled via Firebase AuthGuard and AdminGuard components.
 */
export const dynamic = 'force-static';
export default function middleware() {}
