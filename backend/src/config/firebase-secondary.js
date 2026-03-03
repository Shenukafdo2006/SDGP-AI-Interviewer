
const admin = require("firebase-admin");
const path  = require("path");
require("dotenv").config();

// ─── Initialize Firebase Admin for Secondary Features ────────────────────────
// Uses serviceAccountKey.json - reserved for other features
// Create a named app instance to avoid conflicts with the interview app

let app2;
let db2;

try {
  const serviceAccount2Path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH_2 || "../serviceAccountKey.json";
  const fullPath = path.resolve(serviceAccount2Path);
  const serviceAccount2 = require(fullPath);
  
  app2 = admin.initializeApp(
    { credential: admin.credential.cert(serviceAccount2) },
    "secondary"  // Named app instance
  );
  db2 = app2.firestore();
  console.log("✅ Secondary Firebase app initialized successfully");
} catch (error) {
  console.error("❌ Secondary Firebase app initialization failed:", error.message);
  throw new Error("Secondary Firebase app required but not initialized - check serviceAccountKey.json");
}

module.exports = { 
  db2, 
  app2,
  admin
};
