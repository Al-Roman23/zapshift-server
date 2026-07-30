// Repository For Parcel Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class ParcelRepository {
  // Generate Tracking ID: ZaPShifT-YYYY-MM-DD-Serial
  async generateTrackingId() {
    const parcelsCollection = await getCollection("parcels");
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const datePrefix = `ZaPShifT-${year}-${month}-${day}`;

    // Get Today's Parcels Count
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todayCount = await parcelsCollection.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const serial = todayCount + 1;
    return `${datePrefix}-${serial}`;
  }

  // Create New Parcel
  async createParcel(parcel) {
    const parcelsCollection = await getCollection("parcels");
    const trackingId = await this.generateTrackingId();
    return parcelsCollection.insertOne({
      ...parcel,
      trackingId,
      createdAt: new Date(),
    });
  }

  // Find Parcel By ID
  async findById(id) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.findOne({ _id: new ObjectId(id) });
  }

  // Find Parcel By Tracking ID
  async findByTrackingId(trackingId) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.findOne({ trackingId });
  }

  // Get User Parcels By Email
  async findByUserEmail(email) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ senderEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Paid Parcels For User
  async findPaidParcels(email) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ senderEmail: email, paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Unpaid Parcels (Admin View)
  async findUnpaid() {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ paymentStatus: "unpaid", deliveryStatus: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Unassigned Parcels
  async findUnassigned() {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ paymentStatus: "paid", riderId: { $exists: false } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get ALL Parcels (Admin)
  async findAll() {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.find({}).sort({ createdAt: -1 }).toArray();
  }

  // Get All Delivered Parcels (Admin)
  async findAllDelivered() {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ deliveryStatus: "delivered" })
      .sort({ deliveredAt: -1 })
      .toArray();
  }



  // Update Parcel By ID
  async updateById(id, updateData) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    );
  }

  // Assign Rider To Parcel
  async assignRider(parcelId, riderId, riderEmail, riderName) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          riderId: new ObjectId(riderId),
          riderEmail,
          riderName: riderName || riderEmail,
          deliveryStatus: "assigned",
          assignedAt: new Date(),
        },
        $unset: {
          rejectionReason: "",
          rejectedAt: "",
        },
      },
    );
  }

  // Find Rejected Parcels (Have Rejection Reason And Pending Status)
  async findRejected() {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({
        deliveryStatus: "pending",
        rejectionReason: { $exists: true, $ne: "" },
      })
      .sort({ rejectedAt: -1 })
      .toArray();
  }

  // Clear Rider And Set Back To Pending (For Re-assignment)
  async clearRiderAndReject(parcelId, reason) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          deliveryStatus: "pending",
          rejectionReason: reason,
          rejectedAt: new Date(),
        },
        $unset: {
          riderId: "",
          riderEmail: "",
          riderName: "",
          assignedAt: "",
        },
      },
    );
  }

  // Update Payment Status
  async updatePaymentStatus(id, transactionId) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentStatus: "paid",
          transactionId,
          paidAt: new Date(),
        },
      },
    );
  }

  // Update Delivery Status
  async updateDeliveryStatus(id, status) {
    const parcelsCollection = await getCollection("parcels");
    const updateData = { deliveryStatus: status, updatedAt: new Date() };
    if (status === "delivered") updateData.deliveredAt = new Date();
    return parcelsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );
  }

  // Cancel Parcel
  async cancelParcel(id) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { deliveryStatus: "cancelled", cancelledAt: new Date() } },
    );
  }

  // Get Rider Deliveries (All Active)
  async findRiderDeliveries(riderEmail) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({
        riderEmail,
        deliveryStatus: {
          $in: ["assigned", "accepted", "picking-up", "picked-up", "in-transit"],
        },
      })
      .sort({ assignedAt: -1 })
      .toArray();
  }

  // Get Rider Completed Deliveries
  async findRiderCompleted(riderEmail) {
    const parcelsCollection = await getCollection("parcels");
    return parcelsCollection
      .find({ riderEmail, deliveryStatus: "delivered" })
      .sort({ deliveredAt: -1 })
      .toArray();
  }

  // Get App Statistics
  async getAppStats() {
    const parcelsCollection = await getCollection("parcels");
    const stats = await parcelsCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalParcels: { $sum: 1 },
            pendingParcels: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$deliveryStatus", "pending"] },
                      { $eq: ["$paymentStatus", "paid"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            deliveredParcels: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0],
              },
            },
            cancelledParcels: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "cancelled"] }, 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    return stats[0] || {};
  }
}

module.exports = new ParcelRepository();
