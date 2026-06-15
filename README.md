
# 🚀 VideoMaster AI - Final Setup Guide (Hindi)

Aapka app 100% ready hai, bas ye aakhiri 3 steps follow kijiye aur aapka app live ho jayega.

---

## 🚩 STEP 1: Firebase Console Mein Settings (Zaroori)

1.  **Firebase Console Khonlein**: [console.firebase.google.com](https://console.firebase.google.com/) par jayein.
2.  **Authentication Enable Karein**:
    *   Left menu mein **Build > Authentication** par click karein.
    *   **Get Started** dabayein.
    *   **Native Providers** mein `Email/Password` aur `Google` ko enable karke save karein.
3.  **Database Banayein**:
    *   Left menu mein **Build > Firestore Database** par click karein.
    *   **Create Database** par click karein.
    *   Location choose karein aur **Start in Test Mode** (ya Production) select karke enable karein.

---

## 🚩 STEP 2: API Keys Kahan Se Milegi?

### 1. Firebase API Key (Web App Key)
*   Firebase Console mein upar left mein ⚙️ (Settings icon) > **Project Settings** par jayein.
*   Niche scroll karein "Your apps" section mein.
*   Wahan aapko `apiKey`, `authDomain`, etc. dikhega. Use copy karke `src/firebase/config.ts` mein paste karein.

### 2. Gemini AI Key
*   [Google AI Studio](https://aistudio.google.com/app/apikey) par jayein.
*   **Create API Key** par click karein.
*   Is key ko copy karein aur apne project ki `.env` file mein `GEMINI_API_KEY=` ke aage paste karein.

---

## 🚩 STEP 3: App Kaise Chalayein?

1.  **Web Preview**: Terminal mein likhein `npm run dev`.
2.  **Login Check**: Browser mein `localhost:9002` kholkar signup karein.
3.  **Diagnosis**: `/test-connection` page par jaakar check karein ki saari lights "Green" hain ya nahi.

---

## 📱 Mobile Build (Android)
*   `npm run mobile:sync` (Ye aapke web code ko Android folder mein bhej dega).
*   Android Studio kholkar `android` folder open karein aur APK generate karein.

**Package Name**: `com.videomaster.ai` (Play Store par yahi use hoga).
