
# VideoMaster AI - Production & APK Build Guide

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor.

## 🚀 Final Production Checklist (DO THIS BEFORE PUBLISHING)

### 1. Firebase Console Settings
* **Enable Authentication**: In the Firebase Console, go to Auth and enable "Email/Password" and "Google" sign-in providers.
* **Update Config**: Replace the dummy values in `src/firebase/config.ts` with your actual Firebase project configuration found in Project Settings.
* **Firestore Rules**: Ensure your rules allow users to read/write only their own data.
* **Storage**: Enable Firebase Storage if you plan to move from Base64 to file-based storage in the future.

### 2. Local Environment Setup
* **API Keys**: Add your `GEMINI_API_KEY` to your Firebase App Hosting environment variables.
* **Capacitor URL**: Once you have your production URL (e.g., `https://videomaster-ai.web.app`), update `capacitor.config.ts`:
  ```ts
  server: {
    url: 'https://your-app-id.web.app',
    allowNavigation: ['*']
  }
  ```

### 3. Build & APK Generation
1. **Install Dependencies**: `npm install`
2. **Build Web Assets**: `npm run build` (This creates the `/out` directory).
3. **Sync Mobile**: `npm run mobile:sync`
4. **Android Studio**: 
   - Open the `/android` folder in Android Studio.
   - Go to **Build > Generate Signed Bundle / APK**.
   - Create a new Key Store (for Google Play) or use **Build APK** for testing.

## Commands Reference
* `npm run dev`: Local web development.
* `npm run mobile:build-apk`: Automated command to build, sync, and open Android Studio.
* `npm run genkit:dev`: Start Genkit UI for testing AI flows.

## Features
- **AI Veo Video Gen**: Create cinematic clips from text prompts.
- **AI Voiceover (TTS)**: Professional narration using Gemini.
- **AI Magic SEO**: Optimized titles, descriptions, and hashtags.
- **Monetization**: Credit-based system and PRO subscriptions.
