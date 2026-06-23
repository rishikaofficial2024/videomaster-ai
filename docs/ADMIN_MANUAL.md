
# 🛡️ VideoMaster AI: Master Admin Manual

Welcome to the command center of your AI empire. This guide explains how to manage your nodes and track revenue.

### 1. How to Authorize Yourself as Admin
By default, no user is an admin for security reasons. To grant yourself access:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open **Firestore Database** > **users** collection.
3.  Find your `UID` document.
4.  Add a field: `isAdmin` (Boolean) = `true`.
5.  Refresh your app, and the "Master Admin Node" will appear in your Navbar.

### 2. Managing Creator Nodes
Inside the **Revenue Hub (/admin)**, you can:
*   **Inject Credits**: Instantly add +1000 credits to any user (useful for rewards or support).
*   **Authorize Pro**: Manually upgrade a user to the "Pro Studio" plan.
*   **Revoke Access**: Block unauthorized nodes by removing their Admin status.

### 3. Revenue Logic
*   **Direct Sales**: Calculated from the `totalSpent` field in user documents.
*   **Ad Revenue**: Estimated based on average industry CPM (15% of total engagement value).
*   **Payouts**: Follow the instructions in `BANK_TRANSFER_GUIDE.md` to move funds to your bank.

### 4. Future Checklist
*   [ ] **reCAPTCHA**: Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/admin) and add to `src/firebase/config.ts`.
*   [ ] **Razorpay**: Replace simulation buttons in `src/app/premium/page.tsx` with your live Payment Links.
*   [ ] **SEO**: Verify domain ownership in Google Search Console using the tag in `src/app/layout.tsx`.

**Your business node is stabilized and ready for scale!** 🚀💰💎
