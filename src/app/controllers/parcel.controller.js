// Parcel Controller Managing Requests And Responses
const ParcelService = require("../services/parcel.service");
const { BadRequest } = require("../../core/errors/errors");

class ParcelController {
  // Create New Parcel
  async createParcel(req, res, next) {
    try {
      const parcelData = req.body;

      // Basic Validation
      if (!parcelData.parcelName || !parcelData.senderEmail) {
        throw new BadRequest("Missing Required Fields!");
      }

      const result = await ParcelService.createParcel(parcelData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Parcel By ID
  async getParcel(req, res, next) {
    try {
      const { id } = req.params;
      const parcel = await ParcelService.getParcelById(id);
      res.json(parcel);
    } catch (error) {
      next(error);
    }
  }

  // Get User Parcels
  async getUserParcels(req, res, next) {
    try {
      const { email } = req.params;
      const parcels = await ParcelService.getUserParcels(email);
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get Paid Parcels (For Tracking)
  async getPaidParcels(req, res, next) {
    try {
      const email = req.user?.email;
      if (!email) throw new BadRequest("Email Required!");

      const parcels = await ParcelService.getPaidParcels(email);
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get Unassigned Parcels (Admin)
  async getUnassignedParcels(req, res, next) {
    try {
      const parcels = await ParcelService.getUnassignedParcels();
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get Unpaid Parcels (Admin)
  async getUnpaidParcels(req, res, next) {
    try {
      const parcels = await ParcelService.getUnpaidParcels();
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get Rejected Parcels (Admin)
  async getRejectedParcels(req, res, next) {
    try {
      const parcels = await ParcelService.getRejectedParcels();
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get All Parcels (Admin)
  async getAllParcels(req, res, next) {
    try {
      const parcels = await ParcelService.getAllParcels();
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Get All Delivered Parcels (Admin)
  async getAllDeliveredParcels(req, res, next) {
    try {
      const parcels = await ParcelService.getAllDeliveredParcels();
      res.json(parcels);
    } catch (error) {
      next(error);
    }
  }

  // Assign Rider (Admin)
  async assignRider(req, res, next) {
    try {
      const { id } = req.params;
      const { riderId, riderEmail, riderName } = req.body;

      if (!riderId) throw new BadRequest("Rider ID Required!");

      const result = await ParcelService.assignRider(id, riderId, riderEmail, riderName);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Rider Accepts Parcel
  async acceptParcel(req, res, next) {
    try {
      const { id } = req.params;
      const riderEmail = req.user?.email;
      const { riderName } = req.body;

      const result = await ParcelService.acceptParcel(id, riderEmail, riderName);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Rider Rejects Parcel
  async rejectParcel(req, res, next) {
    try {
      const { id } = req.params;
      const riderEmail = req.user?.email;
      const { riderName, reason } = req.body;

      if (!reason) throw new BadRequest("Rejection reason is required!");

      const result = await ParcelService.rejectParcel(id, riderEmail, riderName, reason);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Delivery Status
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, riderName } = req.body;
      const updatedBy = req.user?.email || "System";

      if (!status) throw new BadRequest("Status Required!");

      const result = await ParcelService.updateDeliveryStatus(
        id,
        status,
        updatedBy,
        riderName,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Cancel Parcel
  async cancelParcel(req, res, next) {
    try {
      const { id } = req.params;
      const email = req.user?.email;

      const result = await ParcelService.cancelParcel(id, email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Mark As Paid
  async markPaid(req, res, next) {
    try {
      const { id } = req.params;
      const { transactionId } = req.body;

      if (!transactionId) throw new BadRequest("Transaction ID Required!");

      const result = await ParcelService.markPaid(id, transactionId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get App Stats (Admin)
  async getStats(req, res, next) {
    try {
      const stats = await ParcelService.getAppStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParcelController();
