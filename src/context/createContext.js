const { getConfig, updateConfig } = require("../store/statsConfStore");

function createContext() {
  let config = getConfig();

  return {
    config: {
      get() {
        return config;
      },
      reload() {
        config = getConfig();
        return config;
      },
      update(patch) {
        config = updateConfig(patch);
        return config;
      },
    },
  };
}

module.exports = { createContext };
