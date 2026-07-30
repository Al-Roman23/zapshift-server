// Middleware To Verify Is User A Rider
const { getCollection } = require("../config/db");
const { Unauthorized, Forbidden, NotFound } = require("../core/errors/errors");

const verifyRider = async (req, res, next) => {
  try {
    // Check If User Email Exists From Auth Token
    const email = req.user?.email;
    if (!email) throw new Unauthorized("Unauthorized: No Email Found!");

    // Access "users" Collection And Find User
    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) throw new NotFound("User Not Found!");
    if (user.role !== "rider")
      throw new Forbidden("Forbidden Access: Rider Only!");

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyRider };
