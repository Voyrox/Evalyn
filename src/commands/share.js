const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("share")
    .setDescription("Allows the users to share their model + training data")
    .addBooleanOption(option =>
      option.setName("export")
        .setDescription("Export the data into a url")
        .setRequired(false))
    .addStringOption(option =>
      option.setName('import')
        .setDescription('Import the data via shared url')
        .setRequired(false)),
  async run(client, interaction) {
    await interaction.deferReply();

    const exportdata = interaction.options.getBoolean("export");
    const importdata = interaction.options.getString("import");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('URL Link')
          .setStyle(ButtonStyle.Link)
          .setURL('https://example.com'),
        new ButtonBuilder()
          .setLabel('Get Support')
          .setStyle(ButtonStyle.Link)
          .setURL('https://example.com/support')
      );

    if (exportdata === true) {
      const exportEmbed = new EmbedBuilder()
        .setColor(0x4CAF50)
        .setTitle("✔️ Export Successful!")
        .setDescription("Here's your export data: \n It expires in 48 hours!")
      await interaction.editReply({ embeds: [exportEmbed], components: [row] });
      return;
    }
    
    if (typeof importdata === "string") {
      if (!/(http(s?)):\/\//i.test(importdata)) {
        const invalidImport = new EmbedBuilder()
          .setColor(0xffc107)
          .setTitle("⚠️ Invalid URL provided!")
          .setDescription("Please provide a valid URL for import.");
        await interaction.editReply({ embeds: [invalidImport] });
        return;
      }

      const importEmbed = new EmbedBuilder()
        .setColor(0xFFC107)
        .setTitle("⏳ Importing...")
        .setDescription("Data is being imported.")
        .addFields({ name: "Progress", value: "0%" })
        .setFooter({ text: "🔄 Please wait." });

      const sentMessage = await interaction.editReply({ embeds: [importEmbed] });

      for (let percent = 10; percent <= 100; percent += 10) {
        importEmbed.fields[0].value = `${percent}%`;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sentMessage.edit({ embeds: [importEmbed] });
      }
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Share")
      .setDescription("Use the options: `export: true` to export, or `import: <url>` to import.");

    await interaction.editReply({ embeds: [embed] });
  }
};
