// User Service Managing Business Logic
const UserRepository = require("../repositories/user.repository");
const { Conflict, NotFound, Forbidden } = require("../../core/errors/errors");

class UserService {
  // Register New User
  async registerUser(user) {
    const existingUser = await UserRepository.findByEmail(user.email);
    if (existingUser) throw new Conflict("User Already Exists!");
    return UserRepository.createUser(user);
  }

  // Check If User Is Active
  async checkUserStatus(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    if (user.status === "disabled") throw new Forbidden("Account Disabled!");
    return { status: "active" };
  }

  // Get User By Email
  async getUserByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    return user;
  }

  // Update User Profile
  async updateUserProfile(email, data) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    return UserRepository.updateByEmail(email, data);
  }

  // Get User Role
  async getUserRole(email) {
    const role = await UserRepository.getRoleByEmail(email);
    return { role };
  }

  // Get All Users
  async getAllUsers() {
    return UserRepository.findAll();
  }

  // Toggle User Status
  async toggleUserStatus(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new NotFound("User Not Found!");
    return UserRepository.toggleStatus(id);
  }

  // Change User Role
  async changeUserRole(id, role) {
    const user = await UserRepository.findById(id);
    if (!user) throw new NotFound("User Not Found!");
    return UserRepository.changeRole(id, role);
  }
}

module.exports = new UserService();
