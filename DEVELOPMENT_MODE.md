# 🛠️ VideoMaster AI: Development Mode Documentation

This app is currently configured in **Development Mode** to facilitate smooth testing of all features.

### ✅ Temporary Security Relaxations:
1. **Firestore Rules**: Authenticated users can update their own profile fields (like `credits`) without strict key-diffing. This allows testing the "Watch & Earn" logic.
2. **Middleware**: Neutralized in `src/middleware.ts` to allow `next export` for Android APK builds.
3. **Auth Domain**: Set to `*.firebaseapp.com` in `config.ts` to bypass DNS propagation delays for the branded domain.

### 🚨 Reversion Checklist (Before Production Release):
- [ ] Re-enable strict `affectedKeys().hasAny(['isAdmin', 'subscriptionPlan'])` check in `firestore.rules`.
- [ ] Switch `authDomain` in `src/firebase/config.ts` to `videomaster-ai.tech` once DNS is verified.
- [ ] Implement Server-Side logic for credit updates if high-value transactions are involved.

### 💻 Maintenance Commands:
- **Web Deploy**: `npm run web:deploy` (Requires `.firebaserc`)
- **Mobile Push**: `npm run mobile:push` (Syncs with GitHub factory)

**Status: SYSTEM IS STABILIZED FOR FULL FEATURE TESTING.** 🚀🌪️💎