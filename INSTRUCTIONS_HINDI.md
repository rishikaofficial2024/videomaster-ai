
# 🚀 VideoMaster AI Setup Guide (Hindi)

Aapka app tayyar hai! Bas ye 3 steps follow karein:

### 1️⃣ Firebase API Key Kaise Nikalein?
1. [Firebase Console](https://console.firebase.google.com/) par jayein.
2. Apne project (VideoMaster AI) par click karein.
3. Left side mein Gear Icon (⚙️) par click karke **Project Settings** chunein.
4. Niche scroll karein "Your apps" section tak.
5. Wahan aapko ek snippet dikhega, usmein `apiKey: "AIza..."` wali line ko copy karein.
6. Is key ko `src/firebase/config.ts` file mein `apiKey` ki jagah paste kar dein.

### 2️⃣ Firebase Services Chalu Karein
Firebase Console mein hi:
- **Authentication**: Left menu mein jayein, "Get Started" dabayein aur Google/Email enable karein.
- **Firestore Database**: Left menu mein jayein, "Create Database" par click karein aur use "Test Mode" ya "Production" mein chalu karein.

### 3️⃣ AI Key (Gemini)
AI features ke liye `.env` file mein apni Gemini key dalein jo aapko [Google AI Studio](https://aistudio.google.com/app/apikey) se milegi.

---
**Note**: Agar aapko koi file nahi mil rahi, toh editor ke left side mein files ki list mein dekhein.
