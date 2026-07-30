// API Routes Definition For Payments
const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment.controller");
const { verifyAuthToken } = require("../../middlewares/verifyAuthToken");

// Authenticated Routes
router.post("/create-intent", verifyAuthToken, PaymentController.createIntent);
router.post("/confirm", verifyAuthToken, PaymentController.confirmPayment);
router.post("/checkout", verifyAuthToken, PaymentController.createCheckout);
router.get("/user/:email", verifyAuthToken, PaymentController.getUserPayments);

module.exports = router;
