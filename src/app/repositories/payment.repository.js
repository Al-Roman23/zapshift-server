// Repository For Payment Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class PaymentRepository {
  // Create Payment Record
  async createPayment(payment) {
    const paymentsCollection = await getCollection("payments");
    return paymentsCollection.insertOne({
      ...payment,
      parcelId: new ObjectId(payment.parcelId),
      createdAt: new Date(),
    });
  }

  // Find Payment By ID
  async findById(id) {
    const paymentsCollection = await getCollection("payments");
    return paymentsCollection.findOne({ _id: new ObjectId(id) });
  }

  // Find Payment By Transaction ID
  async findByTransactionId(transactionId) {
    const paymentsCollection = await getCollection("payments");
    return paymentsCollection.findOne({ transactionId });
  }

  // Get User Payments
  async findByUserEmail(email) {
    const paymentsCollection = await getCollection("payments");
    return paymentsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Payment By Parcel ID
  async findByParcelId(parcelId) {
    const paymentsCollection = await getCollection("payments");
    return paymentsCollection.findOne({ parcelId: new ObjectId(parcelId) });
  }
}

module.exports = new PaymentRepository();
