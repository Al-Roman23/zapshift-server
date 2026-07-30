// Payment Controller Managing Requests And Responses
const PaymentService = require("../services/payment.service");
const { BadRequest } = require("../../core/errors/errors");

class PaymentController {
  // Create Payment Intent
  async createIntent(req, res, next) {
    try {
      const { amount, parcelId } = req.body;

      if (!amount || !parcelId)
        throw new BadRequest("Amount And Parcel ID Required!");

      const result = await PaymentService.createPaymentIntent(amount, parcelId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Confirm Payment
  async confirmPayment(req, res, next) {
    try {
      const { parcelId, transactionId, amount, parcelName } = req.body;
      const userEmail = req.user?.email;

      if (!parcelId || !transactionId) {
        throw new BadRequest("Parcel ID And Transaction ID Required!");
      }

      const result = await PaymentService.confirmPayment(
        parcelId,
        transactionId,
        userEmail,
        amount,
        parcelName,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get User Payments
  async getUserPayments(req, res, next) {
    try {
      const { email } = req.params;
      const payments = await PaymentService.getUserPayments(email);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  // Create Checkout Session
  async createCheckout(req, res, next) {
    try {
      const { parcelId, amount, successUrl, cancelUrl } = req.body;
      const userEmail = req.user?.email;

      if (!parcelId || !amount)
        throw new BadRequest("Parcel ID And Amount Required!");

      const result = await PaymentService.createCheckoutSession(
        parcelId,
        amount,
        userEmail,
        successUrl || `${process.env.CLIENT_URL}/dashboard/payment-success`,
        cancelUrl || `${process.env.CLIENT_URL}/dashboard/payment-cancel`,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
