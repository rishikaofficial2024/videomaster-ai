
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKey",
  authDomain: "videomaster-ai.firebaseapp.com",
  projectId: "videomaster-ai",
  storageBucket: "videomaster-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:dummy"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
