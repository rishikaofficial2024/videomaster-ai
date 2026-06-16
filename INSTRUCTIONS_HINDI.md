
# 🛠️ VideoMaster AI - Live Setup Guide (Hindi)

App ko chalane ke liye ye 3 kaam turant karein:

### 1. API Key Kahan se layein?
- [Firebase Console](https://console.firebase.google.com/) par jayein.
- **Project Settings** (upar gear icon ⚙️) mein jayein.
- Niche scroll karein aur **Web API Key** copy karein.
- Is key ko `src/firebase/config.ts` file mein `apiKey` ki jagah daal dein.

### 2. Login chalu karein (Authentication)
- Firebase Console mein left side mein **Authentication** par click karein.
- **Get Started** dabayein.
- **Email/Password** ko "Enable" karke save karein.
- Iske bina user login nahi kar payega.

### 3. Database chalu karein (Firestore)
- Firebase Console mein **Firestore Database** par click karein.
- **Create Database** par click karein.
- **Start in Test Mode** select karein taaki shuruat mein koi error na aaye.
- Iske bina app ka data (projects, profile) save nahi hoga.

**AI Features ke liye:**
- [aistudio.google.com](https://aistudio.google.com/app/apikey) se Gemini key lein.
- Use apni `.env` file mein `GEMINI_API_KEY=Yahan_Apni_Key` karke likh dein.

Ab aapka app puri tarah se kaam karne ke liye taiyar hai!
