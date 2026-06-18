# 🗝️ VideoMaster AI: Keys Ka Sahi Setup

Aapke app mein do tarah ki keys use hoti hain. Inhe sahi jagah par hona zaroori hai:

### 1. Firebase API Key (Login & Database ke liye) ✅
- **Aapki Key**: `AIzaSyCz-pMZtY7_OVr9IyyHiIqwPWnpP3Lb21w`
- **Kahan Hai?**: `src/firebase/config.ts` file mein.
- **Kya Karti Hai?**: Ye app ko "Login" aur "Data Save" karne mein madad karti hai. 
- **Zaroori**: Maine ise pehle hi set kar diya hai. Ise chhedne ki zaroorat nahi hai.

### 2. Gemini API Key (AI Brain ke liye) 🧠
- **Kahan Se Milegi?**: [Google AI Studio](https://aistudio.google.com/app/apikey) par jayein.
- **Kahan Dalni Hai?**: App ke sabse bahar waale folder mein `.env` naam ki file hogi.
- **Sahi Format**: 
  `GEMINI_API_KEY=AIzaSy...Aapki_Key_Yahan`

---

### ⚠️ Sabse Badi Galti (Mix mat karein!)

- **Firebase Key**: Ye hamesha `src/firebase/config.ts` mein rahegi.
- **Gemini Key**: Ye hamesha `.env` file mein rahegi.

**Kaise theek karein?**
Agar AI kaam nahi kar raha, toh `.env` file kholein aur check karein ki wahan Gemini wali asali key hai ya nahi. Agar aapne Firebase wali key `.env` mein daal di hai, toh usey hata kar sahi Gemini key dalein.

Ab aapka app "Brain" (AI) aur "Body" (Database) dono ke saath sahi se jud jayega!
