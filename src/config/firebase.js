// Import Required Packages
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

let serviceAccount;

const serviceAccountKey = process.env.FIREBASE_SERVICE_KEY;

// Determine Service Account Source
if (serviceAccountKey) {
  try {
    let serviceAccountData = serviceAccountKey.trim();

    if (!serviceAccountData.startsWith("{")) {
       serviceAccountData = Buffer.from(serviceAccountData, "base64").toString("utf-8");
    }

    serviceAccount = JSON.parse(serviceAccountData);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var!", err);
  }
} else {
  try {
    serviceAccount = require(path.join(__dirname, "../../zapshiftcourier-firebase-adminsdk.json"));
  } catch (err) {
    console.warn("Firebase Service Account File Not Found Locally!");
  }
}

// Initialize Firebase Admin Only Once
if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Initialized Admin
module.exports = admin;
