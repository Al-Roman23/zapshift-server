// API Routes Definition For Riders
const express = require("express");
const router = express.Router();
const RiderController = require("../controllers/rider.controller");
const { verifyAuthToken } = require("../../middlewares/verifyAuthToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

// Authenticated Routes
router.post("/", verifyAuthToken, RiderController.createApplication);
router.get("/:email/status", verifyAuthToken, RiderController.getStatus);
router.patch(
  "/:email/toggle-status",
  verifyAuthToken,
  RiderController.toggleStatus,
);
router.get(
  "/:email/deliveries",
  verifyAuthToken,
  RiderController.getDeliveries,
);
router.get("/:email/completed", verifyAuthToken, RiderController.getCompleted);
router.get("/:email/earnings", verifyAuthToken, RiderController.getEarnings);

// Admin Routes
router.get(
  "/pending",
  verifyAuthToken,
  verifyAdmin,
  RiderController.getPending,
);
router.get(
  "/approved",
  verifyAuthToken,
  verifyAdmin,
  RiderController.getApproved,
);
router.get(
  "/available",
  verifyAuthToken,
  verifyAdmin,
  RiderController.getAvailable,
);
router.patch(
  "/:id/approve",
  verifyAuthToken,
  verifyAdmin,
  RiderController.approve,
);
router.patch(
  "/:id/reject",
  verifyAuthToken,
  verifyAdmin,
  RiderController.reject,
);
router.delete("/:id", verifyAuthToken, verifyAdmin, RiderController.delete);

module.exports = router;
