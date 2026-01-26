const fs = require("fs");
const path = require("path");

function loadEvents(client, eventsDir, ctx) {
  if (!fs.existsSync(eventsDir)) {
    throw new Error(`Events directory not found: ${eventsDir}`);
  }

  const files = fs
    .readdirSync(eventsDir)
    .filter((f) => f.endsWith(".js"))
    .sort();

  for (const file of files) {
    const fullPath = path.resolve(eventsDir, file);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const event = require(fullPath);

    const name = event?.name;
    const execute = event?.execute;
    const once = Boolean(event?.once);

    if (!name || typeof execute !== "function") {
      console.warn(`[events] Skipping ${file} (expected { name, execute() })`);
      continue;
    }

    if (once) {
      client.once(name, (...args) => execute(...args, ctx));
    } else {
      client.on(name, (...args) => execute(...args, ctx));
    }
  }
}

module.exports = { loadEvents };
