
# 🛠️ .env File Setup Guide (Sabse Aasan Tarika)

Agar aapko AI tools use karte waqt error aa raha hai, toh uska matlab hai ki `.env` file mein key sahi se nahi judi hai.

### .env File Kahan Hai?
1. Apne code editor (VS Code ya Studio) ke **Left Sidebar** mein dekhein.
2. Files ki list mein sabse niche `.env` naam ki ek file hogi.
3. Us par click karke usey kholein.

### Key Kaise Dalein? (Sahi Tarika)
1. `.env` file mein jo pehle se likha hai usey hata dein.
2. Sirf ye line likhein:
   `GEMINI_API_KEY=Aapki_Key_Yahan`
3. Yaad rahe: `GEMINI_API_KEY` ke baad koi space nahi hona chahiye aur `=` ke baad turant aapki key shuru honi chahiye.

**Udaaharan (Example):**
`GEMINI_API_KEY=AIzaSyB_123456789...`

### Error Fix Kaise Karein?
1. Agar aapne key `src/firebase/config.ts` mein paste kar di hai, toh usey wahan se hata dein.
2. Gemini Key sirf `.env` file ke liye hai.
3. File ko **Save** (Ctrl+S) karna na bholein.

Iske baad app ko refresh karein, saare AI features (Script, Thumbnail, Video) turant kaam karne lagenge!
