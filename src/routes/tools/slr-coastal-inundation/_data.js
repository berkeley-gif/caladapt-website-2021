import bboxPolygon from "@turf/bbox-polygon";
import config from "~/helpers/api-config";
import { calflod50mLookup } from "./_data-layers-lookup";

const {
  env: {
    production: { tileURL, apiEndpoint },
  },
} = config;

const getTileUrlCalflod3d = (source, scenario, timeFrame, region, color) =>
  `${tileURL}/${source}_${scenario}_${timeFrame}_mosaic_${region}/{z}/{x}/{y}.png?style=${color}`;

const getTileUrlCalflod3d50m = (timeFrame, scenario, color = "rsblue") => {
  const id = `${timeFrame}|${scenario}`;
  const slug = calflod50mLookup.get(id);
  if (slug) {
    return `${tileURL}/${slug}_mosaic_sfbay/{z}/{x}/{y}.png?style=${color}`;
  } else {
    console.error(`calflod3d-tfs-50m tile slug not found for ${id}`);
    return "";
  }
};

// https://api.cal-adapt.org/tiles/cosmosflooding_2080-2100_max_mosaic_sfbay/{z}/{x}/{y}.png
const getTileUrlCosmos = (timeFrame, scenario, color = "rsgreen") =>
  `${tileURL}/cosmosflooding_${timeFrame}_${scenario}_mosaic_sfbay/{z}/{x}/{y}.png?style=${color}`;

export const getTileUrl = (source, scenario, timeFrame, ...rest) => {
  switch (source) {
    case "cosmos":
      return getTileUrlCosmos(timeFrame, scenario);
    case "calflod3dtfs":
      return getTileUrlCalflod3d(source, scenario, timeFrame, ...rest);
    case "calflod3dtfs_50m":
      return getTileUrlCalflod3d50m(timeFrame, scenario);
    default:
      throw new Error("unrecognized slr data source");
  }
};

export const getRasterMetaData = (scenario, source, timeFrame, geom) =>
  fetch(
    `${apiEndpoint}/rstores/?slug=${source}&slug=${scenario}&slug=${timeFrame}&bbintersects=${encodeURIComponent(
      geom
    )}`
  )
    .then((res) => res.json())
    .catch((error) => console.error(error));

export const toBBoxPolygon = (coords) => {
  if (Array.isArray(coords) || coords.length) {
    try {
      return bboxPolygon(coords);
    } catch (error) {
      console.error(error);
    }
  }
};
