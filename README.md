
# 🚀 VideoMaster AI - Setup Guide (Hindi)

Aapka app ready hai! API Key dhundhne ke liye ye steps follow karein:

---

### 🔑 API Key Kaise Nikalein?
1.  **[Firebase Console](https://console.firebase.google.com/)** par jayein.
2.  Apne Project par click karein.
3.  Upar left mein gear icon ⚙️ par click karke **Project Settings** chunein.
4.  Niche scroll karein "Your apps" section mein.
5.  Wahan aapko ek code milega (Snippet), usme `apiKey: "..."` likha hoga.
6.  Usko copy karke `src/firebase/config.ts` mein paste kar dein.

---

### 🛠️ App Ko Chalane Ke Liye Checklist:
- [ ] **Authentication**: Firebase Console mein jaakar **Build > Authentication** chalu karein (Google/Email).
- [ ] **Firestore**: **Build > Firestore Database** par jayein aur **Create Database** (Test Mode) par click karein.
- [ ] **Gemini Key**: AI features ke liye `.env` file mein apni Gemini key dalein.

---

### 🛠️ App Kaise Check Karein?
Browser mein `/test-connection` page par jayein. Agar sab **Green** hai, toh aapka app perfect hai!
