
/**
 * 🛠️ FIXED: Neutralized middleware for Next.js 15 Static Export compatibility.
 * Middleware is not supported when using 'output: export'.
 */
export const dynamic = 'force-static';
export default function middleware() {}
