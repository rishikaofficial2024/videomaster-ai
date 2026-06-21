
# 🛡️ Elite Security Guide: reCAPTCHA & App Check

Your screenshot shows the **reCAPTCHA Secret Key** field. This is the final step to secure your AI credits and database.

### 1. What is the benefit?
*   **Bot Protection**: Prevents automated scripts from wasting your Gemini AI credits.
*   **Database Lockdown**: Only your verified app can access your Firestore data.
*   **Hacker Defense**: Blocks 99% of unauthorized requests from external sources.

### 2. How to get the keys (3 Minutes):

1.  **Open reCAPTCHA Admin**: [Click here to create a project](https://www.google.com/recaptcha/admin/create).
2.  **Configure**:
    *   **Label**: `VideoMaster AI Security`
    *   **reCAPTCHA type**: Select **reCAPTCHA v3**.
    *   **Domains**: Add `videomaster-ai.tech` and `localhost`.
3.  **Get Keys**: Click Submit. Google will give you a **Site Key** and a **Secret Key**.

### 3. Where to put them:

*   **In Firebase Console (Your Screenshot)**: 
    *   Paste the **Secret Key** into the box labeled "reCAPTCHA secret key".
    *   Click **Save**.
    *   Then click the **"Enforce"** button to turn on protection.

*   **In this Studio (Code)**:
    *   Open `src/firebase/config.ts`.
    *   Paste the **Site Key** into the `appCheckSiteKey` field.
    *   Run `npm run mobile:push` in the Terminal.

### 4. Verification
Once both keys are in place and you deploy the code, visit your website. Then check your Firebase Console after 1 hour—you will see the "Unverified" bars turn into **Verified** (Green) requests! 🚀🛡️📈
