
# 🔥 Firebase Setup Guide (MUST READ for Live App)

Aapka app technically taiyar hai, lekin aapko Firebase Console mein ye 3 kaam karne honge taaki login features (Phone, Google, Facebook) sahi se kaam karein.

### 1. Enable Sign-in Providers (auth/operation-not-allowed fix)
Agar login karte waqt error aata hai, toh iska matlab hai ki provider off hai.
1. [Firebase Console](https://console.firebase.google.com/) par jayein.
2. Left menu: **Build > Authentication > Sign-in Method**.
3. **Add new provider** par click karein aur in 3 ko **Enable** karein:
   - **Google** (Aapko email mangega, apna choose karein).
   - **Facebook** (Iske liye App ID chahiye hogi).
   - **Phone** (OTP ke liye).

### 2. Add Authorized Domains (auth/unauthorized-domain fix)
Firebase security ki wajah se sirf registered URLs se login allow karta hai.
1. **Authentication > Settings > Authorized domains** par jayein.
2. **Add domain** par click karein aur ye dono URLs jodein:
   - `studio-9489287013-59986.web.app` (Aapka live URL)
   - `9002-xxxxx.cloudworkstations.dev` (Aapka current browser URL)

### 3. Firestore Rules
Maine rules pehle hi update kar diye hain, lekin hamesha ensure karein ki **Build > Firestore Database > Rules** mein `allow read, write: if request.auth != null;` jaisa logic active hai.

---
**Porter AI / Admin ko kya batayein?**: "Maine saare Sign-in Providers enable kar diye hain aur Authorized Domains jodh diye hain."

Ab aapka app live use hone ke liye 100% stable hai! 🚀💰
