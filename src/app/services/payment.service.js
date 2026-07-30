// Payment Service Managing Business Logic
const PaymentRepository = require("../repositories/payment.repository");
const ParcelService = require("./parcel.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { BadRequest } = require("../../core/errors/errors");

class PaymentService {
  // Create Payment Intent
  async createPaymentIntent(amount, parcelId) {
    if (!amount || amount <= 0) throw new BadRequest("Invalid Amount!");
    
    const finalAmount = amount < 100 ? 100 : amount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert To Paisa
      currency: "bdt",
      metadata: { parcelId },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  // Confirm Payment
  async confirmPayment(parcelId, transactionId, userEmail, amount, parcelName) {
    // Create Payment Record
    const payment = {
      parcelId,
      transactionId,
      userEmail,
      amount,
      parcelName,
      status: "completed",
    };

    await PaymentRepository.createPayment(payment);

    // Update Parcel Payment Status
    await ParcelService.markPaid(parcelId, transactionId);

    return { success: true };
  }

  // Get User Payments
  async getUserPayments(email) {
    return PaymentRepository.findByUserEmail(email);
  }

  // Create Checkout Session (Alternative To Payment Intent)
  async createCheckoutSession(
    parcelId,
    amount,
    userEmail,
    successUrl,
    cancelUrl,
  ) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Parcel Delivery",
              description: `Parcel ID: ${parcelId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { parcelId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { sessionId: session.id, url: session.url };
  }
}

module.exports = new PaymentService();
