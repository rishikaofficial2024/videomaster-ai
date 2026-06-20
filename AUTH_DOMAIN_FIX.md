
# 🔑 "unauthorized-domain" Error Kaise Fix Karein?

Agar aapko Google, Facebook ya Phone Login karte waqt **"unauthorized-domain"** ka error aa raha hai, toh iska matlab hai ki aapka current browser URL Firebase mein registered nahi hai.

### Fix Karne Ke Steps (Sirf 1 Minute):

1. **URL Copy Karein**: 
   - Apne browser ke address bar mein jo link dikh raha hai (e.g., `9002-xxxxx.cloudworkstations.dev`), usey copy kar lein.
   - Note: Sirf domain name copy karein (bin `https://` aur bina aage ke path ke).

2. **Firebase Console Par Jayein**:
   - [Firebase Console](https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings) kholein.

3. **Authorized Domains Section**:
   - Left sidebar mein **Settings** tab par click karein.
   - Phir **Authorized domains** par click karein.
   - **"Add domain"** button par click karein.

4. **Link Paste Karein**:
   - Apna copy kiya hua domain (e.g., `9002-xxxxx.cloudworkstations.dev`) wahan paste karein aur **Add** dabayein.

5. **App Refresh Karein**:
   - Ab apne app par wapas jayein aur page ko refresh karein. Login ab smoothly kaam karega!

---
**Zaroori Baat**: Jab aap apna app final live karenge (jaise `.in` domain par), toh usey bhi isi tarah add karna hoga.
