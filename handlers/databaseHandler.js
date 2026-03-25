const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../configs/client.json");

/**
 * Connects to the MongoDB Atlas database using Mongoose.
 * @param {Client} client - The Discord.js client instance
 */
async function connectDatabase(client) {
  if (!config.database.enabled) {
    logger.warn("Database connection is DISABLED in configs/client.json. Skipping connection.");
    return;
  }

  if (!config.database.mongoUri || config.database.mongoUri === "YOUR_MONGODB_ATLAS_CONNECTION_STRING") {
    logger.error("MongoDB URI is missing or unconfigured in configs/client.json!");
    return;
  }

  logger.info("Attempting to connect to MongoDB Atlas...");

  try {
    // Suppresses Mongoose 7+ strictQuery warnings
    mongoose.set("strictQuery", false);

    // Connect to MongoDB
    await mongoose.connect(config.database.mongoUri);

    // Attach to the Discord client (matches your README documentation)
    client.mongoose = mongoose;

    logger.success("✅ Successfully connected to MongoDB Atlas!");
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
  }

  // Listen for database connection errors after the initial connection
  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB Runtime Error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected!");
  });
}

module.exports = { connectDatabase };
