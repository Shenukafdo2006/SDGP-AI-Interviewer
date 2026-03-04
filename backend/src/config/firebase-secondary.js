
const admin = require("firebase-admin");
const path  = require("path");
require("dotenv").config();

// ─── Initialize Firebase Admin for Secondary Features ────────────────────────
// Uses serviceAccountKey.json - reserved for other features
// Hardcoded to avoid conflicts with other features using .env
// Create a named app instance to avoid conflicts with the interview app

let app2;
let db2;

const serviceAccount2 = require(
  path.resolve(__dirname, "../../serviceAccountKey.json")
);

app2 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccount2) },
  "secondary"  // Named app instance
);
db2 = app2.firestore();
console.log("✅ Secondary Firebase app initialized successfully");

module.exports = { 
  db2, 
  app2,
  admin
};
