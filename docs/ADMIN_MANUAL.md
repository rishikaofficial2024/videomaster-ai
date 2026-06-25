# 🛡️ VideoMaster AI: Enterprise Admin & Agency Manual

Welcome to the command center of your SaaS empire. This guide explains how to manage agency nodes, track enterprise revenue, and monitor global system health.

### 1. How to Authorize Agency Clearance
Agency plans allow users to manage team seats. To manually upgrade a client:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open **Firestore Database** > **users** collection.
3.  Find the `UID` document.
4.  Update field: `subscriptionPlan` = `business` or `agency`.
5.  Add field: `maxTeamSeats` (Number) = `5`.

### 2. Global Monitoring 📊
*   **Revenue Node (/admin)**: Real-time user stats, manual credit injections, and sub-management.
*   **Integration Matrix (/admin/monitoring)**: Technical checks on DNS, AdSense sync, and Neural Core connectivity.
*   **AdSense Identity**: Ensure `videomaster-ai.tech/app-ads.txt` remains live for crawler verification.

### 3. Cost Optimization Protocols
To maintain profitability at 100k+ users:
*   **CDN Purging**: Only run `npm run web:deploy` when major UI changes occur to maximize browser cache hits.
*   **Database Writes**: Users are rate-limited to 1 save per 30 seconds to minimize Firestore write costs.

### 4. Expansion Protocols
*   **Localizing Nodes**: When a new region is targeted (e.g., Brazil), update the `localization-config.json` and sync the setting hub.
*   **Support SLA**: Pro users get 24-hour support; Enterprise/Elite users get 4-hour "Fast Lane" support.

**Your SaaS business node is optimized for enterprise scaling.** 🚀💰💎