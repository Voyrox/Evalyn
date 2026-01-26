const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("predict")
    .setDescription("predict a response")
    .addStringOption(option =>
      option.setName('input')
        .setDescription('enter what you want to be predicted')
        .setRequired(true)),
  async run(client, interaction, ctx) {

    const text = interaction.options.getString("input");

    await interaction.deferReply();
    const data = await Predict(text)
    const config = ctx?.config?.get ? ctx.config.get() : null;

    const buttons = [];

    if (config?.threads === true) {
      buttons.push(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Open in thread")
          .setCustomId("openinthread")
          .setEmoji("🧵")
      );
    }

    if (config?.selflearning === true) {
      buttons.unshift(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(`Correct`)
          .setCustomId('correctguess')
          .setEmoji("✅"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel('Incorrect')
          .setCustomId('incorrectguess')
          .setEmoji('❌')
      );
    }
    
    const row = new ActionRowBuilder().addComponents(buttons);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Prediction")
      .setDescription(`>>> ${data.response}`)
      .addFields(
        { name: "Intent", value: String(data.predicted || "Unknown"), inline: true },
        {
          name: "Confidence",
          value:
            typeof data.confidence === "number" ? `${data.confidence}%` : "Unknown",
          inline: true,
        },
        {
          name: "Input",
          value: `\`\`\`${text.length > 250 ? `${text.slice(0, 247)}...` : text}\`\`\``,
          inline: false,
        }
      );

    const components = buttons.length > 0 ? [row] : [];
    await interaction.editReply({ embeds: [embed], components });
  }
};
