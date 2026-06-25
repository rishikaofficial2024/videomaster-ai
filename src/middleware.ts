/**
 * 🛠️ FIXED: Middleware neutralized to support "output: export" for Capacitor & Static Hosting.
 * To use Middleware, "output: export" must be removed from next.config.ts.
 * But since we need static export for the Android APK, this file is kept empty.
 */
export const dynamic = 'force-static';
export default function middleware() {
  return null;
}
