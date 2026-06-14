
# VideoMaster AI - Professional Video Editor

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. Optimized for mobile video creation.

## 🚩 PENDING SETTINGS (ACTION REQUIRED)

1.  **Firebase API Key**: Go to `src/firebase/config.ts` and replace the `apiKey` placeholder with your real key from the [Firebase Console](https://console.firebase.google.com/).
2.  **AI API Key**: Create/Update `.env` file and add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Firebase Services**:
    *   **Auth**: Enable "Email/Password" and "Google" in the Authentication tab.
    *   **Firestore**: Click "Create Database" in the Firestore tab (choose Production Mode).

---

## 📱 Mobile Identity
* **App Name**: VideoMaster AI
* **Android Package Name**: `com.videomaster.ai`
* **Version**: 1.0.0

## 🛠 Testing Your App

### 1. Web Local Test
1. Run `npm run dev`.
2. Open `http://localhost:9002`.
3. **Health Check**: Visit `http://localhost:9002/test-connection` to verify cloud connectivity.

### 2. Android Mobile Test
1. Run `npm run mobile:sync`.
2. Run `npx cap open android`.
3. In Android Studio, click the **Green Play Button**.

## 🚀 Final Production Checklist

### 1. Firebase Console Settings
* **Add Android App**: 
  * Use Package Name: `com.videomaster.ai`.
  * Download `google-services.json` and place it in `/android/app/`.

### 2. Build & APK Generation
1. **Build Assets**: `npm run build`.
2. **Sync Mobile**: `npm run mobile:sync`.
3. **Open Android Studio**: `npx cap open android`.
4. **Build APK**: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## Core Features
- **AI Veo Video Gen**: Cinematic clips from text prompts.
- **AI Voiceover**: Professional narration using Gemini TTS.
- **AI Magic SEO**: Automated analysis for social media.
- **Auto-Captions**: Instant subtitle generation.
