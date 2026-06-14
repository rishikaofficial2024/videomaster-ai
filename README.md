
# VideoMaster AI - Production & APK Build Guide

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. This app is optimized for professional mobile video creation and monetization.

## 🚀 Final Production Checklist (DO THIS BEFORE PUBLISHING)

### 1. Firebase Console Settings
* **Enable Authentication**: Go to the Firebase Console, navigate to **Auth**, and enable the "Email/Password" and "Google" sign-in providers.
* **Update Config**: Replace the placeholder values in `src/firebase/config.ts` with your actual Firebase project configuration found in **Project Settings > General**.
* **Firestore Rules**: Ensure your security rules allow users to read/write only their own data (this is handled automatically if you use our deployment system, but verify in the console).
* **Storage**: If you intend to use Firebase Storage for large video files in the future, enable it in the console.

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
1. **Install Dependencies**: Run `npm install` in your project root.
2. **Build Web Assets**: Run `npm run build`. This creates the `/out` directory containing your static app.
3. **Sync Mobile**: Run `npm run mobile:sync`. This updates the Android project with your latest web code.
4. **Android Studio**: 
   - Open the `/android` folder in Android Studio.
   - Go to **Build > Generate Signed Bundle / APK**.
   - Create a new Key Store (for Google Play) or use **Build > Build APK** for local testing.

## Commands Reference
* `npm run dev`: Local web development.
* `npm run mobile:build-apk`: Automated command to build, sync, and open Android Studio.
* `npm run genkit:dev`: Start Genkit UI for testing AI flows.

## Core Features
- **AI Veo Video Gen**: Create cinematic clips from text prompts using the latest Veo models.
- **AI Voiceover (TTS)**: Professional narration using Gemini 2.5 Flash TTS.
- **AI Magic SEO**: Optimized titles, descriptions, and hashtags for social media growth.
- **Monetization**: Credit-based system for AI tools and PRO subscriptions for unlimited access.
- **Cloud Studio**: Seamless project sync across devices using Firestore.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI.
- **Backend**: Firebase Authentication & Firestore.
- **AI**: Google Genkit & Gemini Pro/Veo.
- **Mobile**: Capacitor (Android/iOS Bridge).
