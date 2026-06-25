import type { NextConfig } from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ✅ ELITE STATIC EXPORT: Mandatory for Capacitor (Android APK) and Firebase Hosting.
  output: 'export',
  
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config, { isServer }) => {
    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit client-side usage.
    // We apply some shims even for the server bundle during static build to prevent gRPC crashes.
    const shimPath = path.resolve(process.cwd(), 'src/lib/empty-module.ts');

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
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
        timers: false,
        buffer: false,
        process: false,
        http2: false,
      };
    }

    // Force resolve aliases for both client and server to satisfy gRPC-js logic during evaluation
    config.resolve.alias = {
      ...config.resolve.alias,
      'async_hooks': shimPath,
      'fs': shimPath,
      'net': shimPath,
      'tls': shimPath,
      'dns': shimPath,
      'http2': shimPath,
      'diagnostics_channel': shimPath,
      // Force Firestore to use the browser-compatible version even during pre-rendering
      '@firebase/firestore': path.resolve(process.cwd(), 'node_modules/@firebase/firestore/dist/index.esm2017.js'),
    };

    return config;
  },

  experimental: {
    turbo: {
      resolveAlias: {
        'async_hooks': './src/lib/empty-module.ts',
        'diagnostics_channel': './src/lib/empty-module.ts',
        'fs': './src/lib/empty-module.ts',
        'net': './src/lib/empty-module.ts',
        'tls': './src/lib/empty-module.ts',
        'dns': './src/lib/empty-module.ts',
        'http2': './src/lib/empty-module.ts',
        '@firebase/firestore': './node_modules/@firebase/firestore/dist/index.esm2017.js',
      },
    },
  },
};

export default nextConfig;
