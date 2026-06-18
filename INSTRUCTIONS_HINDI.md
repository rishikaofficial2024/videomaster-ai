
# 🗝️ VideoMaster AI: Keys Ka Sahi Setup

Aapke app mein do tarah ki keys use hoti hain. Inhe sahi jagah par hona zaroori hai:

### 1. Firebase API Key (Login & Database ke liye) ✅
- **Aapki Key**: `AIzaSyCz-pMZtY7_OVr9IyyHiIqwPWnpP3Lb21w`
- **Kahan Hai?**: `src/firebase/config.ts` file mein.
- **Kya Karti Hai?**: Ye app ko "Login" aur "Data Save" karne mein madad karti hai. 

### 2. Gemini API Key (AI Brain ke liye) 🧠
- **Kahan Se Milegi?**: [Google AI Studio](https://aistudio.google.com/app/apikey) par jayein.
- **Kahan Dalni Hai?**: App ke sabse bahar waale folder mein `.env` naam ki file hogi.
- **Sahi Format**: `GEMINI_API_KEY=AIzaSy...Aapki_Key_Yahan`

---

### ⚠️ IMPORTANT: Video Generation (Veo 2.0) Error Fix

Agar aapko "Billing Required" ya "400 Bad Request" error aa raha hai video generate karte waqt, toh iska matlab hai ki aapke Gemini API account mein **Google Cloud Billing** enable nahi hai.

**Kaise theek karein?**
1. [Google Cloud Console](https://console.cloud.google.com/billing) par jayein.
2. Apna project select karein (jo aapki API key se juda hai).
3. **"Link a Billing Account"** par click karein aur apna credit/debit card jodein.
4. **Note**: Google aksar naye accounts ko free credits deta hai, lekin card link karna zaroori hai **Veo 2.0** use karne ke liye.
5. **Workaround**: Agar aap billing nahi jorna chahte, toh aap **Script Writer** aur **Thumbnail Designer** use kar sakte hain, wo free tier par chalte hain.

---

### ⚠️ Sabse Badi Galti (Mix mat karein!)
- **Firebase Key**: Ye hamesha `src/firebase/config.ts` mein rahegi.
- **Gemini Key**: Ye hamesha `.env` file mein rahegi.

Ab aapka app "Brain" (AI) aur "Body" (Database) dono ke saath sahi se jud jayega!
