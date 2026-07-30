// User Controller Managing Requests And Responses
const UserService = require("../services/user.service");
const { BadRequest } = require("../../core/errors/errors");
const { validateRegisterUser } = require("../validators/user.validator");

class UserController {
  // Route To Register New User
  async createUser(req, res, next) {
    try {
      const { name, email, photoURL, role } = req.body;

      // Validate User Input
      const validation = validateRegisterUser(req.body);
      if (!validation.valid) throw new BadRequest(validation.message);

      // Prepare New User Object
      const newUser = {
        name,
        email,
        photoURL: photoURL || "",
        role: role || "user",
        status: "active",
        createdAt: new Date(),
      };

      // Register User Using Service
      const result = await UserService.registerUser(newUser);

      res.status(201).json({
        message: "User Added Successfully!",
        id: result.insertedId,
      });
    } catch (error) {
      next(error);
    }
  }

  // Check User Status
  async checkStatus(req, res, next) {
    try {
      const email = req.user?.email;
      if (!email) throw new BadRequest("Email Required!");

      const result = await UserService.checkUserStatus(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update User Profile
  async updateProfile(req, res, next) {
    try {
      const email = req.user?.email;
      if (!email) throw new BadRequest("Email Required!");

      const { name, photoURL, phone } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (photoURL) updateData.photoURL = photoURL;
      if (phone) updateData.phone = phone;

      await UserService.updateUserProfile(email, updateData);
      res.json({ message: "Profile Updated Successfully!" });
    } catch (error) {
      next(error);
    }
  }

  // Get User Role
  async getRole(req, res, next) {
    try {
      const { email } = req.params;
      if (!email) throw new BadRequest("Email Required!");

      const result = await UserService.getUserRole(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Users (Admin)
  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // Toggle User Status (Admin)
  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.toggleUserStatus(id);
      res.json({ message: "User Status Updated!" });
    } catch (error) {
      next(error);
    }
  }

  // Change User Role (Admin)
  async changeRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!role) throw new BadRequest("Role Required!");

      await UserService.changeUserRole(id, role);
      res.json({ message: "User Role Updated!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
