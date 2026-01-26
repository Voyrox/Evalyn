const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const Session = require("../NeuralNetwork/Session");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("model")
    .setDescription("Loads a previously saved model state"),
  async run(client, interaction) {
    await interaction.deferReply();

    const history = Session.history();
    if (history.length === 0) {
      await interaction.followUp('No models have been saved.');
      return;
    }

    const Fields = [];
    const Modelbtns = []

    history.slice(0, 5).forEach((modelData, index) => {
      Fields.unshift({ name: `Model ${index + 1}`, value: `\`\`\`ID: ${modelData.id}\nAccuracy: ${modelData.accuracy}\`\`\`` });
      Modelbtns.unshift(
        new ButtonBuilder()
          .setCustomId(`changeModel_${modelData.id}`)
          .setLabel(`Select Model ${index + 1}`)
          .setStyle(ButtonStyle.Success),
      );
    });

    const row = new ActionRowBuilder()
    .addComponents(Modelbtns);

    const embed = new EmbedBuilder()
      .setTitle('Saved Models')
      .setDescription('Below are the saved models with their IDs.')
      .setColor(0x0099ff)
      .addFields(Fields);

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('changeModel')
          .setLabel('Change Model')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.followUp({ embeds: [embed], components: [buttons,  row] });

    const collectorFilter = i => {
      i.deferUpdate();
      return i.customId.startsWith('changeModel_') && i.user.id === interaction.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.Button, time: 45000 });

    collector.on('collect', i => {
      const customIdParts = i.customId.split('_');
      if (customIdParts[0] === 'changeModel') {
        const modelId = customIdParts[1];
        Session.setAsCurrentModel(modelId)
        console.log(`Model ID: ${modelId}`);
      }
    });

  }
};
