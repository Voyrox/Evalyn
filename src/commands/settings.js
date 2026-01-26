const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("manage the options of the bot")
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel to listen to, otherwise listens to all')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('clear_channel')
        .setDescription('Clear the channel filter (listen to all)')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('selflearning')
        .setDescription('enable/disable user feedback on predictions')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('threads')
        .setDescription('enable/disable the use of threads to respond to predictions')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('enable')
        .setDescription('enable/disable responding to messages')
        .setRequired(false)),
  async run(client, interaction, ctx) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    const channel = interaction.options.getChannel("channel");
    const clearChannel = interaction.options.getBoolean("clear_channel");
    const selflearning = interaction.options.getBoolean("selflearning");
    const threads = interaction.options.getBoolean("threads");
    const enabled = interaction.options.getBoolean("enable");

    if (
      channel === null &&
      clearChannel === null &&
      selflearning === null &&
      enabled === null &&
      threads === null
    ) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You must change at least one setting.")
        .setColor(0xff0000);
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    await interaction.deferReply();

    const patch = {};
    if (clearChannel === true) {
      patch.channel = null;
    } else if (channel) {
      patch.channel = channel.id;
    }
    if (enabled !== null) patch.enabled = enabled;
    if (selflearning !== null) patch.selflearning = selflearning;
    if (threads !== null) patch.threads = threads;

    const nextConfig = ctx?.config?.update ? ctx.config.update(patch) : null;

    const embed = new EmbedBuilder()
      .setTitle("Bot Settings")
      .setDescription(
        `Configuration options for the bot:\n` +
          `Listening Channel: ${nextConfig?.channel ? `<#${nextConfig.channel}>` : "All"}\n` +
          `Self Learning: ${nextConfig?.selflearning ? "Enabled" : "Disabled"}\n` +
          `Threads: ${nextConfig?.threads ? "Enabled" : "Disabled"}\n` +
          `Responding to Messages: ${nextConfig?.enabled ? "Enabled" : "Disabled"}`
      )
      .setColor(0x00FF00);

    await interaction.editReply({ embeds: [embed] });
  }
};
