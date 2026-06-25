/**
 * 🛡️ Industrial-Grade Empty Module Shim (Hardened Proxy)
 * Optimized for Next.js 15 Turbopack & Webpack.
 * Satisfies both ESM (import) and CommonJS (require) patterns.
 */

const noop = function () {
  return proxy;
};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    // Satisfy ESM default imports
    if (prop === 'default') return proxy;
    // Satisfy module system checks
    if (prop === '__esModule') return true;
    // Satisfy internal Node.js symbol checks (like util.promisify.custom)
    if (typeof prop === 'symbol') return undefined;
    // Prevent Promise-like behavior from causing infinite loops
    if (prop === 'then') return undefined;
    // Satisfy primitive conversions
    if (prop === Symbol.toPrimitive) return () => '';
    
    // For everything else, return the proxy itself (which is a function)
    return proxy;
  },
  // When called as a function (e.g., dns.lookup()), return the proxy to allow chaining
  apply: () => proxy,
  // When called as a constructor (e.g., new http2.Session()), return the proxy
  construct: () => proxy,
};

const proxy: any = new Proxy(noop, handler);

// Export as default for ESM
export default proxy;

// If this were plain JS, we would use module.exports = proxy;
// In TS, Next.js handles the interop, but the proxy .get('default') 
// handles the case where it's required via Node.
