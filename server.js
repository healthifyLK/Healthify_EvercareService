const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/sequelize");


const PORT = process.env.PORT || 5005;

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan());

// Development auth middleware (DO NOT enable in production)
// if (process.env.NODE_ENV === 'development') {
//   const devAuth = require('./middlewares/devAuth');
//   app.use(devAuth);
// }



// Start   the server only if the database connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // sync the models with the database
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Evercare Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();
