
# 🚀 VideoMaster AI - Final Launch Checklist

Aapka app coding aur design ke hisaab se 100% complete hai. Ise live (active) karne ke liye bas ye 3 steps pure karein:

---

### 🔑 1. Firebase API Key Update (Sabse Zaruri)
- **Kahan milegi?**: [Firebase Console](https://console.firebase.google.com/) > Project Settings > Your Apps.
- **Kya karna hai?**: `src/firebase/config.ts` file mein `YOUR_REAL_API_KEY_HERE` ko apni real key se replace karein.

### 🛠️ 2. Firebase Console Settings
- **Authentication**: `Build > Authentication` mein jayein aur "Email/Password" aur "Google" provider ko Enable karein.
- **Firestore**: `Build > Firestore Database` mein jayein aur "Create Database" par click karein (Start in Test Mode).

### 🤖 3. AI Features Setup (Gemini Key)
- **Kahan milegi?**: [Google AI Studio](https://aistudio.google.com/app/apikey) se apni API Key lein.
- **Kya karna hai?**: Is key ko apni deployment settings ya local `.env` file mein `GEMINI_API_KEY` ke naam se save karein.

---

### 📱 Mobile APK Kaise Banayein?
- Terminal mein `npm run mobile:build-apk` chalayein.
- Isse Android Studio khulega jahan se aap final APK nikal sakte hain.

---

**Tip**: Agar app login nahi ho raha ya data save nahi kar raha, toh `/test-connection` page par jaakar check karein ki kaunsi service pending hai!
