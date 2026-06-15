
# 🚀 VideoMaster AI - Setup Guide (Hindi)

Aapka app live aane ke liye bilkul tayyar hai! Bas ye 2 zaruri settings kar lijiye:

---

### 🔑 1. Firebase API Key Kaise Dalein?
1.  **[Firebase Console](https://console.firebase.google.com/)** par jayein.
2.  **Project Settings** (Gear icon ⚙️) par click karein.
3.  Niche scroll karein aur **Web App** (</> icon) section mein jayein.
4.  Wahan aapko `apiKey: "AIza..."` jaisa ek code milega.
5.  Usko copy karein aur is file mein paste kar dein: `src/firebase/config.ts`.

---

### 🛠️ 2. Firebase Services Kaise Chalu Karein?
App ko chalane ke liye Firebase Console mein ye do cheezein enable karna zaruri hai:

*   **Authentication**: Console mein **Build > Authentication** par jayein aur **Get Started** par click karein. Phir "Email/Password" aur "Google" ko enable kar dein.
*   **Firestore Database**: Console mein **Build > Firestore Database** par jayein aur **Create Database** par click karein (Start in Test Mode chunein).

---

### 📱 3. APK Kaise Banayein?
Agar aap mobile ke liye APK banana chahte hain:
1. Terminal mein `npm run mobile:sync` chalayein.
2. `npm run mobile:open` se Android Studio kholein.
3. Android Studio mein **Build > Build APK** par click karein.

---

**Tip**: Agar kuch samajh na aaye toh `/test-connection` page par jaakar check karein ki kaunsi service pending hai!
