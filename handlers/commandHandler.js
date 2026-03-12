const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const logger = require("../utils/logger");

/**
 * Loads all normal (prefix) commands from the filesystem
 * @param {Client} client - The Discord.js client instance
 */
function loadCommands(client) {
  client.commands = new Collection();
  client.categories = new Collection();

  const commandsPath = path.join(__dirname, "../commands/normal");

  if (!fs.existsSync(commandsPath)) {
    logger.warn("Normal commands directory not found. Creating it...");
    fs.mkdirSync(commandsPath, { recursive: true });
    return;
  }

  const categories = fs.readdirSync(commandsPath).filter((file) => {
    return fs.statSync(path.join(commandsPath, file)).isDirectory();
  });

  let commandCount = 0;

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".js"));

    const commands = [];

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);

      try {
        delete require.cache[require.resolve(filePath)];

        const command = require(filePath);

        if (!command.name) {
          logger.warn(`Command at ${filePath} is missing a "name" property. Skipping...`);
          continue;
        }

        if (!command.execute) {
          logger.warn(`Command "${command.name}" is missing an "execute" function. Skipping...`);
          continue;
        }

        client.commands.set(command.name, command);

        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.commands.set(alias, command);
          });
        }

        commands.push(command.name);
        commandCount++;

        logger.debug(`Loaded command: ${command.name} (Category: ${category})`);
      } catch (error) {
        logger.error(`Failed to load command at ${filePath}: ${error.message}`);
      }
    }

    if (commands.length > 0) {
      client.categories.set(category, commands);
    }
  }

  logger.success(`Loaded ${commandCount} normal commands across ${categories.length} categories`);
}

/**
 * Reloads all commands (useful for hot reloading)
 * @param {Client} client - The Discord.js client instance
 */
function reloadCommands(client) {
  logger.info("Reloading all normal commands...");
  client.commands.clear();
  client.categories.clear();
  loadCommands(client);
}

module.exports = { loadCommands, reloadCommands };
