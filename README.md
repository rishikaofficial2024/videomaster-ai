
# VideoMaster AI - Professional Video Editor

AI-powered professional video editing for Android and iOS. Built with Next.js 15, Firebase, and Capacitor.

## 🚩 PENDING SETTINGS (ACTION REQUIRED)

Follow these 3 steps to make the app fully functional:

### 1. Update Firebase Credentials
*   Open `src/firebase/config.ts`.
*   Replace `REPLACE_WITH_YOUR_FIREBASE_API_KEY` with your actual API Key from the [Firebase Console](https://console.firebase.google.com/).

### 2. Update AI Credentials
*   Open `.env`.
*   Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Enable Cloud Services
*   **Authentication**: Enable "Email/Password" and "Google" in the Firebase Console.
*   **Firestore**: Click "Create Database" in the Firebase Console (Production Mode).
*   **Rules**: Security rules are applied automatically from `docs/backend.json`.

---

## 🛠 Features
- **AI Veo Video Gen**: High-end cinematic clips from text.
- **AI Voiceover**: Studio-quality narration (Gemini TTS).
- **Auto-Captions**: Instant transcription to WebVTT.
- **Magic SEO**: AI analysis for social media viral reach.

## 📱 Mobile Identity
* **App Name**: VideoMaster AI
* **Android Package Name**: `com.videomaster.ai`
* **Version**: 1.0.0

## 🚀 How to Test
1. **Web**: Run `npm run dev` and visit `http://localhost:9002/test-connection`.
2. **Android**: Run `npm run mobile:sync` then `npx cap open android`.
