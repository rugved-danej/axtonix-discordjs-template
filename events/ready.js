const logger = require("../utils/logger");
const config = require("../configs/client.json");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    logger.success(`Bot is ready! Logged in as ${client.user.tag}`);
    logger.info(`Active in ${client.guilds.cache.size} guild(s)`);

    client.user.setPresence({
      activities: [
        {
          name: `${client.guilds.cache.size} servers`,
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    if (config.guildOnlyMode) {
      logger.info("🔒 Guild-only mode is ENABLED. Scanning for unauthorized guilds...");
      const unauthorizedGuilds = client.guilds.cache.filter(
        (guild) => !config.allowedGuilds.includes(guild.id),
      );

      if (unauthorizedGuilds.size > 0) {
        logger.warn(`Found ${unauthorizedGuilds.size} unauthorized guild(s). Leaving...`);
        for (const [id, guild] of unauthorizedGuilds) {
          try {
            await guild.leave();
            logger.success(`✅ Left unauthorized guild: ${guild.name} (${guild.id})`);
          } catch (error) {
            logger.error(`❌ Failed to leave guild ${guild.name} (${guild.id}): ${error.message}`);
          }
        }
      } else {
        logger.success("All guilds are authorized.");
      }
    } else {
      logger.info("🌍 Guild-only mode is DISABLED. Operating globally.");
    }

    const normalCommands = client.categories
      ? client.categories.reduce((total, cmdArray) => total + cmdArray.length, 0)
      : 0;
    const slashCommands = client.slashCommands ? client.slashCommands.size : 0;
    logger.info(`Commands loaded: ${normalCommands} normal, ${slashCommands} slash commands`);

    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`;
    logger.info(`Bot invite link: ${inviteLink}`);
  },
};
