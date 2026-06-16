
# 🛠️ VideoMaster AI - Problem Fix Guide

Aapke app mein "Invalid API Key" ka error aa raha hai kyunki aapko **do alag keys** chahiye:

### 1. Firebase Key (Jo aapne pehle daali)
- **Kahan jati hai**: `src/firebase/config.ts` mein.
- **Kya karti hai**: Login aur Database chalti hai.

### 2. Gemini AI Key (Jo abhi missing hai)
- **Kahan milti hai**: [aistudio.google.com](https://aistudio.google.com/app/apikey) par.
- **Kahan dalni hai**: Project ki `.env` file mein.
- **Kya karti hai**: AI Script, AI Thumbnail aur AI Video banati hai.

**Error Kaise Hatayein?**
Bas Gemini AI Studio se key lekar apni `.env` file mein `GEMINI_API_KEY=your_key` likh dein. Iske baad aapka app "Draft Viral Script" aur "Design Thumbnail" perfectly karne lagega.
