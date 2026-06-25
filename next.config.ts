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
    const shimPath = path.resolve(process.cwd(), 'src/lib/empty-module.ts');

    if (!isServer) {
      // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit client-side usage.
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

    config.resolve.alias = {
      ...config.resolve.alias,
      'async_hooks': shimPath,
      'fs': shimPath,
      'net': shimPath,
      'tls': shimPath,
      'dns': shimPath,
      'http2': shimPath,
      'diagnostics_channel': shimPath,
      // Force ESM version of firestore to prevent Node.js util.promisify errors during build
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
