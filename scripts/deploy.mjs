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
 * --build: (optional) disables sapper export when set to false
 *
 * Examples (assumes script is being run from root of repository):
 *
 * npm run deploy -- --help
 * npm run deploy -- --location=dev
 * npm run deploy -- --location=beta --transfer=false
 * npm run deploy -- --location=prod --build=false
 */

import { $ } from "zx";

const SAPPER_EXPORT_DIR = "__sapper__/export/";
const USER = "gitdev";
const BASE_URI = "cal-adapt.org";
const DEPLOY_URI = `api.${BASE_URI}`;
const DIR = "/var/www/";

let allowTransfer = true;
let allowBuild = true;

main();

async function main() {
  // zx shorthand for parsing script arguments in the form of `--foo=bar`
  // eslint-disable-next-line no-undef
  const { location, help, transfer, build } = argv;

  if (help) {
    return await usage();
  }

  if (!location) {
    return await usage("Missing argument for --location");
  }

  if (transfer === "false") {
    allowTransfer = false;
  }

  if (build === "false") {
    allowBuild = false;
  }

  try {
    await handleLocation(location);
  } catch (error) {
    handleError(error);
  }
}

async function usage(message) {
  if (message) {
    console.log(message);
  }
  console.log(
    "Usage: zx deploy.mjs --location=<string> --transfer=<boolean> --build=<boolean>"
  );
  console.log(
    "--location is required; --transfer & --build are optional, both default to true"
  );
  await $`exit 0`;
}

async function handleError(error) {
  console.log(`Error: ${error.message}`);
  process.exit(1);
}

async function sapperExport() {
  if (allowBuild) {
    await $`npm run export`;
  } else {
    console.log("not running sapper export via --build option");
    return Promise.resolve();
  }
}

async function transfer(subdomain) {
  if (allowTransfer) {
    const domain = subdomain ? `${subdomain}.${BASE_URI}` : BASE_URI;
    await $`rsync \
      -avz ${SAPPER_EXPORT_DIR} \
      --delete \
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
  if (!process.env.NETLIFY_AUTH_TOKEN || !process.env.NETLIFY_ALIAS) {
    throw new Error(
      "Deploying to Netlify requires setting environment variables: $NETLIFY_AUTH_TOKEN and $NETLIFY_ALIAS"
    );
  }

  try {
    await sapperExport();
    await $`netlify deploy \
      --dir ${SAPPER_EXPORT_DIR}\
      --auth $NETLIFY_AUTH_TOKEN\
      --alias $NETLIFY_ALIAS\
      --open`;
    await $`exit 0`;
  } catch (error) {
    handleError(error);
  }
}

async function deployProd() {
  try {
    await sapperExport();
    await transfer();
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
  process.env.NODE_ENV = "production";
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
