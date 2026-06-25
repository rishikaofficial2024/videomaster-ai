
/**
 * 🛠️ CRITICAL FIX: Middleware neutralized to support "output: export".
 * Next.js does not allow middleware files when using static exports for Capacitor/Android.
 */
export const dynamic = 'force-static';
export default function middleware() {}
