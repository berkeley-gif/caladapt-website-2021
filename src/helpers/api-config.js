/**
 * API Config module.
 * @module api_config
 */

const development = {
  apiEndpoint: "https://a1.cal-adapt.org/api",
  tileURL: "https://a1.cal-adapt.org/api/tiles",
  vtileURL: "https://a1.cal-adapt.org/api/vtiles",
};

const production = {
  endpoint: "https://api.cal-adapt.org",
  apiEndpoint: "https://api.cal-adapt.org/api",
  tileURL: "https://api.cal-adapt.org/api/tiles",
  vtileURL: "https://api.cal-adapt.org/api/vtiles",
};

const config = {
  env: {
    development,
    production,
  },
};

export default config;
