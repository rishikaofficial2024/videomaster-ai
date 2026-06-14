
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videomaster.ai',
  appName: 'VideoMaster AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // IMPORTANT: Once you deploy to Firebase App Hosting, 
    // uncomment the line below and add your production URL.
    // url: 'https://videomaster-ai.web.app',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
