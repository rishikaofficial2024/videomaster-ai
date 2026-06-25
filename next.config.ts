import type {NextConfig} from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig: Config = {
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
    // 🚀 FIRESTORE OPTIMIZATION: Force the use of the browser ESM build even during SSR pass.
    const firestorePath = path.resolve(__dirname, 'node_modules/@firebase/firestore/dist/index.esm2017.js');
    const shimPath = path.resolve(__dirname, 'src/lib/empty-module.ts');

    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase/firestore': firestorePath,
    };

    // 🛡️ BROWSER-SIDE SHIELD: Polyfill Node modules for client-side usage.
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
      // On the server (SSR pass), we alias problematic Node built-ins to our proxy shim.
      config.resolve.alias = {
        ...config.resolve.alias,
        'fs': shimPath,
        'net': shimPath,
        'tls': shimPath,
        'dns': shimPath,
        'http2': shimPath,
        'async_hooks': shimPath,
        'diagnostics_channel': shimPath,
      };
    }

    return config;
  },

  experimental: {
    turbo: {
      resolveAlias: {
        // Force browser build and shims for Turbopack as well
        'firebase/firestore': './node_modules/@firebase/firestore/dist/index.esm2017.js',
        'async_hooks': './src/lib/empty-module.ts',
        'diagnostics_channel': './src/lib/empty-module.ts',
        'fs': './src/lib/empty-module.ts',
        'net': './src/lib/empty-module.ts',
        'tls': './src/lib/empty-module.ts',
        'dns': './src/lib/empty-module.ts',
        'http2': './src/lib/empty-module.ts',
      },
    },
  },
};

export default nextConfig;
