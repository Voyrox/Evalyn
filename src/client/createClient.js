const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.User,
      Partials.GuildMember,
      Partials.Reaction,
    ],
  });

  client.commands = new Collection();
  client.slashcommands = new Collection();
  client.commandaliases = new Collection();

  return client;
}

module.exports = { createClient };
