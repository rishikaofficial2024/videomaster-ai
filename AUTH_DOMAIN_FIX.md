
# 🔑 "unauthorized-domain" Error Kaise Fix Karein?

Agar aapko Google ya Facebook Login karte waqt **"unauthorized-domain"** ka error aa raha hai, toh iska matlab hai ki aapka current browser URL Firebase mein registered nahi hai.

### Fix Karne Ke Steps (Sirf 1 Minute):

1. **URL Copy Karein**: 
   - Apne browser ke address bar mein jo link dikh raha hai (e.g., `9002-xxxxx.cloudworkstations.dev`), usey copy kar lein.

2. **Firebase Console Par Jayein**:
   - [Firebase Console](https://console.firebase.google.com/) kholein aur apna project select karein.

3. **Settings Mein Jayein**:
   - Left menu mein **Build > Authentication** par click karein.
   - Upar tabs mein **Settings** par click karein.

4. **Authorized Domains Section**:
   - Left sidebar mein **Authorized domains** par click karein.
   - **"Add domain"** button par click karein.

5. **Link Paste Karein**:
   - Apna copy kiya hua domain (`9002-xxxxx.cloudworkstations.dev`) wahan paste karein aur **Add** dabayein.

6. **App Refresh Karein**:
   - Ab apne app par wapas jayein aur page ko refresh karein. Login ab smoothly kaam karega!

---
**Note**: Jab aap apna app final live karenge (.in domain par), toh usey bhi isi tarah add karna hoga.
