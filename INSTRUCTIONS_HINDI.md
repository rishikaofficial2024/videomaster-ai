
# 🛠️ VideoMaster AI - Problem Solver Guide

Agar aapka app "Connecting..." par atka hai ya error de raha hai, toh ye check karein:

### 1. Firebase API Key ki Problem
- **Kahan milegi?**: Firebase Console -> Project Settings -> General -> Your Apps.
- **Kahan dalni hai?**: `src/firebase/config.ts` file mein.

### 2. Login Nahi Ho Raha?
- Firebase Console mein jayein.
- **Build > Authentication** par click karein.
- **Sign-in method** tab mein jayein aur **Email/Password** ko "Enable" karein.

### 3. Data Save Nahi Ho Raha?
- Firebase Console mein jayein.
- **Build > Firestore Database** par click karein.
- **Create Database** par click karke use "Test Mode" mein shuru karein.

### 4. AI Features (Captions/Video Gen) Kaam Nahi Kar Rahe?
- `.env` file mein apni **Gemini API Key** dalein.
- Key yahan se milegi: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 5. APK Kaise Banayein?
- Terminal mein ye command chalayein: `npm run mobile:build-apk`
- Isse Android Studio khulega jahan se aap APK nikal sakte hain.

**Zaruri**: Jab tak aap Firebase Console mein Authentication aur Firestore Database ko "Enable" nahi karenge, tab tak app sahi se kaam nahi karega.
