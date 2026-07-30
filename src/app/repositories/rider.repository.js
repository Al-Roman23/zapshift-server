// Repository For Rider Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class RiderRepository {
  // Create Rider Application
  async createRider(rider) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.insertOne({
      ...rider,
      status: "pending",
      isActive: false,
      totalDeliveries: 0,
      rating: 0,
      createdAt: new Date(),
    });
  }

  // Find Rider By ID
  async findById(id) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.findOne({ _id: new ObjectId(id) });
  }

  // Find Rider By Email
  async findByEmail(email) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.findOne({ email });
  }

  // Get Pending Rider Applications
  async findPending() {
    const ridersCollection = await getCollection("riders");
    return ridersCollection
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Approved Riders
  async findApproved() {
    const ridersCollection = await getCollection("riders");
    return ridersCollection
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Get Available Riders (Active And Approved)
  async findAvailable() {
    const ridersCollection = await getCollection("riders");
    return ridersCollection
      .find({ status: "approved", isActive: true, workingStatus: { $ne: "busy" } })
      .toArray();
  }

  // Update Working Status
  async updateWorkingStatus(id, status) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { workingStatus: status, updatedAt: new Date() } }
    );
  }

  // Update Working Status By Email
  async updateWorkingStatusByEmail(email, status) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { email },
      { $set: { workingStatus: status, updatedAt: new Date() } }
    );
  }

  // Update Rider By ID
  async updateById(id, updateData) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    );
  }

  // Approve Rider
  async approveRider(id) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "approved", approvedAt: new Date() } },
    );
  }

  // Reject Rider
  async rejectRider(id, reason) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          rejectionReason: reason,
          rejectedAt: new Date(),
        },
      },
    );
  }

  // Delete Rider
  async deleteRider(id) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.deleteOne({ _id: new ObjectId(id) });
  }

  // Toggle Active Status
  async toggleActive(email) {
    const ridersCollection = await getCollection("riders");
    const rider = await this.findByEmail(email);
    return ridersCollection.updateOne(
      { email },
      { $set: { isActive: !rider?.isActive, updatedAt: new Date() } },
    );
  }

  // Increment Delivery Count
  async incrementDeliveries(email) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.updateOne(
      { email },
      { $inc: { totalDeliveries: 1 } },
    );
  }

  // Get Rider Status
  async getStatus(email) {
    const ridersCollection = await getCollection("riders");
    return ridersCollection.findOne(
      { email },
      { projection: { isActive: 1, totalDeliveries: 1, rating: 1, status: 1, rejectionReason: 1 } },
    );
  }
}

module.exports = new RiderRepository();
