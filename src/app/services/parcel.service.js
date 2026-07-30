const ParcelRepository = require("../repositories/parcel.repository");
const RiderRepository = require("../repositories/rider.repository");
const TrackingService = require("./tracking.service");
const { NotFound, BadRequest, Forbidden } = require("../../core/errors/errors");

// Status Log Messages
const statusMessages = {
  assigned: (riderName) => `Rider ${riderName} assigned to parcel!`,
  accepted: (riderName) => `Rider ${riderName} accepted the parcel!`,
  rejected: (riderName, reason) => `Rider ${riderName} rejected: ${reason}`,
  "picking-up": () => "On the way to pick up parcel!",
  "picked-up": () => "Parcel picked up!",
  "in-transit": () => "On the way to deliver parcel!",
  delivered: () => "Parcel delivered successfully!",
};

class ParcelService {
  // Create New Parcel
  async createParcel(parcel) {
    const result = await ParcelRepository.createParcel(parcel);

    // Create Initial Tracking Log
    const savedParcel = await ParcelRepository.findById(result.insertedId);
    await TrackingService.createLog({
      parcelId: result.insertedId,
      trackingId: savedParcel.trackingId,
      status: "pending",
      details: "Parcel booking created!",
      by: "System",
    });

    return { id: result.insertedId, trackingId: savedParcel.trackingId };
  }

  // Get Parcel By ID
  async getParcelById(id) {
    const parcel = await ParcelRepository.findById(id);
    if (!parcel) throw new NotFound("Parcel Not Found!");
    return parcel;
  }

  // Get User Parcels
  async getUserParcels(email) {
    return ParcelRepository.findByUserEmail(email);
  }

  // Get User Paid Parcels
  async getPaidParcels(email) {
    return ParcelRepository.findPaidParcels(email);
  }

  // Get Unassigned Parcels
  async getUnassignedParcels() {
    return ParcelRepository.findUnassigned();
  }

  // Get Unpaid Parcels (Admin)
  async getUnpaidParcels() {
    return ParcelRepository.findUnpaid();
  }

  // Get Rejected Parcels
  async getRejectedParcels() {
    return ParcelRepository.findRejected();
  }

  // Get All Parcels (Admin)
  async getAllParcels() {
    return ParcelRepository.findAll();
  }

  // Get All Delivered Parcels (Admin)
  async getAllDeliveredParcels() {
    return ParcelRepository.findAllDelivered();
  }

  // Assign Rider (Also Handles Re-Assignment After Rejection)
  async assignRider(parcelId, riderId, riderEmail, riderName) {
    const parcel = await this.getParcelById(parcelId);
    
    // Only Block If Already Assigned AND Not In Pending Status (Rejected Parcels Go Back To Pending)
    if (parcel.riderId && parcel.deliveryStatus !== "pending") {
      throw new BadRequest("Rider Already Assigned!");
    }

    await ParcelRepository.assignRider(parcelId, riderId, riderEmail, riderName);
    
    // Set Rider To Busy
    await RiderRepository.updateWorkingStatus(riderId, "busy");

    // Log Assignment (Mention If Re-Assignment)
    const isReassignment = parcel.rejectionReason ? true : false;
    await TrackingService.createLog({
      parcelId,
      trackingId: parcel.trackingId,
      status: "assigned",
      details: isReassignment 
        ? `Parcel re-assigned to Rider ${riderName || riderEmail}`
        : statusMessages.assigned(riderName || riderEmail),
      by: "Admin",
    });

    return { success: true };
  }

  // Rider Accepts Parcel
  async acceptParcel(parcelId, riderEmail, riderName) {
    const parcel = await this.getParcelById(parcelId);
    
    if (parcel.riderEmail !== riderEmail) {
      throw new Forbidden("Not authorized to accept this parcel!");
    }
    if (parcel.deliveryStatus !== "assigned") {
      throw new BadRequest("Parcel is not in assigned status!");
    }

    await ParcelRepository.updateDeliveryStatus(parcelId, "accepted");

    // Log Acceptance
    await TrackingService.createLog({
      parcelId,
      trackingId: parcel.trackingId,
      status: "accepted",
      details: statusMessages.accepted(riderName || riderEmail),
      by: riderEmail,
    });

    return { success: true };
  }

  // Rider Rejects Parcel
  async rejectParcel(parcelId, riderEmail, riderName, reason) {
    const parcel = await this.getParcelById(parcelId);
    
    if (parcel.riderEmail !== riderEmail) {
      throw new Forbidden("Not authorized to reject this parcel!");
    }
    if (parcel.deliveryStatus !== "assigned") {
      throw new BadRequest("Parcel is not in assigned status!");
    }

    // Clear Rider And Set Back To Pending (For Re-Assignment)
    await ParcelRepository.clearRiderAndReject(parcelId, reason);

    // Set Rider Back To Available
    await RiderRepository.updateWorkingStatusByEmail(riderEmail, "available");

    // Log Rejection
    await TrackingService.createLog({
      parcelId,
      trackingId: parcel.trackingId,
      status: "rejected",
      details: statusMessages.rejected(riderName || riderEmail, reason),
      by: riderEmail,
    });

    return { success: true };
  }

  // Update Delivery Status
  async updateDeliveryStatus(id, status, updatedBy, riderName) {
    const parcel = await this.getParcelById(id);
    await ParcelRepository.updateDeliveryStatus(id, status);

    // If Delivered, Increment Rider's Total Deliveries And Set To Available
    if (status === "delivered" && parcel.riderEmail) {
      await RiderRepository.incrementDeliveries(parcel.riderEmail);
      await RiderRepository.updateWorkingStatusByEmail(parcel.riderEmail, "available");
    }

    // Get Appropriate Log Message
    const getMessage = statusMessages[status];
    const details = getMessage 
      ? (typeof getMessage === "function" ? getMessage(riderName || updatedBy) : getMessage)
      : `Status updated to: ${status}`;

    // Log Status Change
    await TrackingService.createLog({
      parcelId: id,
      trackingId: parcel.trackingId,
      status,
      details,
      by: updatedBy,
    });

    return { success: true };
  }

  // Cancel Parcel
  async cancelParcel(id, email) {
    const parcel = await this.getParcelById(id);

    // Only Allow Sender To Cancel
    if (parcel.senderEmail !== email) throw new Forbidden("Not Authorized!");
    if (parcel.deliveryStatus !== "pending")
      throw new BadRequest("Cannot Cancel This Parcel!");

    await ParcelRepository.cancelParcel(id);

    // Log Cancellation
    await TrackingService.createLog({
      parcelId: id,
      trackingId: parcel.trackingId,
      status: "cancelled",
      details: "Parcel cancelled by sender",
      by: email,
    });

    return { success: true };
  }

  // Mark Payment Complete
  async markPaid(id, transactionId) {
    const parcel = await this.getParcelById(id);
    await ParcelRepository.updatePaymentStatus(id, transactionId);

    // Log Payment
    await TrackingService.createLog({
      parcelId: id,
      trackingId: parcel.trackingId,
      status: "paid",
      details: "Payment completed!",
      by: "System",
    });

    return { success: true };
  }

  // Get Rider Deliveries
  async getRiderDeliveries(riderEmail) {
    return ParcelRepository.findRiderDeliveries(riderEmail);
  }

  // Get Rider Completed Deliveries
  async getRiderCompleted(riderEmail) {
    return ParcelRepository.findRiderCompleted(riderEmail);
  }

  // Get App Stats
  async getAppStats() {
    return ParcelRepository.getAppStats();
  }
}

module.exports = new ParcelService();
