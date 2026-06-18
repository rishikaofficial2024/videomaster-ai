# 🗝️ VideoMaster AI: Keys Ka Sahi Setup

Agar aapka AI feature (Thumbnail, Script) kaam nahi kar raha, toh iska matlab hai ki aapne dono keys ko mix kar diya hai ya key galat format mein hai. Inhe theek karne ka sahi tarika ye hai:

### 1. Firebase API Key (Ye Sahi Hai ✅)
- **Kahan Hai?**: `src/firebase/config.ts` file mein.
- **Kya Karti Hai?**: Ye app ko "Login" aur "Data Save" karne mein madad karti hai. 
- **Zaroori**: Ise chhedne ki zaroorat nahi hai, ye maine pehle se set kar di hai.

### 2. Gemini API Key (Ise Aapko Set Karna Hai 🧠)
- **Kahan Se Milegi?**: [Google AI Studio](https://aistudio.google.com/app/apikey) par jayein.
- **Kahan Dalni Hai?**: App ke sabse bahar waale folder mein `.env` naam ki file hogi.
- **Sahi Format**: 
  `GEMINI_API_KEY=AIzaSy...Aapki_Key_Yahan`

---

### ⚠️ Sabse Badi Galti (Don't do this!)

**Kaise Pehchaane?**
- **Firebase Key**: `AIzaSyCz-pMZtY7...` (Ye `.env` mein nahi honi chahiye).
- **Gemini Key**: Sirf Google AI Studio se milti hai. Ye bhi `AIzaSy` se shuru hoti hai lekin characters alag hote hain.
- **Dhyan Dein**: Agar aapki key `AQ.` se shuru ho rahi hai toh wo shayad Google AI Studio ki standard key nahi hai. Ek baar dobara aistudio.google.com par jake "Get API Key" par click karein.

### Error Fix Karne Ka Tarika:
1. `.env` file ko kholein.
2. Purani key (jaise AQ... wali) ko hata dein.
3. Google AI Studio wali nayi `AIzaSy` se shuru hone wali key paste karein.
4. File ko **Save** karein aur app ko refresh karein.

Ab aapka app "Brain" (AI) aur "Body" (Database) dono ke saath sahi se jud jayega!
