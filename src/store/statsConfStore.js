const fs = require("fs");
const path = require("path");

const STATS_CONF_PATH = path.join(__dirname, "..", "database", "StatsConf.json");

const DEFAULT_STATS_CONF = {
  Stats: {
    Correct: 0,
    False: 0,
    GPU: 0,
  },
  Config: {
    selflearning: false,
    enabled: true,
    threads: true,
    channel: null,
  },
};

function readStatsConf() {
  try {
    const raw = fs.readFileSync(STATS_CONF_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_STATS_CONF,
      ...parsed,
      Stats: { ...DEFAULT_STATS_CONF.Stats, ...(parsed?.Stats || {}) },
      Config: { ...DEFAULT_STATS_CONF.Config, ...(parsed?.Config || {}) },
    };
  } catch {
    return { ...DEFAULT_STATS_CONF };
  }
}

function writeStatsConf(data) {
  fs.writeFileSync(STATS_CONF_PATH, JSON.stringify(data, null, 2));
}

function getConfig() {
  return readStatsConf().Config;
}

function updateConfig(patch) {
  const current = readStatsConf();
  current.Config = { ...current.Config, ...patch };
  writeStatsConf(current);
  return current.Config;
}

module.exports = {
  STATS_CONF_PATH,
  readStatsConf,
  writeStatsConf,
  getConfig,
  updateConfig,
};
