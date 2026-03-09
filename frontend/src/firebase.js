<<<<<<< Updated upstream
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyChtXN6kk7T3kmDlHqL1EW-ugpKSrd6khg",
  authDomain:        "revolve-software-75233.firebaseapp.com",
  projectId:         "revolve-software-75233",
  storageBucket:     "revolve-software-75233.firebasestorage.app",
  messagingSenderId: "501631467649",
  appId:             "1:501631467649:web:bccbbaad14d9d20e57cd80",
  measurementId:     "G-C5M9YT21W0",
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
=======
// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services we need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuWIEaozkTnGT2bUu_g4SbowXQOg5I16M",
  authDomain: "revolve-software-241af.firebaseapp.com",
  projectId: "revolve-software-241af",
  storageBucket: "revolve-software-241af.firebasestorage.app",
  messagingSenderId: "85485290642",
  appId: "1:85485290642:web:8e74ea9f79b38cbcbd124b",
  measurementId: "G-8FVLJBK8NB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
>>>>>>> Stashed changes
