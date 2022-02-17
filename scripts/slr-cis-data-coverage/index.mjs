#!/usr/bin/env zx

/**
 * slr-cis-data-coverage.js
 * Handles creating the geojson for the data coverage map for the SLR CIS tool
 */

import { $, fetch } from "zx";
import mapshaper from "mapshaper";

const COSMOS = "cosmos";
const CALFLOD5m = "calflod3dtfs_5m";
const CALFLOD50m = "calflod3dtfs_50m";
const API_BASE_URL = "https://api.cal-adapt.org/api/rstores";
const LAYER_PARAMS = new Map([
  [COSMOS, "slug=cosmosflooding"],
  [CALFLOD5m, "slug=calflod3dtfs_5m&slug=tile&xpixsize=5"],
  [CALFLOD50m, "slug=calflod3dtfs_50m"],
]);
const OUTFILE_PATH = "../../static/data";

main();

async function main() {
  const data = await setLayersData();
  const processed = processLayers(data);
  await dissolveLayers(processed);
  await makeCentroids(processed);
  await $`exit 0`;
}

async function handleResponse(response) {
  const json = await response.json();
  if (json && Array.isArray(json.results) && json.results.length) {
    return json.results;
  } else {
    throw new Error("Empty API response, aborting...");
  }
}

async function getData(name) {
  try {
    if (name === CALFLOD5m) {
      // not all individual 5m tiles are in the API so we use a local geojson instead
      return require("./calflod3d_5m_tile_index.json");
    } else if (name === CALFLOD50m) {
      // not all individual 5m tiles are in the API so we use a local geojson instead
      return require("./calflod3d_50m_tile_index.json");
    } else {
      return handleResponse(
        await fetch(`${API_BASE_URL}/?${LAYER_PARAMS.get(name)}&pagesize=125`)
      );
    }
  } catch (error) {
    handleError(null, error);
  }
}

async function setLayersData() {
  const dataLayers = new Map();
  for (let name of LAYER_PARAMS.keys()) {
    dataLayers.set(name, await getData(name));
  }
  return dataLayers;
}

function dedupeGeoms(geoms) {
  function reducer(acc, cur) {
    const { geom } = cur;
    acc.add(JSON.stringify(geom));
    return acc;
  }
  const deduped = geoms.reduce(reducer, new Set());
  return Array.from(deduped).map((str) => JSON.parse(str));
}

function toGeoJson(geometries) {
  return {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: geometries.map((geometry) => ({
      type: "Feature",
      geometry,
    })),
  };
}

function processLayers(layers) {
  const processed = new Map();
  for (let [name, values] of layers.entries()) {
    if (name !== CALFLOD5m && name !== CALFLOD50m) {
      values = toGeoJson(dedupeGeoms(values));
    }
    processed.set(name, values);
  }
  return processed;
}

async function dissolveLayers(layers) {
  for (let [name, values] of layers.entries()) {
    const filename = `${name}-dissolved.geojson`;
    const cmd = `-i input.geojson 
      -proj init=EPSG:4326 EPSG:4326
      -explode
      -dissolve2
      -o geojson-type=FeatureCollection 
      precision=0.001
      ${OUTFILE_PATH}/${filename}`;
    try {
      await mapshaper.runCommands(cmd, { "input.geojson": values });
    } catch (error) {
      await handleError(filename, error);
    }
    console.log(`wrote ${filename}`);
  }
}

async function makeCentroids(layers) {
  const filename = `${CALFLOD5m}-centroids.geojson`;
  const values = layers.get(CALFLOD5m);
  const cmd = `-i input.geojson
    -proj init=EPSG:4326 EPSG:4326
    -explode
    -points centroid
    -o geojson-type=FeatureCollection 
    drop-table
    precision=0.001
    ${OUTFILE_PATH}/${filename}
  `;
  try {
    await mapshaper.runCommands(cmd, { "input.geojson": values });
  } catch (error) {
    await handleError(filename, error);
  }
  console.log(`wrote ${filename}`);
}

async function handleError(filename, error) {
  if (filename) {
    console.log(`error writing ${filename}: `, error);
  } else {
    console.log(`error: `, error);
  }
  await $`exit 1`;
}
