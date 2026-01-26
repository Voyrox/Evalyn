const fs = require("fs");
const path = require("path");

function loadCommands(client, commandsDir, ctx) {
  if (!fs.existsSync(commandsDir)) {
    throw new Error(`Commands directory not found: ${commandsDir}`);
  }

  const files = fs
    .readdirSync(commandsDir)
    .filter((f) => f.endsWith(".js"))
    .sort();

  const slashcommands = [];

  for (const file of files) {
    const fullPath = path.resolve(commandsDir, file);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const command = require(fullPath);

    const name = command?.data?.name;
    const hasData = command?.data && typeof command.data.toJSON === "function";
    const hasRun = typeof command?.run === "function";

    if (!hasData || !hasRun || !name) {
      console.warn(
        `[commands] Skipping ${file} (expected { data: SlashCommandBuilder, run() })`
      );
      continue;
    }

    slashcommands.push(command.data.toJSON());
    client.slashcommands.set(name, command);
  }

  return slashcommands;
}

module.exports = { loadCommands };
