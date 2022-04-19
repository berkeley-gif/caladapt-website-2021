/**
 * Mapbox layers module.
 * @module leaflet-layers
 */

// Expressions
const translinesExpr = ["to-number", ["get", "kV_Sort"]];
// MW attribute missing in geojson, check with CEC
//const powerplantsExpr = ["to-number", ["get", "MW"]];
const cesScore = ["get", "ces_3_0_percentile_range"];

export default [
  {
    id: "locagrid",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "LOCA Grid (1/16° - Approximately 6 km)",
      placeholder: "address",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/locagrid/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "locagrid",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "counties",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "County",
      nameField: "name",
      placeholder: "county name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/counties/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "county",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "censustracts",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Census Tract",
      nameField: "tract",
      placeholder: "tract id",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/censustracts/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "censustract",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "hydrounits",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Watershed (HUC10)",
      nameField: "name",
      placeholder: "watershed name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/hydrounits/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "hydrologicunit",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "place",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Place (Incorporated & Census Designated, 2015)",
      nameField: "name",
      placeholder: "city name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/place/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "place",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "cdistricts",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Congressional District",
      nameField: "cd114fp",
      placeholder: "congressional district number",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/cdistricts/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "congressionaldistrict",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "irwm",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Integrated Regional Water Management Region",
      nameField: "name",
      placeholder: "region name or number",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/irwm/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "irwmregion",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "wecc-load-area",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "SWITCH Load Zone",
      nameField: "name",
      placeholder: "zone name",
    },
    source: {
      type: "vector",
      tiles: [
        "https://api.cal-adapt.org/vtiles/wecc-load-area/{z}/{x}/{y}.pbf",
      ],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "weccloadarea",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "climregions",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "Western Region Climate Center Climate Region",
      nameField: "name",
      placeholder: "region name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/climregions/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "climateregion",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "ccc4aregions",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "California 4th Climate Assessment Region",
      nameField: "name",
      placeholder: "region name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/ccc4aregions/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "ccc4aregion",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "states",
    type: "line",
    metadata: {
      group: "Boundaries",
      title: "State",
      nameField: "name",
      placeholder: "state name",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/states/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "state",
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-opacity": 0.75,
      "line-color": "rgb(107, 231, 186)",
      "line-width": 1,
    },
  },
  {
    id: "translines",
    type: "line",
    metadata: {
      group: "Electric Infrastructure",
      title: "Transmission Line",
    },
    source: {
      type: "geojson",
      data: "https://opendata.arcgis.com/datasets/260b4513acdb4a3a8e4d64e69fc84fee_0.geojson",
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-opacity": 0.5,
      "line-color": [
        "case",
        [">=", translinesExpr, 345],
        "rgb(189, 0, 38)",
        [">=", translinesExpr, 220],
        "rgb(240, 59, 32)",
        [">=", translinesExpr, 110],
        "rgb(253, 141, 60)",
        "rgb(254, 204, 92)",
      ],
      "line-width": [
        "case",
        [">=", translinesExpr, 345],
        4,
        [">=", translinesExpr, 220],
        3,
        [">=", translinesExpr, 110],
        2,
        1,
      ],
    },
  },
  {
    id: "substations",
    type: "symbol",
    metadata: {
      group: "Electric Infrastructure",
      title: "Substations",
    },
    source: {
      type: "geojson",
      data: "https://opendata.arcgis.com/datasets/7f37f2535d3144e898a53b9385737ee0_0.geojson",
    },
    layout: {
      "icon-image": "square-stroked-11",
    },
    paint: {
      "icon-color": "red",
    },
  },
  {
    id: "powerplants",
    type: "circle",
    metadata: {
      group: "Electric Infrastructure",
      title: "Power Plant",
    },
    source: {
      type: "geojson",
      data: "https://opendata.arcgis.com/datasets/4a702cd67be24ae7ab8173423a768e1b_0.geojson",
    },
    paint: {
      "circle-radius": 8,
      "circle-opacity": 0.7,
      "circle-color": "rgb(171, 72, 33)",
      "circle-stroke-color": "#B42222",
    },
  },
  {
    id: "calenviroscreen",
    type: "fill",
    metadata: {
      group: "Environmental",
      title: "CalEnviroScreen 3.0",
      nameField: "tract",
    },
    source: {
      type: "vector",
      tiles: ["https://api.cal-adapt.org/vtiles/censustracts/{z}/{x}/{y}.pbf"],
      minzoom: 1,
      maxzoom: 20,
    },
    "source-layer": "censustract",
    paint: {
      "fill-opacity": 0.4,
      "fill-color": [
        "match",
        cesScore,
        "95-100% (highest scores)",
        "rgb(255, 34, 0)",
        "90-95%",
        "rgb(255, 34, 0)",
        "85-90%",
        "rgb(255, 98, 0)",
        "81-85%",
        "rgb(255, 98, 0)",
        "75-80%",
        "rgb(255, 145, 0)",
        "65-70%",
        "rgb(255, 187, 0)",
        "60-65%",
        "rgb(255, 187, 0)",
        "55-60%",
        "rgb(255, 234, 0)",
        "50-55%",
        "rgb(255, 234, 0)",
        "45-50%",
        "rgb(223, 235, 0)",
        "40-45%",
        "rgb(223, 235, 0)",
        "35-40%",
        "rgb(164, 196, 0)",
        "30-35%",
        "rgb(164, 196, 0)",
        "25-30%",
        "rgb(107, 161, 0)",
        "20-25%",
        "rgb(107, 161, 0)",
        "15-20%",
        "rgb(60, 128, 0)",
        "10-15%",
        "rgb(60, 128, 0)",
        "5-10%",
        "rgb(0, 97, 0)",
        "1-5% (lowest scores)",
        "rgb(0, 97, 0)",
        "rgb(255,255,255)",
      ],
    },
  },
  {
    id: "hadisdstations",
    type: "circle",
    metadata: {
      group: "stations",
      title: "Weather Stations",
    },
    source: {
      type: "geojson",
      data: "https://api.cal-adapt.org/api/hadisdstations/?pagesize=39&format=json",
    },
    paint: {
      "circle-radius": 6,
      "circle-color": "#04797c",
      "circle-opacity": 0.8,
      "circle-stroke-color": "#fff",
      "circle-stroke-width": 2,
    },
  },
  // Drainage basins are stored as polygon features in the API but need to represented as
  // point locations in the Streamflow tool. Using the `symbol` type in the Mapbox layer definition
  // creates an Mapbox overlay that represents the center of the drainage basin as points
  {
    id: "evtlocations",
    type: "symbol",
    metadata: {
      group: "stations",
      title: "Central Valley Subbasins",
    },
    source: {
      type: "geojson",
      data: "https://api.cal-adapt.org/api/evtlocations/?pagesize=11&search=River&srs=4326&format=json",
    },
    layout: {
      "icon-image": "circle-15",
      "icon-allow-overlap": true,
    },
  },
];
