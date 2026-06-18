
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videomaster.ai',
  appName: 'VideoMaster AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Once deployed, you can point this to your Firebase Hosting URL for live updates
    // url: 'https://studio-9489287013-59986.web.app',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
