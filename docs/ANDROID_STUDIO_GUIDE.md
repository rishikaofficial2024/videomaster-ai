
# 📱 How to Build in Android Studio (Manual Export)

If you want to transfer your files and build the app manually instead of using GitHub Actions, follow these professional steps:

### Step 1: Download your Project
1. Go to your GitHub Repository: `https://github.com/rishikaofficial2024/videomaster-ai`
2. Click the green **"<> Code"** button.
3. Select **"Download ZIP"**.
4. Extract the ZIP file on your computer.

### Step 2: Open in Android Studio
1. Open **Android Studio**.
2. Click **"Open"** and select the `android` folder inside your extracted project.
3. Wait for the "Gradle Sync" to finish (it might take 2-5 minutes).

### Step 3: Connect Firebase (Google AI Studio Key)
1. Ensure your `GEMINI_API_KEY` from Google AI Studio is set in your local environment.
2. The app uses the Client SDK, so as long as your `src/firebase/config.ts` has the correct keys, the app will work.

### Step 4: Build APK
1. In Android Studio, go to the top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once finished, a notification will appear. Click **"locate"** to find your `app-debug.apk`.

### Why use this instead of GitHub?
Use this method if you want to test on a physical device connected via USB or if you want to make advanced changes to the Android native code.

**Your VideoMaster AI project is fully compatible with the latest Android Studio!** 🚀📱💎
