const { createClient } = require("@supabase/supabase-js");
const logger = require("../utils/logger");
const config = require("../configs/client.json");

/**
 * Connects to the PostgreSQL database using Supabase.
 * @param {Client} client - The Discord.js client instance
 */
async function connectDatabase(client) {
  if (!config.database.enabled) {
    logger.warn("Database connection is DISABLED in configs/client.json. Skipping connection.");
    return;
  }

  if (!config.database.supabaseUrl || config.database.supabaseUrl === "YOUR_SUPABASE_URL" || !config.database.supabaseKey) {
    logger.error("Supabase URL or Key is missing or unconfigured in configs/client.json!");
    return;
  }

  logger.info("Attempting to initialize Supabase client...");

  try {
    // Initialize the Supabase client
    const supabase = createClient(config.database.supabaseUrl, config.database.supabaseKey, {
      auth: {
        persistSession: false // Not needed for a backend bot
      }
    });

    // Attach to the Discord client so it can be accessed in commands/events
    client.supabase = supabase;

    logger.success("✅ Successfully initialized Supabase client!");
  } catch (error) {
    logger.error(`❌ Supabase initialization failed: ${error.message}`);
  }
}

module.exports = { connectDatabase };
