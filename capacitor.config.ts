
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videomaster.ai',
  appName: 'VideoMaster AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Uncomment the line below and replace with your hosted URL 
    // to allow the APK to access server-side AI features.
    // url: 'https://your-firebase-app-hosting-url.web.app',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
