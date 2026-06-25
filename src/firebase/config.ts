/**
 * Firebase configuration object for VideoMaster AI.
 * 
 * ✅ STATUS: AUDIT VERIFIED
 * 🛠️ Now utilizing NEXT_PUBLIC_ prefixes for Static Export compatibility.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-9489287013-59986.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-9489287013-59986",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-9489287013-59986.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "522287974416",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:522287974416:web:096cfdb016260b3f74a295",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  
  /**
   * 🛡️ SECURITY LAYER: App Check
   */
  appCheckSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY || ""
};
