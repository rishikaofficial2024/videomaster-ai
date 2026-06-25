/**
 * 🛠️ CRITICAL FIX: Middleware removed to support "output: export" for Static Hosting and Android APK.
 * Next.js does not allow middleware files when using static exports.
 * Routing is now handled by firebase.json rewrites.
 */
export const dynamic = 'force-static';
