module.exports = {
  extends: ["eslint:recommended", "prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    allowImportExportEverywhere: true,
    requireConfigFile: false,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    "jest/globals": true,
  },
  plugins: ["svelte3", "jest"],
  rules: {
    "no-unused-vars": 1,
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
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
    gtag: "readonly",
  },
};
