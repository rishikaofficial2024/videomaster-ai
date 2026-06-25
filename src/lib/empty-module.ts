/**
 * 🛡️ Industrial-Grade Empty Module Shim (Hardened Proxy)
 * Acts as a "Black Hole" that satisfies both Object and Function calls.
 * This prevents 'TypeError: The "original" argument must be of type function'
 * when gRPC or Node.js internal utilities try to promisify mocked methods.
 */

const noop = function () {
  return proxy;
};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    if (prop === 'default') return proxy;
    if (prop === '__esModule') return true;
    if (prop === Symbol.toPrimitive) return () => '';
    if (typeof prop === 'symbol') return undefined;
    if (prop === 'then') return undefined;
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

const proxy: any = new Proxy(noop, handler);

export default proxy;
