const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  InteractionType,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");

const path = require("path");

const { incrementStats } = require("../store/statsConfStore.stats");

function getIntentFromEmbed(embed) {
  const fields = Array.isArray(embed?.fields) ? embed.fields : [];
  const intentField = fields.find((f) => f?.name === "Intent");
  if (intentField?.value) return String(intentField.value).replace(/`/g, "").trim();

  if (embed?.title) return String(embed.title).replace(/\*|`/g, "").trim();
  return "Prediction";
}

function disableAllButtons(components) {
  return (components || []).map((row) => {
    const nextRow = ActionRowBuilder.from(row);
    nextRow.setComponents(
      (row.components || []).map((c) => ButtonBuilder.from(c).setDisabled(true))
    );
    return nextRow;
  });
}

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction, ctx) => {
		let client = interaction.client;
		if (interaction.type == InteractionType.ApplicationCommand) {
			if (interaction.user.bot) return;
			try {
				const command = await client.slashcommands.get(interaction.commandName)
				if (!command) return;
				await command.run(client, interaction, ctx)
			} catch(e) {
				console.log(e);
				interaction.reply({
					content: "A problem was encountered while running the command! Please try again.",
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		if (interaction.isButton && interaction.isButton()) {
			if (interaction.user.bot) return;
			try {
				const config = ctx?.config?.get ? ctx.config.get() : null;
				const customId = interaction.customId;

				if (customId === "openinthread") {
					if (config?.threads !== true) {
						await interaction.reply({
							content: "Threads are disabled. Enable them via /settings.",
							flags: MessageFlags.Ephemeral,
						});
						return;
					}

					await interaction.deferReply({ flags: MessageFlags.Ephemeral });
					const msg = interaction.message;
					if (!msg || !msg.startThread) {
						await interaction.editReply("Can't start a thread from this message.");
						return;
					}

					if (msg.channel && typeof msg.channel.isThread === "function" && msg.channel.isThread()) {
						await interaction.editReply("You're already in a thread.");
						return;
					}

					if (msg.hasThread && msg.thread) {
						await interaction.editReply(`Thread already exists: ${msg.thread}`);
						return;
					}

					const firstEmbed = msg.embeds?.[0];
					const intent = getIntentFromEmbed(firstEmbed);
					const name = `Prediction: ${intent}`.slice(0, 100);

					const thread = await msg.startThread({
						name,
						autoArchiveDuration: 60,
					});

					if (firstEmbed) {
						await thread.send({ embeds: [EmbedBuilder.from(firstEmbed)] });
					}

					await interaction.editReply(`Opened thread: ${thread}`);
					return;
				}

				if (customId === "correctguess" || customId === "incorrectguess") {
					await interaction.deferUpdate();
					incrementStats({
						Correct: customId === "correctguess" ? 1 : 0,
						False: customId === "incorrectguess" ? 1 : 0,
					});

					const nextComponents = disableAllButtons(interaction.message.components);
					await interaction.message.edit({ components: nextComponents });
					await interaction.followUp({
						content: "Thanks for the feedback!",
						flags: MessageFlags.Ephemeral,
					});
					return;
				}

				if (customId === "savemodel") {
					if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
						await interaction.reply({
							content: "You need ManageGuild to save the model.",
							flags: MessageFlags.Ephemeral,
						});
						return;
					}

					await interaction.deferReply({ flags: MessageFlags.Ephemeral });
					const tf = require("@tensorflow/tfjs-node");
					const Session = require("../NeuralNetwork/Session");
					const current = await Session.getModel();
					const modelDir = path.resolve(__dirname, "..", "model");
					await current.save(tf.io.fileSystem(modelDir));
					await interaction.editReply("Saved model to disk (`src/model/`).");
					return;
				}

				if (customId === "deletemodel") {
					if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
						await interaction.reply({
							content: "You need ManageGuild to discard the model.",
							flags: MessageFlags.Ephemeral,
						});
						return;
					}

					await interaction.deferReply({ flags: MessageFlags.Ephemeral });
					const Session = require("../NeuralNetwork/Session");
					await Session.resetToDiskModel();

					const nextComponents = disableAllButtons(interaction.message.components);
					await interaction.message.edit({ components: nextComponents });
					await interaction.editReply("Discarded in-memory model and reverted to the saved disk model.");
					return;
				}

				if (customId === "retrainmodel") {
					await interaction.reply({
						content: "Use /train to retrain again (retrain via button not implemented yet).",
						flags: MessageFlags.Ephemeral,
					});
					return;
				}
			} catch(e) {
				console.log(e)
				if (interaction.deferred || interaction.replied) {
					interaction
						.followUp({
							content: "Button failed. Please try again.",
							flags: MessageFlags.Ephemeral,
						})
						.catch(() => {});
				} else {
					interaction
						.reply({
							content: "Button failed. Please try again.",
							flags: MessageFlags.Ephemeral,
						})
						.catch(() => {});
				}
			}
		}
	}
}
