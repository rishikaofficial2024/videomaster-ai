/**
 * 🛡️ Universal Empty Module Shim
 * acts as a "Black Hole" Proxy that satisfies both Object and Function calls.
 * This prevents 'TypeError: The "original" argument must be of type function'
 * when libraries like gRPC try to promisify non-existent Node.js methods.
 */

const noop = () => {};

const handler: ProxyHandler<any> = {
  get: (target, prop) => {
    if (prop === 'Symbol(Symbol.toPrimitive)') return () => '';
    return proxy;
  },
  apply: () => proxy,
  construct: () => proxy,
};

const proxy: any = new Proxy(noop, handler);

export default proxy;
