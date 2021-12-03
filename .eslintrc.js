module.exports = {
  extends: ["eslint:recommended", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: ["svelte3"],
  rules: {
    "no-unused-vars": 1,
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  settings: {
    "svelte3/ignore-styles": () => true,
  },
  globals: {
    ga: "readonly",
  },
};
