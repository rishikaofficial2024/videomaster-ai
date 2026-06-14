
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videomaster.ai',
  appName: 'VideoMaster AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Once deployed, replace with your hosted URL to allow the APK to access server-side AI features.
    // url: 'https://videomaster-ai.web.app',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
