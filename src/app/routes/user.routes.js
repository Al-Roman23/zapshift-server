// API Routes Definition For Users
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyAuthToken } = require("../../middlewares/verifyAuthToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

// Public Routes
router.get("/:email/role", UserController.getRole);

// Authenticated Routes
router.post("/", verifyAuthToken, UserController.createUser);
router.get("/check", verifyAuthToken, UserController.checkStatus);
router.patch("/profile", verifyAuthToken, UserController.updateProfile);

// Admin Routes
router.get("/", verifyAuthToken, verifyAdmin, UserController.getAllUsers);
router.patch(
  "/:id/toggle-status",
  verifyAuthToken,
  verifyAdmin,
  UserController.toggleStatus,
);
router.patch(
  "/:id/role",
  verifyAuthToken,
  verifyAdmin,
  UserController.changeRole,
);

module.exports = router;
