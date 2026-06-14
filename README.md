
# VideoMaster AI - Mobile Build Guide

This project is a Next.js 15 application optimized for conversion into an Android APK using Capacitor.

## Prerequisites
- Node.js & npm installed.
- Android Studio installed on your local machine.

## How to Build the APK (Step-by-Step)

1. **Download the Source Code**: Export this project from the IDE.
2. **Install Dependencies**: Open your terminal in the project folder and run:
   ```bash
   npm install
   ```
3. **Build the Web App**: This generates the static `out` folder required for the mobile app.
   ```bash
   npm run build
   ```
4. **Initialize Capacitor**:
   ```bash
   npx cap init "VideoMaster AI" com.videomaster.ai --web-dir out
   ```
5. **Add Android Platform**:
   ```bash
   npm run mobile:add
   ```
6. **Sync & Build APK**: This script will sync the latest code and open Android Studio:
   ```bash
   npm run mobile:build-apk
   ```
7. **Final Step in Android Studio**:
   - Once Android Studio opens, wait for Gradle to finish syncing.
   - Go to **Build** menu > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - A notification will appear when the build is done. Click **Locate** to find your `app-debug.apk`.

## Deployment
For AI features (Genkit) to work inside the APK, you should host this Next.js app on **Firebase App Hosting** and update the `url` property in `capacitor.config.ts` to point to your live website.
