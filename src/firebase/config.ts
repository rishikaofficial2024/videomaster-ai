
/**
 * Firebase configuration object for VideoMaster AI.
 * 
 * ✅ STATUS: Default authDomain used to ensure login stability 
 * during custom domain DNS propagation.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCz-pMZtY7_OVr9IyyHiIqwPWnpP3Lb21w",
  authDomain: "studio-9489287013-59986.firebaseapp.com", // Stable fallback for login
  projectId: "studio-9489287013-59986",
  storageBucket: "studio-9489287013-59986.firebasestorage.app",
  messagingSenderId: "522287974416",
  appId: "1:522287974416:web:096cfdb016260b3f74a295",
  
  /**
   * 🛡️ ACTION REQUIRED:
   * Generate a reCAPTCHA v3 "SITE KEY" from https://www.google.com/recaptcha/admin
   * and paste it below to enable App Check security.
   */
  appCheckSiteKey: "" 
};
