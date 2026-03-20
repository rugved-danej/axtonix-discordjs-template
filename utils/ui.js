const { ContainerBuilder, MessageFlags } = require("discord.js");
const colors = require("./colors");

/**
 * Centralized UI templates for Discord Components V2
 */
class UI {
  /**
   * Creates a standard status/info container
   */
  static statusContainer(title, content, isSuccess = true) {
    return new ContainerBuilder()
      .setAccentColor(isSuccess ? (colors.primary || 0x5865f2) : 0xff0000)
      .addTextDisplayComponents((text) => text.setContent(title))
      .addSeparatorComponents((sep) => sep.setDivider(true))
      .addTextDisplayComponents((text) => text.setContent(content))
      .addSeparatorComponents((sep) => sep.setDivider(true))
      .addTextDisplayComponents((text) => 
        text.setContent(`-# Last Updated: ${new Date().toLocaleTimeString()}`)
      );
  }

  /**
   * Standard V2 Flags
   */
  static get v2Flags() {
    return { flags: [MessageFlags.IsComponentsV2] };
  }
}

module.exports = UI;
