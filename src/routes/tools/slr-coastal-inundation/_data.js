import bboxPolygon from "@turf/bbox-polygon";
import config from "~/helpers/api-config";

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
  if (Array.isArray(coords) && coords.length) {
    return bboxPolygon(coords);
  }
};

export const getGeoJson = (ids) => {
  if (Array.isArray(ids) && ids.length) {
    return Promise.all(
      ids.map(async (layer) =>
        Object.assign(
          { id: layer },
          await fetch(`/data/${layer}-dissolved.geojson`).then((res) =>
            res.json()
          )
        )
      )
    );
  }
  return fetch(`/data/${ids}-centroids.geojson`).then((res) => res.json());
};
