// Repository For Tracking Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class TrackingRepository {
  // Create Tracking Log
  async createLog(log) {
    const trackingCollection = await getCollection("tracking_logs");
    return trackingCollection.insertOne({
      ...log,
      parcelId: new ObjectId(log.parcelId),
      createdAt: new Date(),
    });
  }

  // Get Logs By Tracking ID
  async findByTrackingId(trackingId) {
    const trackingCollection = await getCollection("tracking_logs");
    return trackingCollection
      .find({ trackingId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Logs By Parcel ID
  async findByParcelId(parcelId) {
    const trackingCollection = await getCollection("tracking_logs");
    return trackingCollection
      .find({ parcelId: new ObjectId(parcelId) })
      .sort({ createdAt: -1 })
      .toArray();
  }
}

module.exports = new TrackingRepository();
