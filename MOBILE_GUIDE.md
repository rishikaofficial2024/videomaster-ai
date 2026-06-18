
# 📱 APK Kaise Banayein (Bina Laptop/PC ke)

Aapne pucha ki bina PC ke APK kaise banayein, toh uska sabse aasan tarika **GitHub Actions** ka use karna hai. Maine code mein settings kar di hain.

### Steps to get your APK:

1. **GitHub par Account Banayein**: Agar nahi hai, toh github.com par account banayein.
2. **Code Upload Karein**: Is project ko apne GitHub repository mein "Push" ya upload karein.
3. **Actions Tab mein Jayein**:
   - Apne GitHub repo mein upar **'Actions'** likha dikhega, us par click karein.
   - Wahan **'Build Android APK'** naam ka ek kaam (workflow) apne aap shuru ho jayega.
4. **Download Karein**:
   - Jab build khatam ho jaye (lagbhag 5-7 minute), toh us par click karein.
   - Sabse niche **'Artifacts'** section mein aapko `VideoMaster-AI-Debug-APK` milega.
   - Use download karke apne phone mein install kar lein!

**Note**: Maine `.github/workflows/android-build.yml` file add kar di hai jo ye saara kaam cloud par free mein karegi.
