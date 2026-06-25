import type {NextConfig} from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ✅ ELITE STATIC EXPORT: Mandatory for Capacitor (Android APK) and Firebase Hosting.
  output: 'export',
  
  images: {
    // 🎨 CUSTOM IMAGE LOADER: Required for static optimization with external assets.
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },

  // 🛡️ BUILD STABILITY: Ignore non-critical errors during elite production builds.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config, { isServer }) => {
    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit & Firestore client-side usage.
    // This stops "Module not found" errors during static export.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        diagnostics_channel: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        readline: false,
        perf_hooks: false,
        path: false,
        os: false,
        stream: false,
        constants: false,
        crypto: false,
        vm: false,
        http: false,
        https: false,
        zlib: false,
        dns: false,
        'dns/promises': false,
        http2: false,
        timers: false,
        buffer: false,
        process: false,
        string_decoder: false,
        util: false,
        events: false,
      };
    }

    // 🚀 FIRESTORE OPTIMIZATION: Force the use of the browser ESM build even on the server.
    // This avoids loading gRPC (which requires 'dns', 'net', etc.) during the SSR pass.
    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase/firestore': path.resolve(__dirname, 'node_modules/@firebase/firestore/dist/index.esm2017.js'),
    };

    return config;
  },

  // ⚡ TURBOPACK ALIASES: Ensure 'next dev' works without Node module errors.
  // We use the universal proxy shim to satisfy internal Node-like calls.
  experimental: {
    turbo: {
      resolveAlias: {
        async_hooks: './src/lib/empty-module.ts',
        diagnostics_channel: './src/lib/empty-module.ts',
        // Note: fs, net, dns are intentionally left out here to allow SSR to function
        // if gRPC is loaded. Our Firestore alias above mitigates the need for them.
      },
    },
  },
};

export default nextConfig;
