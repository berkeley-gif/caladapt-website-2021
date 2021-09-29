#!/usr/bin/env zx

/**
 * deploy.js
 * Handles transpiling and deploying source code.
 *
 * Available options:
 * --help: prints script usage instructions.
 * --location: (required) determines env variables and where compiled
 *    assets should be rsync'd to.
 * --transfer: (optional) disables rsync when set to false.
 *
 * Examples (assumes script is being run from root of repository):
 *
 * npm run deploy -- --help
 * npm run deploy -- --location=dev
 * npm run deploy -- --location=beta --transfer=false
 */

import { $ } from "zx";

const SAPPER_EXPORT_DIR = "__sapper__/export/";
const USER = "gitdev";
const BASE_URI = "cal-adapt.org";
const DEPLOY_URI = `api.${BASE_URI}`;
const DIR = "/var/www/";

let allowTransfer = true;

main();

async function main() {
  // zx shorthand for parsing script arguments in the form of `--foo=bar`
  // eslint-disable-next-line no-undef
  const { location, help, transfer } = argv;

  if (help) {
    return await usage();
  }

  if (!location) {
    return await usage("Missing argument for --location");
  }

  if (transfer === "false") {
    allowTransfer = false;
  }

  await handleLocation(location);
}

async function usage(message) {
  if (message) {
    console.log(message);
  }
  console.log("Usage: zx deploy.mjs --location=<string> --transfer=<boolean>");
  await $`exit 0`;
}

async function handleError(error) {
  console.log(error.message);
  await $`exit 1`;
}

async function sapperExport() {
  await $`npm run export`;
}

async function transfer(subdomain) {
  if (allowTransfer) {
    const domain = subdomain ? `${subdomain}.${BASE_URI}` : BASE_URI;
    await $`rsync \
      -avz ${SAPPER_EXPORT_DIR} \
      ${USER}@${DEPLOY_URI}:${DIR}${domain}/`;
  } else {
    console.log("transfer disabled via --transfer option, exiting");
    return Promise.resolve();
  }
}

async function deployBeta() {
  try {
    await sapperExport();
    await transfer("beta");
    await $`exit 0`;
  } catch (error) {
    handleError(error);
  }
}

async function deployDev() {
  try {
    await sapperExport();
    await transfer("dev");
    await $`exit 0`;
  } catch (error) {
    handleError(error);
  }
}

async function deployNetlify() {
  try {
    await sapperExport();
    await $`netlify deploy --dir=${SAPPER_EXPORT_DIR}`;
    await $`exit 0`;
  } catch (error) {
    handleError(error);
  }
}

async function deployProd() {
  try {
    await sapperExport();
    await transfer("prod");
    await $`exit 0`;
  } catch (error) {
    handleError(error);
  }
}

function setEnvBeta() {
  process.env.NODE_ENV = "production";
  process.env.DEPLOY = "beta";
}

function setEnvDev() {
  process.env.NODE_ENV = "production";
  process.env.DEPLOY = "dev";
}

function setEnvProd() {
  process.env.NODE_ENV = "production";
  process.env.DEPLOY = "prod";
}

function setEnvNetlify() {
  process.env.NODE_ENV = "development";
  process.env.DEPLOY = "netlify";
}

async function handleLocation(location) {
  switch (location) {
    case "beta":
      setEnvBeta();
      await deployBeta();
      break;
    case "dev":
      setEnvDev();
      await deployDev();
      break;
    case "netlify":
      setEnvNetlify();
      await deployNetlify();
      break;
    case "prod":
      setEnvProd();
      await deployProd();
      break;
    default:
      usage(
        `Unrecognized --location param: ${location}.\nValid params are: beta, prod, dev, netlify`
      );
  }
}
