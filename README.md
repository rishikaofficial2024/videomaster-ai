
# VideoMaster AI - Mobile Build Guide (Android APK)

Professional AI-powered video editor built with Next.js 15, Firebase, and Capacitor. This app features AI Veo video generation, auto-captions, and a cloud-synced studio.

## Step 1: Local Setup
1. **Export Code**: Click the export button in the top right of the IDE to download this project.
2. **Install Node**: Ensure you have Node.js 18+ installed on your local machine.
3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Step 2: Firebase Deployment (Required for AI)
To use Genkit AI features (Veo video generation, AI Captions), the app must communicate with a live backend.
1. Deploy this project to **Firebase App Hosting**.
2. Once deployed, get your production URL (e.g., `https://videomaster-ai.web.app`).
3. Update `capacitor.config.ts`:
   ```ts
   // Set the server url to your live production domain
   url: 'https://your-production-app.web.app'
   ```

## Step 3: Android Studio Setup
1. Download and install **Android Studio**.
2. Open Android Studio and install the **Android SDK** (API level 34+) and a virtual **Emulator**.

## Step 4: Build & APK Generation
We have provided an automated script in `package.json` to handle the Capacitor lifecycle.
1. Run the build command in your terminal:
   ```bash
   npm run mobile:build-apk
   ```
   *This command runs `next build`, exports static files to `/out`, and syncs them to the Android project.*
2. Once **Android Studio** opens automatically:
   - Wait for the **Gradle sync** to finish (watch the status bar at the bottom).
   - Go to the **Build** menu in the top toolbar.
   - Select **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. When the build is finished, a notification popup will appear in the bottom right. Click **Locate** to find your `app-debug.apk`.

## Features
- **AI Veo Video Gen**: Create cinematic clips from text prompts.
- **Auto-Captions**: Generate perfectly timed subtitles with AI reasoning.
- **Monetization**: Integrated Pro subscriptions and Credit system using Firestore.
- **Cloud Studio**: Real-time project persistence across all your mobile devices.

## Troubleshooting
- **AI not working?** Ensure your `server.url` in `capacitor.config.ts` matches your deployed Firebase URL.
- **Build errors?** Ensure you have run `npm run build` at least once locally to generate the `out` directory.
