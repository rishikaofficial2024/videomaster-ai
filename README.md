
# 🚀 VideoMaster AI - Live Setup Guide

Aapka app coding ke hisaab se 100% complete hai. Ise active karne ke liye ye steps follow karein:

---

### 🔑 Step 1: Firebase API Key (Kaunsi hai aur kahan milegi?)

**API Key Kya Hai?**  
Ye aapke project ka unique identification code hai jo app ko Firebase services se jodta hai.

**Kahan Milegi? (Step-by-Step):**
1. **Console Link**: [Firebase Console Settings](https://console.firebase.google.com/project/videomaster-ai/settings/general/) par click karein.
2. **Settings**: Agar link kaam na kare toh Dashboard mein upar **Gear (⚙️) icon** dabakar 'Project Settings' mein jayein.
3. **Your Apps**: 'General' tab mein sabse niche scroll karein jahan 'Web App' ka config dikhega.
4. **Copy**: Wahan `apiKey: "AIza..."` jaisi ek lambi string hogi, use copy karein.
5. **Paste**: Apni coding files mein `src/firebase/config.ts` file kholein aur `YOUR_REAL_API_KEY_HERE` ko hata kar apni key paste kar dein.

---

### 🛠️ Step 2: Authentication Enable Karein
Firebase Console mein **Build > Authentication** mein jayein aur:
- 'Email/Password' provider ko Enable karein.
- 'Google' provider ko Enable karein.

### 📊 Step 3: Firestore Database Create Karein
Firebase Console mein **Build > Firestore Database** mein jayein aur:
- **Create Database** par click karein.
- **Start in Test Mode** select karke save karein.

---

### 📱 Mobile APK Kaise Banayein?
Jab Firebase setup ho jaye, tab terminal mein ye command chalayein:
`npm run mobile:build-apk`

**Tip**: Agar kuch kaam na kare, toh app ke `/test-connection` page par jayein, wo khud bata dega kya missing hai!
