
/**
 * 🛠️ FIXED: Middleware disabled to support "output: export" for Capacitor & Static Hosting.
 * Do not add middleware logic here as it will break the production build.
 */
export const dynamic = 'force-static';
export default function middleware() {
  return null;
}
