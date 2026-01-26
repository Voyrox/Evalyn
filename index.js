require("dotenv").config();

const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const Session = require("./src/NeuralNetwork/Session");
const { createClient } = require("./src/client");
const { createContext } = require("./src/context");
const { loadCommands } = require("./src/loaders/commands");
const { loadEvents } = require("./src/loaders/events");

async function main() {
  if (!process.env.TOKEN) {
    throw new Error("Missing env var TOKEN (set it in .env)");
  }

  console.log("Loading sentence encoder...");
  console.time("sentence-encoder");
  await Session.loadSentenceEncoder();
  console.timeEnd("sentence-encoder");

  const ctx = createContext();

  const client = createClient();
  client.ctx = ctx;

  const commandsDir = path.join(__dirname, "src", "commands");
  const eventsDir = path.join(__dirname, "src", "events");

  const slashcommands = loadCommands(client, commandsDir, ctx);
  loadEvents(client, eventsDir, ctx);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  client.once("ready", async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: slashcommands,
      });
      console.log(`${client.user.username} Activated!`);
    } catch (error) {
      console.error(
        "Failed to register application commands:",
        JSON.stringify(slashcommands, null, 2)
      );
      console.error(error);
    }
  });

  await client.login(process.env.TOKEN);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
