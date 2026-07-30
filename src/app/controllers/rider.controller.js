// Rider Controller Managing Requests And Responses
const RiderService = require("../services/rider.service");
const { BadRequest } = require("../../core/errors/errors");

class RiderController {
  // Create Rider Application
  async createApplication(req, res, next) {
    try {
      const riderData = req.body;

      if (!riderData.email || !riderData.fullName) {
        throw new BadRequest("Missing Required Fields!");
      }

      const result = await RiderService.createRiderApplication(riderData);
      res.status(201).json({
        message: "Application Submitted!",
        id: result.insertedId,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Pending Applications (Admin)
  async getPending(req, res, next) {
    try {
      const riders = await RiderService.getPendingApplications();
      res.json(riders);
    } catch (error) {
      next(error);
    }
  }

  // Get Approved Riders (Admin)
  async getApproved(req, res, next) {
    try {
      const riders = await RiderService.getApprovedRiders();
      res.json(riders);
    } catch (error) {
      next(error);
    }
  }

  // Get Available Riders (Admin)
  async getAvailable(req, res, next) {
    try {
      const riders = await RiderService.getAvailableRiders();
      res.json(riders);
    } catch (error) {
      next(error);
    }
  }

  // Approve Rider (Admin)
  async approve(req, res, next) {
    try {
      const { id } = req.params;
      await RiderService.approveRider(id);
      res.json({ message: "Rider Approved!" });
    } catch (error) {
      next(error);
    }
  }

  // Reject Rider (Admin)
  async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await RiderService.rejectRider(id, reason || "No reason provided");
      res.json({ message: "Rider Rejected!" });
    } catch (error) {
      next(error);
    }
  }

  // Delete Rider (Admin)
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await RiderService.deleteRider(id);
      res.json({ message: "Rider Removed!" });
    } catch (error) {
      next(error);
    }
  }

  // Get Rider Status
  async getStatus(req, res, next) {
    try {
      const { email } = req.params;
      const status = await RiderService.getRiderStatus(email);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  // Toggle Active Status
  async toggleStatus(req, res, next) {
    try {
      const { email } = req.params;
      await RiderService.toggleRiderStatus(email);
      res.json({ message: "Status Updated!" });
    } catch (error) {
      next(error);
    }
  }

  // Get Rider Deliveries
  async getDeliveries(req, res, next) {
    try {
      const { email } = req.params;
      const deliveries = await RiderService.getRiderDeliveries(email);
      res.json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  // Get Rider Completed Deliveries
  async getCompleted(req, res, next) {
    try {
      const { email } = req.params;
      const deliveries = await RiderService.getRiderCompleted(email);
      res.json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  // Get Rider Earnings
  async getEarnings(req, res, next) {
    try {
      const { email } = req.params;
      const earnings = await RiderService.getRiderEarnings(email);
      res.json(earnings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RiderController();
