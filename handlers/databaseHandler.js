const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../configs/client.json");

/**
 * Connects to the MongoDB database using Mongoose.
 * @param {Client} client - The Discord.js client instance
 */
async function connectDatabase(client) {
  if (!config.database.enabled) {
    logger.warn("Database connection is DISABLED in configs/client.json. Skipping connection.");
    return;
  }

  if (!config.database.uri || config.database.uri.includes("<user>")) {
    logger.error("Database URI is missing or unconfigured in configs/client.json!");
    return;
  }

  logger.info("Attempting to connect to MongoDB...");

  try {
    await mongoose.connect(config.database.uri, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.success("✅ Successfully connected to MongoDB Atlas!");

    client.mongoose = mongoose;
  } catch (error) {
    logger.error(`❌ Initial MongoDB connection failed: ${error.message}`);
  }

  mongoose.connection.on("error", (err) => {
    logger.error(`🚨 MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("🔌 MongoDB disconnected. Will attempt reconnect if needed.");
  });
}

module.exports = { connectDatabase };
