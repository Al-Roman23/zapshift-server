// Express Server Initialization And Route Registration
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const logger = require("./src/utils/logger");
const { connectDB, ensureIndexes, client } = require("./src/config/db");
const { errorHandler } = require("./src/middlewares/errorHandler");

// Import Routes
const userRoutes = require("./src/app/routes/user.routes");
const parcelRoutes = require("./src/app/routes/parcel.routes");
const riderRoutes = require("./src/app/routes/rider.routes");
const paymentRoutes = require("./src/app/routes/payment.routes");
const trackingRoutes = require("./src/app/routes/tracking.routes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware To Parse JSON And Handle CORS
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/", async (req, res) => {
  try {
    await client.db().command({ ping: 1 });
    res.json({
      success: true,
      message: "ZaP ShifT Server Running! MongoDB Connected!",
    });
  } catch (err) {
    logger.error({ err }, "Health Check Failed!");
    res
      .status(500)
      .json({ success: false, message: "MongoDB Connection Failed!" });
  }
});

// Register API Routes
app.use("/users", userRoutes);
app.use("/parcels", parcelRoutes);
app.use("/riders", riderRoutes);
app.use("/payments", paymentRoutes);
app.use("/trackings", trackingRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

let serverInstance;

// Start Server After Connecting To MongoDB And Ensuring Indexes
async function startServer() {
  try {
    await connectDB();
    await ensureIndexes();

    serverInstance = app.listen(port, () => {
      logger.info(`ZaP ShifT Server Running On Port ${port}!`);
    });
  } catch (error) {
    logger.fatal({ error }, "Failed To Start Server!");
    process.exit(1);
  }
}

// Graceful Shutdown Handler
async function shutdown(signal) {
  try {
    logger.info(`Received ${signal}. Closing Server And MongoDB Connection...`);

    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
      logger.info("HTTP Server Closed Successfully!");
    }

    await client.close();
    logger.info("MongoDB Connection Closed Successfully!");
    process.exit(0);
  } catch (err) {
    logger.fatal({ err }, "Error During Shutdown!");
    process.exit(1);
  }
}

// Listen For Termination Signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Start The Server
startServer();
