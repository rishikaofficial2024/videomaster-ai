
# 🚀 VideoMaster AI - Setup Guide (Hindi)

Aapka app ready hai! Bas ye 3 kaam kar lijiye aur aapka app chalne lagega:

---

### 1. API Key Kahan Milegi? (Firebase)
*   [Firebase Console](https://console.firebase.google.com/) par jayein.
*   Apne project par click karein.
*   Upar left mein ⚙️ (Settings) par click karke **Project Settings** chunein.
*   Niche scroll karein "Your apps" section mein.
*   Wahan ek code ka tukda (Snippet) milega jisme `apiKey`, `authDomain` likha hoga.
*   Use copy karein aur apne project ki file `src/firebase/config.ts` mein paste kar dein.

### 2. Authentication Enable Karein
*   Firebase Console mein left menu mein **Build > Authentication** par jayein.
*   **Get Started** button dabayein.
*   "Sign-in method" tab mein **Google** aur **Email/Password** ko enable karke Save kar dein.

### 3. Database Chalu Karein
*   Left menu mein **Build > Firestore Database** par jayein.
*   **Create Database** par click karein.
*   **Start in Test Mode** select karein aur Enable kar dein.

---

### 🛠️ App Kaise Check Karein?
Jab aap ye kar lenge, toh browser mein `/test-connection` page par jayein. Agar saari lights **Green** hain, toh aapka app perfect hai!

**Support**: Agar kuch samajh na aaye, toh `src/firebase/config.ts` file ko khol kar uske upar likhe instructions padhein.
