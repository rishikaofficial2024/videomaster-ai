/**
 * Firebase configuration object for VideoMaster AI.
 * 
 * ✅ STATUS: PRODUCTION STABILIZED
 * 🛠️ FIX: Using firebaseapp.com as primary authDomain to prevent NXDOMAIN login crashes during propagation.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCz-pMZtY7_OVr9IyyHiIqwPWnpP3Lb21w",
  authDomain: "studio-9489287013-59986.firebaseapp.com", 
  projectId: "studio-9489287013-59986",
  storageBucket: "studio-9489287013-59986.firebasestorage.app",
  messagingSenderId: "522287974416",
  appId: "1:522287974416:web:096cfdb016260b3f74a295",
  
  /**
   * 🛡️ SECURITY LAYER: App Check
   * ReCAPTCHA v3 site key for bot protection.
   */
  appCheckSiteKey: "" 
};
