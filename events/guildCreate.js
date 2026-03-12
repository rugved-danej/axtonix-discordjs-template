const logger = require("../utils/logger");
const config = require("../configs/client.json");

module.exports = {
  name: "guildCreate",

  async execute(guild, client) {
    logger.info(`📥 Joined new guild: ${guild.name} (${guild.id})`);

    if (config.guildOnlyMode && !config.allowedGuilds.includes(guild.id)) {
      logger.warn(`🚫 Guild ${guild.name} (${guild.id}) is NOT authorized. Leaving...`);
      try {
        await guild.leave();
        logger.success(`✅ Successfully left unauthorized guild: ${guild.name} (${guild.id})`);
      } catch (error) {
        logger.error(`❌ Failed to leave guild ${guild.name} (${guild.id}): ${error.message}`);
      }
    }
  },
};
