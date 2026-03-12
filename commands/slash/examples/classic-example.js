const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
} = require("discord.js");
const colors = require("../../../utils/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("classic-example")
    .setDescription("Show a classic Components V1 interface")
    .setDMPermission(true),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle("This is the Title")
      .setURL("https://ThisisTitleURL.com")
      .setAuthor({
        name: "This is the Author",
        iconURL:
          "https://cdn.discordapp.com/attachments/1441125868713021524/1441445053380821002/20251121_203724.png?ex=6921d1d1&is=69208051&hm=caba4ec253e0629a7e88570a89ed5f0309a58405a995f82db5ef67afa3dd87e6&",
        url: "https://ThisisAuthorURL.com",
      })
      .setDescription("This is the Description")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1441125868713021524/1441450586623971450/20251121_205948.png?ex=6921d6f8&is=69208578&hm=c264fc0b59a81e1022f3b8945753798053c5e9a62ff620aba1fe3d83ac7a09a3&",
      )
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "Inline field title 1", value: "Some value here", inline: true },
        { name: "Inline field title 2", value: "Some value here", inline: true },
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1441125868713021524/1441451576559665192/20251121_210347.png?ex=6921d7e4&is=69208664&hm=d5d02ee158b8481b1e32333581aa04a91ebe8a293727b06aa72da1a9d97ca5b4&",
      )
      .setFooter({
        text: "This is the Footer",
        iconURL:
          "https://cdn.discordapp.com/attachments/1441125868713021524/1441452019901534389/20251121_210534.png?ex=6921d84e&is=692086ce&hm=afc55080a9ac7e8f107bf67098724e7020deaafd6895dd827fbcefca5dfd5231&",
      })
      .setTimestamp();

    // Action Row 1: Buttons
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("classic_primary")
        .setLabel("Primary")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚡"),
      new ButtonBuilder()
        .setCustomId("classic_secondary")
        .setLabel("Secondary")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🎯"),
      new ButtonBuilder()
        .setCustomId("classic_success")
        .setLabel("Success")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅"),
      new ButtonBuilder()
        .setCustomId("classic_danger")
        .setLabel("Danger")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🚨"),
    );

    // Action Row 2: Link & Disabled Buttons
    const linkRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Link")
        .setStyle(ButtonStyle.Link)
        .setURL("https://thisisthelinkbutton.com")
        .setEmoji("📚"),
      new ButtonBuilder()
        .setCustomId("classic_disabled")
        .setLabel("Disabled Button")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    // Action Row 3: Select Menu
    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("classic_select")
        .setPlaceholder("Choose an option...")
        .addOptions(
          {
            label: "Option 1",
            description: "This is the first option",
            value: "opt1",
            emoji: "1️⃣",
          },
          {
            label: "Option 2",
            description: "This is the second option",
            value: "opt2",
            emoji: "2️⃣",
          },
        ),
    );

    // Send the reply
    await interaction.reply({
      embeds: [embed],
      components: [buttonRow, linkRow, selectRow],
    });
  },
};
