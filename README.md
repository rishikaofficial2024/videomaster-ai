# VideoMaster AI - Professional Video Editor

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. Optimized for mobile video creation.

## 📱 Mobile Identity
* **App Name**: VideoMaster AI
* **Android Package Name**: `com.videomaster.ai`
* **Version**: 1.0.0

## 🛠 Testing Your App (Is it running?)

### 1. Web Local Test
To see if the app is running in your browser:
1. Run `npm run dev`.
2. Open `http://localhost:9002` in your browser.
3. **Connectivity Check**: Visit `http://localhost:9002/test-connection` to run the built-in health check.

### 2. Firebase Connectivity Check
If the `/test-connection` page shows errors:
* **Firestore Error**: Go to Firebase Console > Build > Firestore and click "Create Database".
* **Auth Error**: Go to Firebase Console > Build > Authentication and enable "Email/Password" and "Google".
* **API Key Error**: Ensure your `apiKey` in `src/firebase/config.ts` matches the one in your Firebase Project Settings.

### 3. Android Mobile Test
To test the app on an Android device/emulator:
1. Run `npm run mobile:sync`.
2. Run `npx cap open android`. This opens the project in Android Studio.
3. In Android Studio, click the **Green Play Button** to run it on your device.

## 🚀 Final Production Checklist

### 1. Firebase Console Settings (REQUIRED)
* **Enable Authentication**: Enable **Email/Password** and **Google**.
* **Firestore Setup**: Create database in **Production Mode**.
* **Add Android App**: 
  * Use Package Name: `com.videomaster.ai`.
  * Download `google-services.json` and place it in `/android/app/`.
* **API Keys**: Ensure `GEMINI_API_KEY` is set in your environment.

### 2. Build & APK Generation
1. **Build Assets**: Run `npm run build`.
2. **Sync Mobile**: Run `npm run mobile:sync`.
3. **Open Android Studio**: Run `npx cap open android`.
4. **Build APK**: In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## Core Features
- **AI Veo Video Gen**: Cinematic clips from text prompts.
- **AI Voiceover**: Professional narration using Gemini TTS.
- **AI Magic SEO**: Automated analysis for social media.
- **Auto-Captions**: Instant subtitle generation.

## Troubleshooting
- **Build Errors**: Check for TypeScript errors or missing `google-services.json`.
- **Firebase Permission**: Ensure Firestore security rules allow read/write for authenticated users.
- **APK Not Opening**: Ensure `androidScheme` in `capacitor.config.ts` is correct.
