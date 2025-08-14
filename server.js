const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/sequelize");

// Import models to establish associations
const models = require("./models");

// Import routes
const everCareRoutes = require("./routes/everCare.routes");
const careGoalRoutes = require("./routes/careGoal.routes");
const careTaskRoutes = require("./routes/careTask.routes");
const wearableDeviceRoutes = require("./routes/wearableDevice.routes");

const PORT = process.env.PORT || 5005;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan());

// Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Ever Care Service is running",
//     timestamp: new Date().toISOString(),
//     service: "Healthify Ever Care Service",
//     version: "1.0.0",
//   });
// });

// Mount routes
app.use("/api/evercare", everCareRoutes);
app.use("/api/goals", careGoalRoutes);
app.use("/api/tasks", careTaskRoutes);
app.use("/api/devices", wearableDeviceRoutes);

// Start the server only if the database connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // sync the models with the database
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Ever Care Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();
