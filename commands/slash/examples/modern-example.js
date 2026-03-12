const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  SeparatorBuilder,
  ThumbnailBuilder,
  MessageFlags,
} = require("discord.js");
const colors = require("../../../utils/colors"); //

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modern-example")
    .setDescription("Show a true Components V2 interface")
    .setDMPermission(true), //

  async execute(interaction, client) {
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

    const divider = new SeparatorBuilder().setDivider(true);

    const bodyText = new TextDisplayBuilder().setContent(
      "With **Containers**, you don't use arbitrary 'Embed Fields'. Instead, you stack native components—like `SectionBuilder`, `SeparatorBuilder`, and Action Rows—in whatever order you like!",
    );

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

    const footerText = new TextDisplayBuilder().setContent(
      "-# Built with ContainerBuilder, SectionBuilder, and TextDisplayBuilder",
    );

    const container = new ContainerBuilder()
      .setAccentColor(colors.primary) //
      .addSectionComponents(headerSection)
      .addSeparatorComponents(divider)
      .addTextDisplayComponents(bodyText)
      .addActionRowComponents(buttonRow, selectRow)
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(footerText);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};
