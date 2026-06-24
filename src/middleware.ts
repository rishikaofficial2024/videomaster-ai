
/**
 * 🛠️ FIXED: Middleware removed to support "output: export".
 * Next.js does not allow middleware.ts when using static HTML export.
 */
export const dynamic = 'force-static';
