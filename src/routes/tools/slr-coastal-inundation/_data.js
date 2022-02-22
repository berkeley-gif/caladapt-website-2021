import config from "~/helpers/api-config";

const {
  env: {
    production: { apiEndpoint },
  },
} = config;

// queries the cal-adapt API for slr sources raster metadata
// this metadata includes the tile URLs used to render map tiles
export const getRasterMetaData = (scenario, source, timeFrame, bbox) =>
  fetch(
    `${apiEndpoint}/rstores/?slug=${source}&slug=${scenario}&slug=${timeFrame}&bbintersects=${encodeURIComponent(
      bbox
    )}`
  ).then((res) => res.json());

// fetches geojson files from static/data that are used for displaying tile indexes & centroids
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
