# VideoMaster AI - Professional Video Editor

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. This app is optimized for professional mobile video creation and monetization.

## 🚀 Final Production Checklist (DO THIS BEFORE PUBLISHING)

### 1. Firebase Console Settings (REQUIRED)
* **Enable Authentication**: Go to the [Firebase Console](https://console.firebase.google.com/), navigate to **Auth**, and enable the "Email/Password" and "Google" sign-in providers.
* **Firestore Setup**: Go to **Firestore Database** and click "Create Database". Start in **Production Mode**. Use the rules generated in the project.
* **API Keys**: Ensure your `GEMINI_API_KEY` is set in your environment variables for Genkit flows.

### 2. Local Environment Setup
* **Capacitor URL**: Once you have your production URL (e.g., `https://videomaster-ai.web.app`), update `capacitor.config.ts`.
* **Build Assets**: Run `npm run build` to generate the static files for the mobile app.

### 3. Build & APK Generation
1. **Install Dependencies**: Run `npm install` in your project root.
2. **Build Web Assets**: Run `npm run build`. This creates the `/out` directory.
3. **Sync Mobile**: Run `npm run mobile:sync`. This updates the Android project.
4. **Android Studio**: 
   - Open the `/android` folder in Android Studio.
   - Go to **Build > Generate Signed Bundle / APK** to create your final `.apk`.

## Core Features
- **AI Veo Video Gen**: Create cinematic clips from text prompts.
- **AI Voiceover (TTS)**: Professional narration using Gemini 2.5 Flash TTS.
- **AI Magic SEO**: Optimized titles, descriptions, and hashtags.
- **Monetization**: Credit-based system and PRO subscriptions.
- **Cloud Studio**: Seamless project sync across devices.
