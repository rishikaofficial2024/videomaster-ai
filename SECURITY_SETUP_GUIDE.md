
# 🛡️ Elite Security Guide: reCAPTCHA & App Check

In your screenshot, the blue banner **"Protect your Authentication resources"** is the most important security step.

### 1. What is the benefit?
- **Bot Protection**: Prevents automated scripts from wasting your Gemini AI credits.
- **Database Lockdown**: Only your verified app can access your Firestore data.
- **Hacker Defense**: Blocks 99% of unauthorized requests from external sources.

### 2. How to get the keys (3 Minutes):
1. Open [reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create).
2. **Label**: `VideoMaster AI Security`
3. **reCAPTCHA type**: Select **reCAPTCHA v3**.
4. **Domains**: Add `videomaster-ai.tech` and `localhost`.
5. Click **Submit**. Google will give you a **Site Key** and a **Secret Key**.

### 3. Where to put them:
- **In Firebase Console**: Click the "Configure App Check" banner from your screenshot. Paste the **Secret Key** there and click **Enforce**.
- **In this Studio (Code)**: Open `src/firebase/config.ts` and paste the **Site Key** into the `appCheckSiteKey` field.

### 4. Final Deploy
Run `npm run mobile:push` in the Terminal to sync the security key with your app. Your studio is now protected by Google's elite security algorithms! 🚀🛡️📈