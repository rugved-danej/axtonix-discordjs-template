const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const logger = require("./utils/logger");
const config = require("./configs/client.json");
const { loadCommands } = require("./handlers/commandHandler");
const { loadSlashCommands, syncSlashCommands } = require("./handlers/slashCommandHandler");
const { loadEvents } = require("./handlers/eventHandler");
const { connectDatabase } = require("./handlers/databaseHandler");
const { sendErrorLog } = require("./utils/errorHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();

async function initializeBot() {
  try {
    logger.info("Starting bot initialization...");

    loadCommands(client);
    loadSlashCommands(client);
    loadEvents(client);

    const token = config.token;
    if (!token || token === "YOUR_BOT_TOKEN_HERE") {
      logger.error("BOT_TOKEN not found in configs/client.json!");
      process.exit(1);
    }

    await client.login(token);
    await connectDatabase(client);
    await syncSlashCommands(client);

    logger.success("Bot initialization completed successfully!");
  } catch (error) {
    logger.error(`Failed to initialize bot: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Global process listeners for high-level error reporting
process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled promise rejection: ${error.message}`);
  console.error(error);
  sendErrorLog(client, error, "Global: Unhandled Rejection");
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  console.error(error);
  sendErrorLog(client, error, "Global: Uncaught Exception");
  // Don't exit immediately so the error log has time to send
  setTimeout(() => process.exit(1), 2000);
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  client.destroy();
  process.exit(0);
});

initializeBot();

module.exports = client;
