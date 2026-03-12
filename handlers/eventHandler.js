const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

/**
 * Loads all event files and registers them with the Discord client
 * @param {Client} client - The Discord.js client instance
 */
function loadEvents(client) {
  const eventsPath = path.join(__dirname, "../events");

  if (!fs.existsSync(eventsPath)) {
    logger.warn("Events directory not found. Creating it...");
    fs.mkdirSync(eventsPath, { recursive: true });
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

  let eventCount = 0;

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const event = require(filePath);

      if (!event.name) {
        logger.warn(`Event at ${filePath} is missing a "name" property. Skipping...`);
        continue;
      }

      if (!event.execute) {
        logger.warn(`Event "${event.name}" is missing an "execute" function. Skipping...`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      eventCount++;
      logger.debug(`Loaded event: ${event.name} (Once: ${event.once || false})`);
    } catch (error) {
      logger.error(`Failed to load event at ${filePath}: ${error.message}`);
    }
  }

  logger.success(`Loaded ${eventCount} events`);
}

/**
 * Reloads all events (useful for hot reloading)
 * @param {Client} client - The Discord.js client instance
 */
function reloadEvents(client) {
  logger.info("Reloading all events...");

  client.removeAllListeners();

  loadEvents(client);
}

module.exports = { loadEvents, reloadEvents };
