// Rider Service Managing Business Logic
const RiderRepository = require("../repositories/rider.repository");
const ParcelRepository = require("../repositories/parcel.repository");
const UserRepository = require("../repositories/user.repository");
const { NotFound, Conflict, BadRequest } = require("../../core/errors/errors");

class RiderService {
  // Create Rider Application
  async createRiderApplication(rider) {
    const existingRider = await RiderRepository.findByEmail(rider.email);
    
    if (existingRider) {
      if (existingRider.status === "rejected") {
        const updateData = {
          ...rider,
          status: "pending",
          rejectionReason: null,
          createdAt: new Date()
        };
        delete updateData._id;
        
        await RiderRepository.updateById(existingRider._id, updateData);
        return { insertedId: existingRider._id, message: "Application Resubmitted" };
      }
      // If Pending Or Approved
      throw new Conflict("Application Already Exists!");
    }
    
    return RiderRepository.createRider(rider);
  }

  // Get Pending Applications
  async getPendingApplications() {
    return RiderRepository.findPending();
  }

  // Get Approved Riders
  async getApprovedRiders() {
    return RiderRepository.findApproved();
  }

  // Get Available Riders
  async getAvailableRiders() {
    return RiderRepository.findAvailable();
  }

  // Approve Rider
  async approveRider(id) {
    const rider = await RiderRepository.findById(id);
    if (!rider) throw new NotFound("Rider Not Found!");
    if (rider.status !== "pending")
      throw new BadRequest("Invalid Application Status!");

    await RiderRepository.approveRider(id);

    // Update User Role To Rider
    await UserRepository.updateByEmail(rider.email, { role: "rider" });

    return { success: true };
  }

  // Reject Rider
  async rejectRider(id, reason) {
    const rider = await RiderRepository.findById(id);
    if (!rider) throw new NotFound("Rider Not Found!");
    if (rider.status !== "pending")
      throw new BadRequest("Invalid Application Status!");

    return RiderRepository.rejectRider(id, reason);
  }

  // Delete Rider
  async deleteRider(id) {
    const rider = await RiderRepository.findById(id);
    if (!rider) throw new NotFound("Rider Not Found!");

    // Revert User Role
    await UserRepository.updateByEmail(rider.email, { role: "user" });

    return RiderRepository.deleteRider(id);
  }

  // Get Rider Status
  async getRiderStatus(email) {
    const status = await RiderRepository.getStatus(email);
    if (!status) return { status: null };
    return status;
  }

  // Toggle Active Status
  async toggleRiderStatus(email) {
    const rider = await RiderRepository.findByEmail(email);
    if (!rider) throw new NotFound("Rider Not Found!");
    return RiderRepository.toggleActive(email);
  }

  // Get Rider Deliveries
  async getRiderDeliveries(email) {
    return ParcelRepository.findRiderDeliveries(email);
  }

  // Get Rider Completed Deliveries
  async getRiderCompleted(email) {
    return ParcelRepository.findRiderCompleted(email);
  }

  // Get Rider Earnings
  async getRiderEarnings(email) {
    const completedDeliveries =
      await ParcelRepository.findRiderCompleted(email);

    const total = completedDeliveries.length * 50; // 50 Taka Per Delivery

    // Calculate This Month Earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthDeliveries = completedDeliveries.filter(
      (d) => new Date(d.deliveredAt) >= startOfMonth,
    );
    const thisMonth = thisMonthDeliveries.length * 50;

    return {
      total,
      thisMonth,
      deliveries: completedDeliveries.slice(0, 10),
    };
  }
}

module.exports = new RiderService();
