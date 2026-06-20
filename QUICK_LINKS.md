
# 🚀 VideoMaster AI: Quick Setup & Live Links

Aapke app ko live aur stable karne ke liye ye direct links aur details use karein.

### 1. Firebase Auth Settings (Sabse Zaroori)
👉 **Link**: [Firebase Auth Providers](https://console.firebase.google.com/project/studio-9489287013-59986/authentication/providers)

**Inhe "Enable" karein:**
- **Google**: Bas ON switch dabayein.
- **Phone**: Bas ON switch dabayein (OTP ke liye).
- **GitHub**: Niche di gayi details wahan dalein.

### 2. GitHub OAuth Details (From Your Screenshot)
GitHub OAuth App settings mein ye details pehle se set hain:
- **Client ID**: `0v23liyd0nsdIH0s0VFK`
- **Homepage URL**: `https://studio-9489287013-59986.web.app`
- **Authorization callback URL**: `https://studio-9489287013-59986.firebaseapp.com/__/auth/handler`

**⚠️ Aapko kya karna hai?**
GitHub page par "Generate a new client secret" dabayein aur usey Firebase Console mein GitHub provider ke andar paste kar dein.

### 3. Authorized Domain Fix
👉 **Link**: [Authorized Domains](https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings)
- **Action**: Apna current browser URL (jis par studio chal raha hai) wahan 'Add domain' mein dalein.

### 4. Code Ko GitHub Par Kaise Bhejein?
Terminal mein ye commands dalein:
```bash
git init
git remote add origin https://github.com/rishikaofficial2024/videomaster-ai.git
git add .
git commit -m "GitHub Auth Configured"
git push -u origin main
```
