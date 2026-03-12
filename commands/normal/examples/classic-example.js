const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const colors = require("../../../utils/colors");

module.exports = {
  name: "classic-example",
  description: "Show a classic Components V1 interface",
  aliases: ["v1", "classic"],
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(colors.primary) // Color
      .setTitle("This is the Title") // Title
      .setURL("https://ThisisTitleURL.com") // Title URL
      .setAuthor({
        name: "This is the Author",
        iconURL:
          "https://cdn.discordapp.com/attachments/1441125868713021524/1441445053380821002/20251121_203724.png?ex=6921d1d1&is=69208051&hm=caba4ec253e0629a7e88570a89ed5f0309a58405a995f82db5ef67afa3dd87e6&",
        url: "https://ThisisAuthorURL.com",
      }) // Author | Author Icon | Author URL
      .setDescription("This is the Description") // Description
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1441125868713021524/1441450586623971450/20251121_205948.png?ex=6921d6f8&is=69208578&hm=c264fc0b59a81e1022f3b8945753798053c5e9a62ff620aba1fe3d83ac7a09a3&",
      ) // Thumbnail
      .addFields(
        { name: "Regular field title", value: "Some value here" }, // Regular Field
        {
          name: "Inline field title 1",
          value: "Some value here",
          inline: true,
        },
        {
          name: "Inline field title 2",
          value: "Some value here",
          inline: true,
        }, // Inlined Field
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1441125868713021524/1441451576559665192/20251121_210347.png?ex=6921d7e4&is=69208664&hm=d5d02ee158b8481b1e32333581aa04a91ebe8a293727b06aa72da1a9d97ca5b4&",
      ) // Image
      .setFooter({
        text: "This is the Footer", // Footer
        iconURL:
          "https://cdn.discordapp.com/attachments/1441125868713021524/1441452019901534389/20251121_210534.png?ex=6921d84e&is=692086ce&hm=afc55080a9ac7e8f107bf67098724e7020deaafd6895dd827fbcefca5dfd5231&", // Footer Icon
      })
      .setTimestamp(); // Timestamp

    // ============ ACTION ROW 1: BUTTONS ============
    // ActionRowBuilder holds up to 5 interactive components (buttons/select menus)
    const buttonRow = new ActionRowBuilder().addComponents(
      // Primary style: Blurple color, for main actions
      new ButtonBuilder()
        .setCustomId("classic_primary") // Unique ID for interaction handler
        .setLabel("Primary") // Text on button
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚡"), // Optional emoji

      // Secondary style: Gray color, for secondary actions
      new ButtonBuilder()
        .setCustomId("classic_secondary")
        .setLabel("Secondary")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🎯"),

      // Success style: Green color, for positive actions
      new ButtonBuilder()
        .setCustomId("classic_success")
        .setLabel("Success")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅"),

      // Danger style: Red color, for destructive actions
      new ButtonBuilder()
        .setCustomId("classic_danger")
        .setLabel("Danger")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🚨"),
    );

    // ============ ACTION ROW 2: LINK & DISABLED ============
    // Link buttons don't have customId, they open external URLs
    // Disabled buttons cannot be clicked
    const linkRow = new ActionRowBuilder().addComponents(
      // Link style: Opens external URL, has no customId
      new ButtonBuilder()
        .setLabel("Link")
        .setStyle(ButtonStyle.Link)
        .setURL("https://thisisthelinkbutton.com")
        .setEmoji("📚"),

      // Disabled button: Grayed out and unclickable
      new ButtonBuilder()
        .setCustomId("classic_disabled")
        .setLabel("Disabled Button")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    // ============ ACTION ROW 3: SELECT MENU ============
    // StringSelectMenuBuilder creates a dropdown with options
    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("classic_select") // ID for handling selection
        .setPlaceholder("Choose an option...") // Hint text when closed
        .addOptions(
          {
            label: "Option 1", // Display text
            description: "This is the first option", // Subtitle
            value: "opt1", // Internal value sent to handler
            emoji: "1️⃣", // Optional emoji
          },
          {
            label: "Option 2",
            description: "This is the second option",
            value: "opt2",
            emoji: "2️⃣",
          },
        ),
    );

    // ============ SEND REPLY ============
    // Reply with embed and all component rows
    // allowedMentions: { repliedUser: false } = don't ping the user
    await message.reply({
      embeds: [embed], // Array of embeds (max 10)
      components: [buttonRow, linkRow, selectRow], // Array of action rows (max 5)
      allowedMentions: { repliedUser: false },
    });
  },
};
