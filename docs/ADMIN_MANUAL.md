
# 🛡️ VideoMaster AI: Master Admin Manual

Welcome to the command center of your AI empire. This guide explains how to manage your nodes, track revenue, and monitor system health.

### 1. How to Authorize Yourself as Admin
By default, no user is an admin for security reasons. To grant yourself access:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open **Firestore Database** > **users** collection.
3.  Find your `UID` document.
4.  Add a field: `isAdmin` (Boolean) = `true`.
5.  Refresh your app, and the "Master Admin Node" will appear in your Navbar.

### 2. Monitoring Your Empire 📊
You can monitor the app through two primary channels:
*   **App Internal Hub (/admin)**: Real-time user stats, manual credit injections, and system diagnostics.
*   **Firebase Console**: Deep-level logs, database usage, and authentication security audits.
*   **Live Monitoring (/admin/monitoring)**: Use this for technical checks on DNS, AdSense sync, and Neural Core connectivity.

### 3. Managing Creator Nodes
Inside the **Revenue Hub (/admin)**, you can:
*   **Inject Credits**: Instantly add +1000 credits to any user (useful for rewards or support).
*   **Authorize Pro**: Manually upgrade a user to the "Pro Studio" plan.
*   **Revoke Access**: Block unauthorized nodes by removing their Admin status.

### 4. Revenue & Ads Oversight
*   **AdSense**: Monitor actual daily revenue in the [AdSense Dashboard](https://adsense.google.com).
*   **Subscription Logs**: All manual upgrades are tracked in the `totalSpent` field in Firestore.
*   **Payouts**: Follow the instructions in `BANK_TRANSFER_GUIDE.md` to move funds to your bank.

### 5. Technical Self-Healing
If the "Live Monitoring" hub shows a "DNS Warning":
1.  Check your domain A-records in your registrar.
2.  Run `npm run web:deploy` in the Terminal to refresh the static hosting files.

**Your business node is stabilized and optimized for production scale!** 🚀💰💎
