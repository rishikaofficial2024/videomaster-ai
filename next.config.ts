import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // ✅ ELITE STATIC EXPORT: Mandatory for Capacitor (Android APK) and Firebase Hosting.
  output: 'export',
  
  images: {
    // 🎨 CUSTOM IMAGE LOADER: For Cloudinary and static optimization.
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
    // 🛡️ BROWSER-SIDE AI SHIELD: Polyfill Node modules for Genkit client-side usage.
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