
# 🚀 Final Launch: Your Manual Action Items

The code is 100% complete and professional. However, for security and ownership reasons, the following steps must be performed by you manually in your external accounts.

### 1. Terminal Execution (CRITICAL)
You must run these commands in the **Terminal** (Top-Left ≡ Menu > Terminal > New Terminal):
- **To fix "Site Not Found"**: `npm run web:deploy`
- **To build your Android App**: `npm run mobile:push`

### 2. Firebase Console Tasks 🛡️
Go to the [Firebase Console](https://console.firebase.google.com/project/studio-9489287013-59986/) and complete these:
- **Enable Auth**: Go to `Authentication > Sign-in method` and enable **Google** and **Email/Password**.
- **Authorize Domain**: Go to `Authentication > Settings > Authorized domains` and add `videomaster-ai.tech`.
- **App Check**: Generate a **reCAPTCHA v3 Site Key** [here](https://www.google.com/recaptcha/admin) and paste it into `src/firebase/config.ts`.

### 3. Domain & DNS Setup 🌐
To make your professional domain work:
1. Open **Hosting** in Firebase Console.
2. Click **Add Custom Domain** and enter `videomaster-ai.tech`.
3. Copy the **A Records** (IP Addresses).
4. Paste them into your domain registrar's (GoDaddy/Hostinger) DNS settings.

### 4. Monetization Handshake 💰
- **AdSense**: Ensure your domain is "Ready" in the [AdSense Dashboard](https://adsense.google.com).
- **Payments**: Create a payment page in **Razorpay** and update the link in `src/app/premium/page.tsx` when you are ready to accept real money.

**Your AI Studio is technically stabilized. Complete these steps to go global!** 🚀💎📈💸
