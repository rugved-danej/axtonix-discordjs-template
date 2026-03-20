const logger = require("../utils/logger");
const config = require("../configs/client.json");
const { sendErrorLog } = require("../utils/errorHandler");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.author.bot) return;

    const prefix = config.prefix;
    let usedPrefix = null;
    let isMention = false;
    let isExecAlias = false;

    if (message.content.startsWith(prefix)) {
      usedPrefix = prefix;
    } else if (message.content.startsWith("$")) {
      isExecAlias = true;
    } else if (message.mentions.has(client.user)) {
      usedPrefix = `<@${client.user.id}>`;
      isMention = true;
    } else {
      return;
    }

    let args, commandName;

    if (isMention) {
      const withoutMention = message.content.replace(/<@!?\d+>/, "").trim();
      args = withoutMention.split(/\s+/);
      commandName = args.shift()?.toLowerCase();
    } else if (isExecAlias) {
      args = message.content.slice(1).trim().split(/\s+/);
      commandName = "$";
    } else {
      args = message.content.slice(prefix.length).trim().split(/\s+/);
      commandName = args.shift()?.toLowerCase();
    }

    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    if (command.permissions && message.guild) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply({
          content: `❌ You need: \`${command.permissions.join(", ")}\``,
          allowedMentions: { repliedUser: false },
        });
      }
    }

    if (command.botPermissions && message.guild) {
      const botPerms = message.channel.permissionsFor(client.user);
      if (!botPerms || !botPerms.has(command.botPermissions)) {
        return message.reply({
          content: `❌ I need: \`${command.botPermissions.join(", ")}\``,
          allowedMentions: { repliedUser: false },
        });
      }
    }

    if (command.cooldown) {
      if (!client.cooldowns) client.cooldowns = new Map();

      const now = Date.now();
      const cooldownAmount = (command.cooldown || 3) * 1000;
      const key = `${commandName}-${message.author.id}`;

      if (client.cooldowns.has(key)) {
        const expirationTime = client.cooldowns.get(key) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply({
            content: `⏰ Wait ${timeLeft.toFixed(1)}s before using \`${commandName}\` again.`,
            allowedMentions: { repliedUser: false },
          });
        }
      }

      client.cooldowns.set(key, now);
      setTimeout(() => client.cooldowns.delete(key), cooldownAmount);
    }

    try {
      const logPrefix = isExecAlias ? "" : prefix;
      logger.command(
        `${logPrefix}${commandName} used by ${message.author.tag} in ${message.guild?.name || "DM"}`,
      );
      await command.execute(message, args, client);
    } catch (error) {
      logger.error(`Error executing ${commandName}: ${error.message}`);
      
      await sendErrorLog(client, error, `Prefix Command: ${commandName} (User: ${message.author.tag})`);
      
      message
        .reply({
          content: "❌ There was an error executing this command!",
          allowedMentions: { repliedUser: false },
        })
        .catch(() => {});
    }
  },
};
