# Service Account 2 Setup Guide

## Overview
A secondary Firebase service account has been configured alongside the primary one. This allows you to isolate different features of your application using separate Firebase credentials, preventing potential conflicts.

## Files Created/Modified

### 1. **serviceAccountKey2.json** (NEW)
- **Location:** `/backend/serviceAccountKey2.json`
- **Purpose:** Credentials for the secondary Firebase service account
- **Status:** Template file - needs to be filled with actual credentials

### 2. **firebase.js** (UPDATED)
- **What changed:** 
  - Added secondary Firebase app initialization (`app2`, `db2`)
  - Uses a named app instance (`"secondary"`) to avoid conflicts
  - Gracefully handles missing serviceAccountKey2.json with a warning
- **What's exported:**
  ```javascript
  {
    // Primary Firebase (original)
    db, admin, app,
    
    // Secondary Firebase (new)
    db2, app2,
    
    // Utilities
    initCollections, getOrCreateUser
  }
  ```

### 3. **.env** (UPDATED)
- Added: `FIREBASE_SERVICE_ACCOUNT_PATH_2=../serviceAccountKey2.json`

### 4. **.env.example** (UPDATED)
- Added example configuration for the secondary service account

## How to Fill in serviceAccountKey2.json

1. **Go to your Firebase Console**: https://console.firebase.google.com/
2. **Select your project** → Project Settings → Service Accounts
3. **Create a new service account** (or use an existing one you want for this feature)
4. **Generate a new private key** (JSON format)
5. **Copy the entire JSON content** into `serviceAccountKey2.json`

## How to Use in Your Code

### Import both service accounts:
```javascript
const { db, db2, app, app2 } = require('./config/firebase');

// Use primary Firebase
const primaryUsers = db.collection('users');

// Use secondary Firebase for the new feature
const secondaryData = db2.collection('your-collection-name');
```

### Example - Using different databases for different features:
```javascript
// Feature 1: User Achievements (uses primary DB)
async function saveAchievement(userId, achievement) {
  return db.collection('users').doc(userId).update({
    achievements: admin.firestore.FieldValue.arrayUnion(achievement)
  });
}

// Feature 2: Interview Analytics (uses secondary DB)
async function logInterviewSession(sessionData) {
  return db2.collection('interview_sessions').add({
    ...sessionData,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
}
```

## Safety Features

✅ **No Conflicts:** Secondary app uses named instance (`"secondary"`) so it won't interfere with the primary app
✅ **Optional:** If serviceAccountKey2.json is missing or invalid, the app logs a warning but continues running
✅ **Separate Credentials:** Uses different Firebase credentials, so permissions can be controlled independently
✅ **Both Available:** Both `db` and `db2` are always available to use

## Next Steps

1. Create or obtain a second service account from Firebase Console
2. Copy the JSON key to `backend/serviceAccountKey2.json`
3. Update code to use `db2` where needed for your new feature
4. Test that both databases work independently
