/**
 * API Config module.
 * @module api_config
 * @todo switch out ecoengine urs with caladapt urls
 */

const development = {
  apiEndpoint: 'https://a1.cal-adapt.org/api',
  tileURL: 'https://a1.cal-adapt.org/api/tiles',
  vtileURL: 'https://a1.cal-adapt.org/api/vtiles',
};

const production = {
  endpoint: 'https://api.cal-adapt.org',
  apiEndpoint: 'https://api.cal-adapt.org/api',
  tileURL: 'https://api.cal-adapt.org/api/tiles',
  vtileURL: 'https://api.cal-adapt.org/api/vtiles',
};

const config = {
  env: {
    development,
    production,
  },
};

export default config;
