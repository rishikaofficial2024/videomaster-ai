
# 🛠️ VideoMaster AI - Live Setup Guide (Hindi)

App ko puri tarah live karne ke liye ye aakhri 3 kaam Firebase Console par turant karein:

### 1. Login chalu karein (Authentication)
- [Firebase Console](https://console.firebase.google.com/) par jayein.
- Left menu mein **Build > Authentication** par click karein.
- **Get Started** dabayein.
- **Native Providers** mein **Email/Password** ko select karke "Enable" karein aur Save karein.
- (Optional) **Google** login ko bhi enable karein.

### 2. Database chalu karein (Firestore)
- Console mein **Build > Firestore Database** par click karein.
- **Create Database** dabayein.
- Location select karein (asia-south1 best hai India ke liye).
- **Start in Test Mode** select karein (taki shuruat mein koi permission error na aaye).
- "Enable" par click karein.

### 3. AI Features ke liye Gemini Key
- AI features (Voiceover, Captions) ke liye apni `.env` file check karein.
- Usme `GEMINI_API_KEY=Apni_Key_Yahan_Dalein` hona chahiye. 
- Key yahan se milegi: [aistudio.google.com](https://aistudio.google.com/app/apikey)

**App Check**: Agar login karte waqt "Login Failed" aaye, toh samjhiye Step 1 (Authentication) pending hai.
