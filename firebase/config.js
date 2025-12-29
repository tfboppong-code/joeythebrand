import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBngDqe0m7M2n1Loa26gslVDkDtEegz8FI",
  authDomain: "joey-ecommerce.firebaseapp.com",
  projectId: "joey-ecommerce",
  storageBucket: "joey-ecommerce.firebasestorage.app",
  messagingSenderId: "828130041038",
  appId: "1:828130041038:web:5ddf513b4515c429ad449f",
  measurementId: "G-GP81WJ5XQ3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Add this line for Google login
export const googleProvider = new GoogleAuthProvider();
