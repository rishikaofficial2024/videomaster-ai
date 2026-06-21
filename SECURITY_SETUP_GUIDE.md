
# 🛡️ Elite Security Guide: Fixing "Unverified Requests"

If your Firebase Console shows **100% Unverified Requests** in the App Check tab, follow these steps to secure your application.

### 1. What is App Check?
It is a security layer that ensures only your official app can talk to your database. It blocks hackers, bots, and unauthorized scripts from stealing your AI credits.

### 2. How to fix the "Unverified" status (3 Minutes):

1.  **Go to Google Cloud Console**: Create a [ReCaptcha V3](https://www.google.com/recaptcha/admin/create) project.
2.  **Add your Domains**: Add `videomaster-ai.tech` and `localhost` to the authorized domains list.
3.  **Get the Site Key**: Copy the **"Site Key"** provided by Google.
4.  **Update App Code**:
    *   Open `src/firebase/config.ts` in this studio.
    *   Paste the key into the `appCheckSiteKey` field.
5.  **Register in Firebase**:
    *   Go back to the screenshot page (App Check).
    *   Click **"Register"** next to your Web App.
    *   Select **reCAPTCHA V3** and paste the same Site Key there.
    *   Save changes.

### 3. Verification
Once you run `npm run mobile:push` and visit your app, refresh the Firebase Console. You will see the **"Verified Requests"** percentage start to climb. Once it reaches 90%+, you can click **"Enforce"** to permanently lock down your app from attackers.

**Your app is now protected by Elite-level Google Security.** 🚀🛡️📈
