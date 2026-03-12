const fs = require("fs");
const path = require("path");
const { Collection, REST, Routes } = require("discord.js");
const logger = require("../utils/logger");
const config = require("../configs/client.json");

/**
 * Loads all slash commands from the filesystem
 * @param {Client} client - The Discord.js client instance
 */
function loadSlashCommands(client) {
  client.slashCommands = new Collection();
  const commandsPath = path.join(__dirname, "../commands/slash");

  if (!fs.existsSync(commandsPath)) {
    logger.warn("Slash commands directory not found. Creating it...");
    fs.mkdirSync(commandsPath, { recursive: true });
    return [];
  }

  const categories = fs.readdirSync(commandsPath).filter((file) => {
    return fs.statSync(path.join(commandsPath, file)).isDirectory();
  });

  const commands = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);

      try {
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);

        if (!command.data || !command.execute) continue;

        command.category = category;
        client.slashCommands.set(command.data.name, command);
        commands.push(command.data.toJSON());

        logger.debug(`Loaded slash command: ${command.data.name} (Category: ${category})`);
      } catch (error) {
        logger.error(`Failed to load slash command at ${filePath}: ${error.message}`);
      }
    }
  }

  logger.success(`Loaded ${commands.length} slash commands`);
  return commands;
}

/**
 * Syncs slash commands globally to ALL servers
 * @param {Client} client - The Discord.js client instance
 */
async function syncSlashCommands(client) {
  const localCommands = [];
  client.slashCommands.forEach((cmd) => localCommands.push(cmd.data.toJSON()));

  const rest = new REST({ version: "10" }).setToken(config.token);

  try {
    logger.info("Started refreshing global application (/) commands...");

    const data = await rest.put(Routes.applicationCommands(config.clientId), {
      body: localCommands,
    });

    logger.success(
      `Successfully reloaded ${data.length} global slash command(s) across all servers!`,
    );
  } catch (error) {
    logger.error(`Failed to sync global slash commands: ${error.message}`);
    console.error(error);
  }
}

/**
 * Reloads and resyncs all slash commands
 * @param {Client} client - The Discord.js client instance
 */
async function reloadSlashCommands(client) {
  logger.info("Reloading slash commands...");
  client.slashCommands.clear();
  loadSlashCommands(client);
  await syncSlashCommands(client);
}

module.exports = { loadSlashCommands, syncSlashCommands, reloadSlashCommands };
