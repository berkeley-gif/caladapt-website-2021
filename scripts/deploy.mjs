#!/usr/bin/env zx

/**
 * deploy.js
 * Handles transpiling and deploying code based on environment configuration.
 */

import {$} from 'zx'

const SAPPER_EXPORT_DIR = "__sapper__/export/";
const USER = "gitdev";
const BASE_URI = "cal-adapt.org";
const DEPLOY_URI = `api.${BASE_URI}`;
const DIR = "/var/www/";

main();

async function main() {
  // zx shorthand for parsing script arguments in the form of `--foo=bar`
  // eslint-disable-next-line no-undef
  const { location } = argv;

  if (!location) {
    usage("Missing argument for --location");
  }

  handleLocation(location);
};

async function usage(message) {
  if (message) {
    console.log(message);
  }
  console.log("Usage: `zx deploy.mjs --location=<deploy>`");
  await $`exit 0`;
}

async function sapperExport() {
  await $`npm run export`;
}

async function transfer(subdomain) {
  const domain = subdomain ? `${subdomain}.${BASE_URI}` : BASE_URI;
  await $`rsync \
    -avz ${SAPPER_EXPORT_DIR} \
    ${USER}@${DEPLOY_URI}:${DIR}${domain}/`;
}

async function deployDev() {
  try {
    process.env.NODE_ENV = 'production';
    await sapperExport();
    await transfer("dev");
    await $`exit 0`;
  } catch (error) {
    console.log(error.message);
    await $`exit 1`;
  }
}

async function deployBeta() {
  try {
    process.env.FEATURE_FLAGS_BETA = 'true';
    await sapperExport();
    await transfer("beta");
    await $`exit 0`;
  } catch (error) {
    console.log(error.message);
    await $`exit 1`;
  }
}

async function deployProd() {
  try {
    process.env.NODE_ENV = 'production';
    await sapperExport();
    await transfer("prod");
    await $`exit 0`;
  } catch (error) {
    console.log(error.message);
    await $`exit 1`;
  }
}

async function deployNetlify() {
  try {
    process.env.NODE_ENV = 'development';
    await sapperExport();
    await $`netlify deploy --dir=${SAPPER_EXPORT_DIR}`;
    await $`exit 0`;
  } catch (error) {
    console.log(error.message);
    await $`exit 1`;
  }
}

async function handleLocation(location) {
  switch(location) {
    case "beta":
      await deployBeta();
      break;
    case "prod":
      await deployProd();
      break;
    case "netlify":
      await deployNetlify();
      break;
    case "dev":
      await deployDev();
      break;
    default:
      usage(`Unrecognized --location param: ${location}.\nValid params are: beta, prod, dev, netlify`);
  }
}