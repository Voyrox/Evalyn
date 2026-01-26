const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Session = require("../NeuralNetwork/Session");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Shows the current status of the AI model—whether it's training, idle, or evaluating"),
  async run(client, interaction) {

    await interaction.deferReply();

    const model = await Session.getModel();
    const weights = model.getWeights();
    const weightShapes = weights.map(w => w.shape.join(" x ")).join(", ");
    const layerDetails = model.layers
      .map((layer) => {
        const shape = Array.isArray(layer.outputShape)
          ? layer.outputShape.join(" x ")
          : String(layer.outputShape);
        return `${layer.name}: ${shape}`;
      })
      .join("\n");

    const truncatedLayerDetails = layerDetails.length > 1024 ? `${layerDetails.substring(0, 1020)}...` : layerDetails;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('AI Model:')
      .setDescription(`**Layers:** \n ${truncatedLayerDetails} \n **Weights Shape:** \n ${weightShapes}`)
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });
  }
};
