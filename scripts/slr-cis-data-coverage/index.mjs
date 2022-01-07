#!/usr/bin/env zx

/**
 * slr-cis-data-coverage.js
 * Handles creating the geojson for the data coverage map for the SLR CIS tool
 */

 import { $ } from "zx";
 import fetch from "node-fetch";

 const API_BASE_URL = "https://api.cal-adapt.org/api/rstores";
 
 const LAYER_PARAMS = new Map([
   ["cosmos", "name=cosmos+flooding+mosaic"],
   ["calflod3d_5m", "slug=calflod&slug=tile&xpixsize=5"],
   ["calflod3d_50m", "slug=calflod3dtfs_50m&slug=mosaic&xpixsize=50"]
 ]);

 main();

 async function main() {
  const response = await fetch(`${API_BASE_URL}/?${LAYER_PARAMS.get("cosmos")}&pagesize=125`);
  const data = await response.json();
  console.log(data);
 }