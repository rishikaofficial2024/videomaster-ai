
# 🏁 Final Deployment Checklist - VideoMaster AI

App ko live karne ke liye ye steps complete karein:

### 1. Firebase API Key (Mandatory)
- [ ] Go to [Firebase Console](https://console.firebase.google.com/).
- [ ] Select project **videomaster-ai**.
- [ ] Settings (Gear Icon) > Project Settings.
- [ ] Copy **Web API Key**.
- [ ] Paste in `src/firebase/config.ts`.

### 2. Enable Authentication (Mandatory)
- [ ] Go to **Build > Authentication** in Firebase Console.
- [ ] Click **Get Started**.
- [ ] Enable **Email/Password**.
- [ ] Enable **Google** (Optional but recommended).

### 3. Create Firestore Database (Mandatory)
- [ ] Go to **Build > Firestore Database**.
- [ ] Click **Create Database**.
- [ ] Select **Start in Test Mode** (for initial development).
- [ ] Choose a location and click **Enable**.

### 4. AI Features (Optional but Recommended)
- [ ] Get a Gemini API Key from [AI Studio](https://aistudio.google.com/app/apikey).
- [ ] Add it to your `.env` file: `GEMINI_API_KEY=your_key_here`.

### 5. Mobile APK Build
- [ ] Once Firebase is connected, run: `npm run mobile:build-apk`.
