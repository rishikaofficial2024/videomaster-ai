
# 🏁 Final Deployment Checklist - VideoMaster AI

App ko live karne ke liye ye steps complete karein:

### 1. Firebase API Key (Auth & Database ke liye)
- [x] Go to [Firebase Console](https://console.firebase.google.com/).
- [x] Settings > Project Settings > Web API Key.
- [x] Paste in `src/firebase/config.ts`.

### 2. Gemini API Key (AI Features ke liye - MANDATORY)
- [ ] Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
- [ ] Click **Create API Key**.
- [ ] Open `.env` file in your project.
- [ ] Add: `GEMINI_API_KEY=PASTE_YOUR_KEY_HERE`.
- **Note**: Bina iske Script, Thumbnail aur Video generation error dega.

### 3. Firebase Console Settings
- [ ] **Authentication**: Enable 'Email/Password' aur 'Google'.
- [ ] **Firestore Database**: 'Create Database' karein aur 'Test Mode' mein chalu karein.

### 4. App Testing
- [ ] Login page par 'System Status' button check karein.
- [ ] Agar AI features mein 400 error aaye, toh samjhiye Gemini Key galat hai.
