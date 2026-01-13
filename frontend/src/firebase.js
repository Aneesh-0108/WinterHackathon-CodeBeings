import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhl0qkl5O49LYvXyMT2yRXw_Bte_Lm6zE",
  authDomain: "winterhackathon-codebeings.firebaseapp.com",
  projectId: "winterhackathon-codebeings",
  storageBucket: "winterhackathon-codebeings.firebasestorage.app",
  messagingSenderId: "886251648351",
  appId: "1:886251648351:web:a7d09c6f8a1b0663a432ea",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
