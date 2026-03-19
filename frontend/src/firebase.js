// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey:            "AIzaSyChtXN6kk7T3kmDlHqL1EW-ugpKSrd6khg",
  authDomain:        "revolve-software-75233.firebaseapp.com",
  projectId:         "revolve-software-75233",
  storageBucket:     "revolve-software-75233.firebasestorage.app",
  messagingSenderId: "501631467649",
  appId:             "1:501631467649:web:bccbbaad14d9d20e57cd80",
  measurementId:     "G-C5M9YT21W0",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();