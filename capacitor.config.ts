import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videomaster.ai',
  appName: 'VideoMaster AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: '#05070a'
  },
  // Creator Branding for Production APK
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#05070a'
    }
  }
};

export default config;
