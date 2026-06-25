import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // ✅ ELITE STATIC EXPORT: Mandatory for Capacitor (Android APK) and Firebase Hosting stability.
  output: 'export',
  
  images: {
    // 🎨 CUSTOM IMAGE LOADER: As requested for professional static optimization.
    loader: 'custom',
    loaderFile: './my-loader.ts',
    unoptimized: false, // Set to true if you don't have a resizing proxy
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config, { isServer }) => {
    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit & Opentelemetry client-side usage.
    // This stops "Module not found: Can't resolve 'fs'" errors during build.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
      };
    }
    return config;
  },
};

export default nextConfig;
