import bboxPolygon from "@turf/bbox-polygon";
import config from "~/helpers/api-config";
import { logException } from "~/helpers/logging";

const {
  env: {
    production: { apiEndpoint },
  },
} = config;

export const getRasterMetaData = (scenario, source, timeFrame, geom) =>
  fetch(
    `${apiEndpoint}/rstores/?slug=${source}&slug=${scenario}&slug=${timeFrame}&bbintersects=${encodeURIComponent(
      geom
    )}`
  ).then((res) => res.json());

export const toBBoxPolygon = (coords) => {
  if (Array.isArray(coords) || coords.length) {
    try {
      return bboxPolygon(coords);
    } catch (error) {
      console.error(error);
      logException(error);
    }
  }
};
