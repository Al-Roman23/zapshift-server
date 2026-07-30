// API Routes Definition For Parcel Tracking
const express = require("express");
const router = express.Router();
const TrackingController = require("../controllers/tracking.controller");

// Public Route For Tracking
router.get("/:trackingId/logs", TrackingController.getLogs);

module.exports = router;
