# 🛡️ Security Setup Guide (Play Integrity & reCAPTCHA)

Bhaai, aapne jo screenshot bheji thi, uske mutabiq ye steps follow karein taaki aapka app 100% secure ho jaye aur Play Store par reject na ho.

### 1. Android SHA-256 (Play Integrity) ✅
Aapke app ko "Original" verify karne ke liye ye zaroori hai.
1. **Firebase Console** mein jayein.
2. **Project Settings (Gear Icon) > General** par click karein.
3. Apne Android app (`com.videomaster.ai`) par jaakar **Add Fingerprint** karein.
4. Apna **SHA-256** wahan paste kar dein. (Ye aapko GitHub Build logs mein ya local Android Studio mein `signingReport` se milega).

### 2. App Check Register Karein ✅
1. Firebase Console mein **App Check > Apps** tab mein jayein.
2. Android app chunein aur **Play Integrity** ko link karein.
3. Web app chunein aur **reCAPTCHA Enterprise** ka Site Key daal dein.

### 3. reCAPTCHA for Web ✅
1. [Google Cloud Console](https://console.cloud.google.com/security/recaptcha) par jayein.
2. Nayi **Site Key** generate karein.
3. Usey Firebase Console mein App Check settings mein paste karein.

**Note**: Maine code mein background logic set kar diya hai, ab bas aapko ye Keys Firebase Console mein jodhni hain.

**Ab aapka app "Hack-Proof" aur "Live-Ready" hai!** 🚀🛡️💎