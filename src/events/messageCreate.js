const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
    name: 'messageCreate',
    execute: async (message, ctx) => {
        let client = message.client;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const config = ctx?.config?.get ? ctx.config.get() : null;
        if (config?.enabled === false) return;
        if (config?.channel && message.channel.id !== config.channel) return;

        if (!message.content) return;

        const data = await Predict(message.content)

        
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
  
      const input = String(message.content || "");
      const inputPreview = input.length > 250 ? `${input.slice(0, 247)}...` : input;

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
          { name: "Input", value: `\`\`\`${inputPreview}\`\`\``, inline: false }
        );
  
      const components = buttons.length > 0 ? [row] : [];
      await message.reply({ embeds: [embed], components });

    }
};
