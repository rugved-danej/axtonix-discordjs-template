const { MessageFlags } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        logger.warn(`No slash command found for: ${interaction.commandName}`);
        return;
      }

      try {
        logger.command(
          `/${interaction.commandName} used by ${interaction.user.tag} in ${interaction.guild?.name || "DM"}`,
        );
        await command.execute(interaction, client);
      } catch (error) {
        logger.error(`Error executing /${interaction.commandName}: ${error.message}`);
        console.error(error);

        const replyOptions = {
          content: "❌ There was an error executing this command!",
          flags: MessageFlags.Ephemeral,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyOptions);
        } else {
          await interaction.reply(replyOptions);
        }
      }
    }

    if (interaction.isAutocomplete()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (error) {
        logger.error(`Autocomplete error for /${interaction.commandName}: ${error.message}`);
      }
    }

    if (interaction.isButton()) {
      logger.debug(`Button clicked: ${interaction.customId} by ${interaction.user.tag}`);
    }

    if (interaction.isStringSelectMenu()) {
      logger.debug(`Select menu used: ${interaction.customId} by ${interaction.user.tag}`);
    }

    if (interaction.isModalSubmit()) {
      logger.debug(`Modal submitted: ${interaction.customId} by ${interaction.user.tag}`);
    }
  },
};
