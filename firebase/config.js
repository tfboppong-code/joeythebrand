import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBngDqe0m7M2n1Loa26gslVDkDtEegz8FI",
  authDomain: "joey-ecommerce.firebaseapp.com",
  projectId: "joey-ecommerce",
  storageBucket: "joey-ecommerce.firebasestorage.app",
  messagingSenderId: "828130041038",
  appId: "1:828130041038:web:5ddf513b4515c429ad449f",
  measurementId: "G-GP81WJ5XQ3",
};

// ✅ Prevent multiple Firebase instances
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ AUTH
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ FIRESTORE (THIS WAS MISSING)
export const db = getFirestore(app);
