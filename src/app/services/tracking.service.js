// Tracking Service Managing Business Logic
const TrackingRepository = require("../repositories/tracking.repository");
const { NotFound } = require("../../core/errors/errors");

class TrackingService {
  // Create Tracking Log
  async createLog(log) {
    return TrackingRepository.createLog(log);
  }

  // Get Logs By Tracking ID
  async getLogsByTrackingId(trackingId) {
    const logs = await TrackingRepository.findByTrackingId(trackingId);
    if (!logs || logs.length === 0) {
      throw new NotFound("No Tracking Logs Found!");
    }
    return logs;
  }

  // Get Logs By Parcel ID
  async getLogsByParcelId(parcelId) {
    return TrackingRepository.findByParcelId(parcelId);
  }
}

module.exports = new TrackingService();
