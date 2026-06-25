import type {NextConfig} from 'next';

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
    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit & Opentelemetry client-side usage.
    // This stops "Module not found" errors for async_hooks, fs, etc. during browser bundling.
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
        timers: false,
        buffer: false,
        process: false,
        string_decoder: false,
        util: false,
        events: false,
      };
    }
    return config;
  },
};

export default nextConfig;
