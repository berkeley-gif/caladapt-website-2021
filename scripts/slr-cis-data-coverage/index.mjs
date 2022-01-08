#!/usr/bin/env zx

/**
 * slr-cis-data-coverage.js
 * Handles creating the geojson for the data coverage map for the SLR CIS tool
 */

import { $ } from "zx";
import fetch from "node-fetch";
import mapshaper from "mapshaper";

const API_BASE_URL = "https://api.cal-adapt.org/api/rstores";
const LAYER_PARAMS = new Map([
  ["cosmos", "name=cosmos+flooding+mosaic"],
  ["calflod3d_5m", "slug=calflod&slug=tile&xpixsize=5"],
  ["calflod3d_50m", "slug=calflod3dtfs_50m&slug=mosaic&xpixsize=50"],
]);
const OUTFILE_PATH = "../../static/data";

main();

async function main() {
  const data = await setLayersData();
  const processed = processLayers(data);
  await dissolveLayers(processed);
  await $`exit 0`;
}

async function getData(name) {
  try {
    if (name === "calflod3d_5m") {
      // not all individual 5m tiles are in the API so we use a local geojson instead
      return require("./calflod3d_5m_tile_index.json");
    } else {
      return await (
        await fetch(`${API_BASE_URL}/?${LAYER_PARAMS.get(name)}&pagesize=125`)
      ).json();
    }
  } catch (error) {
    console.log(error);
    await $`exit 1`;
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
    if (name !== "calflod3d_5m") {
      values = toGeoJson(dedupeGeoms(values.results));
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
      console.log(`error writing ${filename}: `, error);
      await $`exit 1`;
    }
    console.log(`wrote ${filename}`);
  }
}
