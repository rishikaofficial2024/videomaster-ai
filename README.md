
# VideoMaster AI - Professional Video Editor

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. This app is optimized for professional mobile video creation and monetization.

## 🚀 Final Production Checklist (DO THIS BEFORE PUBLISHING)

### 1. Firebase Console Settings (REQUIRED)
* **Enable Authentication**: Go to the [Firebase Console](https://console.firebase.google.com/), navigate to **Auth**, and enable the "Email/Password" and "Google" sign-in providers.
* **Firestore Setup**: Go to **Firestore Database** and click "Create Database". Start in **Production Mode**.
* **Storage**: Enable Firebase Storage if you intend to use it for large video file hosting.

### 2. Local Environment Setup
* **API Keys**: Add your `GEMINI_API_KEY` to your environment variables or `.env` file for Genkit flows.
* **Capacitor URL**: Once you have your production URL (e.g., `https://videomaster-ai.web.app`), update `capacitor.config.ts`.

### 3. Build & APK Generation
1. **Install Dependencies**: Run `npm install` in your project root.
2. **Build Web Assets**: Run `npm run build`. This creates the `/out` directory containing your static app.
3. **Sync Mobile**: Run `npm run mobile:sync`. This updates the Android project with your latest web code.
4. **Android Studio**: 
   - Open the `/android` folder in Android Studio.
   - Go to **Build > Generate Signed Bundle / APK** to create your final production file.

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
