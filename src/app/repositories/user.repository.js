// Repository For User Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class UserRepository {
  // Create New User In Database
  async createUser(user) {
    const usersCollection = await getCollection("users");
    return usersCollection.insertOne({ ...user, createdAt: new Date() });
  }

  // Find User By Email
  async findByEmail(email) {
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ email });
  }

  // Find User By ID
  async findById(id) {
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ _id: new ObjectId(id) });
  }

  // Get All Users
  async findAll() {
    const usersCollection = await getCollection("users");
    return usersCollection.find({}).toArray();
  }

  // Update User By ID
  async updateById(id, updateData) {
    const usersCollection = await getCollection("users");
    return usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    );
  }

  // Update User By Email
  async updateByEmail(email, updateData) {
    const usersCollection = await getCollection("users");
    return usersCollection.updateOne(
      { email },
      { $set: { ...updateData, updatedAt: new Date() } },
    );
  }

  // Get User Role By Email
  async getRoleByEmail(email) {
    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne(
      { email },
      { projection: { role: 1 } },
    );
    return user?.role || "user";
  }

  // Toggle User Status
  async toggleStatus(id) {
    const usersCollection = await getCollection("users");
    const user = await this.findById(id);
    const newStatus = user?.status === "active" ? "disabled" : "active";
    return usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus, updatedAt: new Date() } },
    );
  }

  // Change User Role
  async changeRole(id, role) {
    const usersCollection = await getCollection("users");
    return usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } },
    );
  }
}

module.exports = new UserRepository();
