
# 📱 GitHub Se APK Kaise Banayein? (Step-by-Step Guide)

Aapka app mobile par chalne ke liye bilkul taiyar hai. Maine GitHub Actions ka automated system set kar diya hai. APK download karne ke liye ye steps follow karein:

### Step 1: Code Ko GitHub Par Dalein
1. Apne code ko GitHub repository mein **Push** karein.
2. Maine `.github/workflows/android-build.yml` file pehle se bana di hai, jo ye sab handle karegi.

### Step 2: GitHub Actions Tab Par Jayein
1. Apne GitHub repository mein upar diye gaye **"Actions"** tab par click karein.
2. Wahan aapko **"Build Android APK (Cloud Build)"** naam ka workflow dikhega.

### Step 3: Build Shuru Karein
- Ye build har baar jab aap code push karenge, tab **automatic** shuru ho jayega.
- Aap ise manually bhi chala sakte hain: **Actions > Build Android APK > Run workflow**.

### Step 4: APK Download Karein
1. Jab build pura ho jaye (green check mark ✅), toh usi build par click karein.
2. Niche **"Artifacts"** section mein aapko `VideoMaster-AI-Debug-APK` dikhega.
3. Uspar click karke file download karein aur apne phone mein install karein!

### ⚠️ Zaroori Settings
- **Icon**: Maine icons stabilize kar diye hain taaki build error na aaye.
- **Production URL**: Jab aapka domain live ho jaye, toh usey `capacitor.config.ts` mein update kar dena.

**Aapka mobile app ab sirf ek click ki duri par hai!** 🚀📲
