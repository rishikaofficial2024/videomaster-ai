
# VideoMaster AI - Mobile Build Guide (Android APK)

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor.

## Step 1: Local Setup
1. **Export Code**: Click the export button in the top right to download this project.
2. **Install Node**: Ensure you have Node.js 18+ installed.
3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Step 2: Firebase Deployment (Required for AI)
To use Genkit AI features (Veo video generation, AI Captions), the app must communicate with a live backend.
1. Deploy this project to **Firebase App Hosting**.
2. Update `capacitor.config.ts`:
   ```ts
   // Set the server url to your live production domain
   url: 'https://your-production-app.web.app'
   ```

## Step 3: Android Studio Setup
1. Install **Android Studio**.
2. Open Android Studio and install the **Android SDK** and an **Emulator**.

## Step 4: Build & APK Generation
We have provided an automated script to handle the Capacitor lifecycle.
1. Run the build command:
   ```bash
   npm run mobile:build-apk
   ```
   *This command runs `next build`, exports static files to `/out`, and syncs them to the Android project.*
2. Once **Android Studio** opens:
   - Wait for the Gradle sync to finish (watch the status bar).
   - Go to **Build** menu -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. When finished, a popup will appear. Click **Locate** to find your `app-debug.apk`.

## Features
- **AI Veo Video Gen**: Create cinematic clips from text.
- **Auto-Captions**: Generate subtitles with AI reasoning.
- **Monetization**: Pro subscriptions and Credit system integrated with Firestore.
- **Cloud Studio**: Real-time project persistence across devices.
