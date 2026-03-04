
const admin = require("firebase-admin");
const path  = require("path");
require("dotenv").config();

// ─── Initialize Firebase Admin for Interview Feature ──────────────────────────
// Uses serviceAccountKey2.json - isolated for interview/achievements feature
// Hardcoded to avoid conflicts with other features using .env
let app;

const serviceAccount = require(
  path.resolve(__dirname, "../../serviceAccountKey2.json")
);
app = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccount) },
  "interview"  // Named app instance
);

const db = admin.firestore();


// ─── Default data shape ───────────────────────────────────────────────────────
const DEFAULT_STATS = [
  { icon: "🏆", label: "Achievements", value: 0 },
  { icon: "🔥", label: "Day Streak",   value: 0 },
  { icon: "⚡",  label: "Level",       value: 0 },
];

const DEFAULT_XP = {
  level:   0,
  current: 0,
  total:   1000,
  title:   "Career Achiever",
  icon:    "⚡",
};

const DEFAULT_ACHIEVEMENTS = [
  { name: "First Interview",  desc: "Completed your first mock interview", color: "#c084fc", icon: "🎤", xp: 50,  unlocked: false },
  { name: "Quiz Master",      desc: "Scored 100% on 5 quizzes",           color: "#fbbf24", icon: "🏆", xp: 70,  unlocked: false },
  { name: "Week Warrior",     desc: "Maintained a 7-day learning streak",  color: "#f87171", icon: "🔥", xp: 60,  unlocked: false },
  { name: "CV Creator",       desc: "Created and downloaded your CV",      color: "#a78bfa", icon: "📄", xp: 40,  unlocked: false },
  { name: "Knowledge Seeker", desc: "Read 20 learning resources",          color: "#60a5fa", icon: "📚", xp: 80,  unlocked: false },
  { name: "Perfect Score",    desc: "Get 90%+ on 10 interviews",           color: "#34d399", icon: "⭐", xp: 90,  unlocked: false },
];

// ─── Auto-create the "users" collection with a placeholder doc ────────────────
// Firestore doesn't persist empty collections, so we write a _meta sentinel doc.
async function initCollections() {
  const metaRef = db.collection("users").doc("_meta");
  const snap    = await metaRef.get();

  if (!snap.exists) {
    await metaRef.set({
      createdAt:   admin.firestore.FieldValue.serverTimestamp(),
      description: "Achievements users collection — auto-created by server",
    });
    console.log("✅ Firestore 'users' collection created with _meta sentinel.");
  } else {
    console.log("✅ Firestore 'users' collection already exists.");
  }
}

// ─── Get or create a user doc ─────────────────────────────────────────────────
async function getOrCreateUser(userId) {
  const ref  = db.collection("users").doc(userId);
  const snap = await ref.get();

  if (snap.exists) {
    return { ref, data: snap.data() };
  }

  // Brand-new user → write default data
  const defaultData = {
    stats:        DEFAULT_STATS,
    xp:           DEFAULT_XP,
    achievements: DEFAULT_ACHIEVEMENTS,
    createdAt:    admin.firestore.FieldValue.serverTimestamp(),
    updatedAt:    admin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(defaultData);
  console.log(`✅ Created new user doc for: ${userId}`);
  return { ref, data: defaultData };
}

module.exports = { 
  db, 
  admin, 
  app,
  initCollections, 
  getOrCreateUser 
};
