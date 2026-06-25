/**
 * 🛡️ Industrial-Grade Empty Module Shim (Universal Proxy)
 * Optimized for Next.js 15 Turbopack & Webpack.
 * Satisfies both ESM (import) and CommonJS (require) patterns.
 * Prevents "TypeError: original argument must be of type function" in util.promisify.
 */

const noop = function () {
  return proxy;
};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    if (prop === 'default') return proxy;
    if (prop === '__esModule') return true;
    if (typeof prop === 'symbol') return undefined;
    if (prop === 'then') return undefined;
    if (prop === Symbol.toPrimitive) return () => '';
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

const proxy: any = new Proxy(noop, handler);

export default proxy;
