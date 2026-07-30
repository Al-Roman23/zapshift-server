// Tracking Controller Managing Requests And Responses
const TrackingService = require("../services/tracking.service");
const { BadRequest } = require("../../core/errors/errors");

class TrackingController {
  // Get Logs By Tracking ID
  async getLogs(req, res, next) {
    try {
      const { trackingId } = req.params;
      if (!trackingId) throw new BadRequest("Tracking ID Required!");

      const logs = await TrackingService.getLogsByTrackingId(trackingId);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrackingController();
