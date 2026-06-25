/**
 * 🛡️ Universal Empty Module Shim (Hardened Version)
 * acts as a "Black Hole" Proxy that satisfies both Object and Function calls.
 * This prevents 'TypeError: The "original" argument must be of type function'
 * when libraries like gRPC or Google Auth try to promisify non-existent Node.js methods.
 */

const noop = () => {
  return proxy;
};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    // Handle special symbols used by internal util.promisify and other Node utilities
    if (prop === 'Symbol(Symbol.toPrimitive)') return () => '';
    if (prop === 'then') return undefined; // Avoid looking like a Promise
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

// The proxy itself is a function (noop) to satisfy util.promisify
const proxy: any = new Proxy(noop, handler);

export default proxy;
