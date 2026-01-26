const {
  EmbedBuilder,
  PermissionsBitField,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("train")
    .setDescription("retrain the ai"),
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    await interaction.deferReply();

    const tf = require("@tensorflow/tfjs-node");
    const trainAI = require("../NeuralNetwork/train");
    const Session = require("../NeuralNetwork/Session");

    let progressMessage = null;
    let lastBucket = -1;
    let trainingComplete = false;

    function generateProgressBar(percentage) {
      const filled = "■";
      const empty = "□";
      const progressBarLength = 20;
      const progressBarFullLength = Math.floor(
        (progressBarLength * percentage) / 100
      );
      const progressBarEmptyLength = progressBarLength - progressBarFullLength;

      const progressBar = [
        filled.repeat(progressBarFullLength),
        empty.repeat(progressBarEmptyLength),
      ].join("");

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel(`${percentage}%`)
          .setCustomId('percentagetraining')
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(progressBar)
          .setCustomId('percentagebartraining')
          .setDisabled(true)
      );
      return row;
    }

    
    const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel(`Save`)
        .setCustomId('savemodel')
        .setEmoji("✅")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Delete")
        .setCustomId('deletemodel')
        .setEmoji("🗑️")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Re-Train")
        .setCustomId('retrainmodel')
        .setEmoji("⚙️")
        .setDisabled(false)
    );

    async function optionembd(message, acc){
      const accLabel = typeof acc === "string" ? acc : `${acc}%`;
      const successEmbed = new EmbedBuilder()
      .setTitle("Success")
      .setDescription(
        `The AI has been retrained successfully.\n` +
          `**Accuracy:** ${accLabel}\n\n` +
          `Use **Save** to persist this model to disk, or **Delete** to discard it.`
      )
      .setColor(0x00FF00);

       await message.edit({
        embeds: [successEmbed],
        components: [row2],
      });
    }

    let AccData = 'Default'

       const updateProgressBar = async(progressData) => {
         let { epoch, totalEpochs, accuracy, loss, elapsedTime, estimatedTime } = progressData;

         AccData = accuracy;

         const percent = Math.floor((epoch / totalEpochs) * 100);
         const bucket = Math.floor(percent / 10) * 10;
         const percentageLabel = bucket;

         if (bucket === lastBucket && epoch !== totalEpochs) {
           return;
         }

         lastBucket = bucket;
         const progressBar = generateProgressBar(percentageLabel);

         const Rembed = new EmbedBuilder()
           .setTitle("Retraining the AI")
           .setDescription(
             `Progress: ${percentageLabel}%\n` +
               `Epoch: ${epoch}/${totalEpochs}\n` +
               `Accuracy: ${accuracy}\n` +
               `Loss: ${loss}\n` +
               `Elapsed Time: ${elapsedTime}\n` +
               `ETA: ${estimatedTime}`
           )
           .setColor(0xffff00);

         if (!progressMessage) {
           progressMessage = await interaction.editReply({
             embeds: [Rembed],
             components: [progressBar],
           });
         } else {
           await progressMessage.edit({
             embeds: [Rembed],
             components: [progressBar],
           });
         }

         if (!trainingComplete && epoch === totalEpochs) {
           trainingComplete = true;
           await optionembd(progressMessage, accuracy);
         }
       };

       const Model = await trainAI(updateProgressBar);
       Session.addModel(Model, AccData);
  }
};
