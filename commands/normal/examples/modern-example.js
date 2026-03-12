const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  SeparatorBuilder,
  ThumbnailBuilder,
  MessageFlags,
} = require("discord.js");
const colors = require("../../../utils/colors"); //

module.exports = {
  name: "modern-example",
  description: "Show a true Components V2 interface",
  aliases: ["v2", "modern"],
  async execute(message, args, client) {
    // 1. SECTION: Groups text and an accessory (like a thumbnail or button) side-by-side
    const headerSection = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "## 🚀 Components V2 Showcase\nWelcome to the next generation of Discord UIs!",
        ),
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder()
          .setURL(client.user.displayAvatarURL({ extension: "png", size: 1024 }))
          .setDescription("Bot Avatar"),
      );

    // 2. SEPARATOR: A native visual dividing line
    const divider = new SeparatorBuilder().setDivider(true);

    // 3. TEXT DISPLAY: Standard text block
    const bodyText = new TextDisplayBuilder().setContent(
      "With **Containers**, you don't use arbitrary 'Embed Fields'. Instead, you stack native components—like `SectionBuilder`, `SeparatorBuilder`, and Action Rows—in whatever order you like!",
    );

    // 4. ACTION ROWS: Buttons and Dropdowns
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("v2_primary")
        .setLabel("Primary")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚡"),
      new ButtonBuilder()
        .setLabel("Docs")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/developers/docs/components/using-message-components"),
    );

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("v2_select")
        .setPlaceholder("Choose a native option...")
        .addOptions(
          { label: "Option 1", description: "First choice", value: "opt1", emoji: "1️⃣" },
          { label: "Option 2", description: "Second choice", value: "opt2", emoji: "2️⃣" },
        ),
    );

    // 5. FOOTER: Using smaller markdown (-#) inside a TextDisplay
    const footerText = new TextDisplayBuilder().setContent(
      "-# Built with ContainerBuilder, SectionBuilder, and TextDisplayBuilder",
    );

    // ============ ASSEMBLE CONTAINER ============
    // Notice how we stack everything exactly in the order we want it to display
    const container = new ContainerBuilder()
      .setAccentColor(colors.primary) //
      .addSectionComponents(headerSection)
      .addSeparatorComponents(divider)
      .addTextDisplayComponents(bodyText)
      .addActionRowComponents(buttonRow, selectRow)
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(footerText);

    // ============ SEND REPLY ============
    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2, // Forces Discord to use the new UI engine
      allowedMentions: { repliedUser: false }, //
    });
  },
};
