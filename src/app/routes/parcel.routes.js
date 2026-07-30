// API Routes Definition For Parcels
const express = require("express");
const router = express.Router();
const ParcelController = require("../controllers/parcel.controller");
const { verifyAuthToken } = require("../../middlewares/verifyAuthToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

// Authenticated Routes
router.post("/", verifyAuthToken, ParcelController.createParcel);
router.get("/paid", verifyAuthToken, ParcelController.getPaidParcels);
router.get("/user/:email", verifyAuthToken, ParcelController.getUserParcels);

// Admin Routes
router.get(
  "/stats",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getStats,
);
router.get(
  "/unassigned",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getUnassignedParcels,
);
router.get(
  "/unpaid",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getUnpaidParcels,
);
router.get(
  "/all",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getAllParcels,
);
router.get(
  "/delivered",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getAllDeliveredParcels,
);
router.get(
  "/rejected",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.getRejectedParcels,
);

// Dynamic ID Routes
router.get("/:id", verifyAuthToken, ParcelController.getParcel);
router.patch("/:id/cancel", verifyAuthToken, ParcelController.cancelParcel);
router.patch("/:id/status", verifyAuthToken, ParcelController.updateStatus);
router.patch("/:id/pay", verifyAuthToken, ParcelController.markPaid);
router.patch("/:id/accept", verifyAuthToken, ParcelController.acceptParcel);
router.patch("/:id/reject", verifyAuthToken, ParcelController.rejectParcel);
router.patch(
  "/:id/assign",
  verifyAuthToken,
  verifyAdmin,
  ParcelController.assignRider,
);

module.exports = router;
