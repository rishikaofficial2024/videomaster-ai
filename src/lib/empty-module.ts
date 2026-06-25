/**
 * 🛡️ Universal Empty Module Shim (Hardened Version)
 * acts as a "Black Hole" Proxy that satisfies both Object and Function calls.
 * This prevents 'TypeError: The "original" argument must be of type function'
 * when libraries like gRPC or Google Auth try to promisify non-existent Node.js methods.
 */

// We define a base function so that 'typeof proxy === "function"' is true.
// This is critical for util.promisify(shim.method).
const noop = function () {
  return proxy;
};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    // Standard ESM interop
    if (prop === 'default') return proxy;
    if (prop === '__esModule') return true;
    
    // Handle special symbols used by internal util.promisify and other Node utilities
    if (prop === Symbol.toPrimitive) return () => '';
    if (typeof prop === 'symbol') return undefined;
    if (prop === 'then') return undefined; // Avoid looking like a Promise
    
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

// The proxy itself wraps the noop function
const proxy: any = new Proxy(noop, handler);

export default proxy;
