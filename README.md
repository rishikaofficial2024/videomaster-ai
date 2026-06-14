
# VideoMaster AI - Professional Video Editor

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. This app is optimized for professional mobile video creation and monetization.

## 📱 Mobile Identity
* **App Name**: VideoMaster AI
* **Android Package Name (App ID)**: `com.videomaster.ai`
* **iOS Bundle ID**: `com.videomaster.ai`
* **Version**: 1.0.0

## 🚀 Final Production Checklist (DO THIS BEFORE PUBLISHING)

### 1. Firebase Console Settings (REQUIRED)
* **Enable Authentication**: Go to [Firebase Console](https://console.firebase.google.com/), navigate to **Build > Authentication**, and enable **Email/Password** and **Google**.
* **Firestore Setup**: Go to **Build > Firestore Database** and click "Create Database". Start in **Production Mode**.
* **Add Android App**: 
  * In Firebase Project Settings, click "Add App" > "Android".
  * Use Package Name: `com.videomaster.ai`.
  * Download the `google-services.json` and place it in `/android/app/`.
* **API Keys**: 
  * Ensure your `GEMINI_API_KEY` is set in your environment variables for Genkit flows.
  * Copy your **Web API Key** from Project Settings and paste it into `src/firebase/config.ts`.

### 2. Local Environment Setup
* **Install Dependencies**: Run `npm install`.
* **Build Assets**: Run `npm run build` to generate the static files for the mobile app.
* **Sync Mobile**: Run `npm run mobile:sync`. This updates the Android project with your latest web code.

### 3. Build & APK Generation
1. **Open Android Studio**: Run `npx cap open android`.
2. **Build APK**:
   - In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once finished, a notification will appear. Click "locate" to find your `app-debug.apk`.
3. **Generate Signed APK (For Play Store)**:
   - Go to **Build > Generate Signed Bundle / APK**.
   - Follow the wizard to create a keystore and sign your production app.

## Core Features
- **AI Veo Video Gen**: Create cinematic clips from text prompts.
- **AI Voiceover (TTS)**: Professional narration using Gemini 2.5 Flash TTS.
- **AI Magic SEO**: Optimized titles, descriptions, and hashtags.
- **Monetization**: Credit-based system and PRO subscriptions.
- **Cloud Studio**: Seamless project sync across devices.

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, ShadCN UI.
- **Backend**: Firebase Auth, Firestore.
- **AI**: Genkit with Gemini 2.5 Flash & Veo 2.0.
- **Mobile**: Capacitor 7.

## Troubleshooting
- **Build Errors**: If `npm run build` fails, ensure you don't have any TypeScript errors.
- **Firebase Errors**: Ensure your `google-services.json` is correctly placed in the `/android/app/` folder.
- **AI Failures**: Check that your `GEMINI_API_KEY` is valid and has sufficient quota.
