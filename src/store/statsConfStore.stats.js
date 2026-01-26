const { readStatsConf, writeStatsConf } = require("./statsConfStore");

function incrementStats(patch) {
  const data = readStatsConf();
  const next = { ...data.Stats };

  for (const [key, value] of Object.entries(patch || {})) {
    const cur = Number(next[key] || 0);
    const inc = Number(value || 0);
    next[key] = cur + inc;
  }

  data.Stats = next;
  writeStatsConf(data);
  return next;
}

module.exports = { incrementStats };
