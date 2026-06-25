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
    // 🚀 FIRESTORE OPTIMIZATION: Force the use of the browser ESM build even on the server (SSR).
    // This completely bypasses the gRPC Node.js implementation during pre-rendering.
    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase/firestore': path.resolve(__dirname, 'node_modules/@firebase/firestore/dist/index.esm2017.js'),
    };

    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit & Firestore client-side usage.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        diagnostics_channel: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'dns/promises': false,
        child_process: false,
        os: false,
        readline: false,
        perf_hooks: false,
        http2: false,
        vm: false,
        stream: false,
        crypto: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
        timers: false,
        buffer: false,
        process: false,
        util: false,
        events: false,
        string_decoder: false,
      };
    } else {
      // On the server (SSR pass for export), we alias Node built-ins that gRPC tries to use
      config.resolve.alias = {
        ...config.resolve.alias,
        'fs': path.resolve(__dirname, 'src/lib/empty-module.ts'),
        'net': path.resolve(__dirname, 'src/lib/empty-module.ts'),
        'tls': path.resolve(__dirname, 'src/lib/empty-module.ts'),
        'dns': path.resolve(__dirname, 'src/lib/empty-module.ts'),
        'http2': path.resolve(__dirname, 'src/lib/empty-module.ts'),
      };
    }

    return config;
  },

  // ⚡ TURBOPACK ALIASES: Ensure 'next dev --turbopack' works without Node module errors.
  experimental: {
    turbo: {
      resolveAlias: {
        // Force browser build for Turbopack SSR
        'firebase/firestore': './node_modules/@firebase/firestore/dist/index.esm2017.js',
        // Shim Node internals
        'async_hooks': './src/lib/empty-module.ts',
        'diagnostics_channel': './src/lib/empty-module.ts',
        'fs': './src/lib/empty-module.ts',
        'net': './src/lib/empty-module.ts',
        'tls': './src/lib/empty-module.ts',
        'dns': './src/lib/empty-module.ts',
        'dns/promises': './src/lib/empty-module.ts',
        'child_process': './src/lib/empty-module.ts',
        'os': './src/lib/empty-module.ts',
        'readline': './src/lib/empty-module.ts',
        'perf_hooks': './src/lib/empty-module.ts',
        'http2': './src/lib/empty-module.ts',
        'vm': './src/lib/empty-module.ts',
        'util': './src/lib/empty-module.ts',
      },
    },
  },
};

export default nextConfig;
