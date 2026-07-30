// MongoDB Configuration And Connection Utilities
const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../utils/logger");
require("dotenv").config();

// Validate Environment Variables And Fail Fast If Missing
["DB_USER", "DB_PASS", "DB_NAME"].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing Required Environment Variable: ${key}!`);
  }
});

// MongoDB Connection Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@zapshift.uvn86kq.mongodb.net/?appName=ZaPShifT`;

// MongoClient Initialization And Configuration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

let dbInstance = null;

// Connect To MongoDB And Cache Database Instance
async function connectDB() {
  if (dbInstance) return dbInstance;

  try {
    await client.connect();
    dbInstance = client.db(process.env.DB_NAME);
    logger.info("MongoDb Connected!");
    return dbInstance;
  } catch (err) {
    logger.error({ err }, "MongoDb Connection Failed!");
    throw err;
  }
}

// Ensure Required Database Indexes Exist
async function ensureIndexes() {
  try {
    const db = await connectDB();

    // Users Collection Indexes
    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    // Parcels Collection Indexes
    const parcelsCollection = db.collection("parcels");
    await parcelsCollection.createIndex({ trackingId: 1 }, { unique: true });
    await parcelsCollection.createIndex({ senderEmail: 1 });
    await parcelsCollection.createIndex({ riderEmail: 1 });
    await parcelsCollection.createIndex({ deliveryStatus: 1 });
    await parcelsCollection.createIndex({ paymentStatus: 1 });

    // Riders Collection Indexes
    const ridersCollection = db.collection("riders");
    await ridersCollection.createIndex({ email: 1 }, { unique: true });
    await ridersCollection.createIndex({ status: 1 });

    // Payments Collection Indexes
    const paymentsCollection = db.collection("payments");
    await paymentsCollection.createIndex(
      { transactionId: 1 },
      { unique: true },
    );
    await paymentsCollection.createIndex({ userEmail: 1 });
    await paymentsCollection.createIndex({ parcelId: 1 });

    // Tracking Logs Collection Indexes
    const trackingCollection = db.collection("tracking_logs");
    await trackingCollection.createIndex({ trackingId: 1 });
    await trackingCollection.createIndex({ parcelId: 1 });

    logger.info("Database Indexes Ensured!");
  } catch (err) {
    logger.fatal({ err }, "Failed To Ensure Database Indexes!");
    throw err;
  }
}

// Get Database Collection By Name
async function getCollection(name) {
  const db = await connectDB();
  return db.collection(name);
}

module.exports = {
  connectDB,
  ensureIndexes,
  getCollection,
  client,
};
