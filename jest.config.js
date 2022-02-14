const { defaults } = require("jest-config");

module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": "svelte-jester",
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, "svelte"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
