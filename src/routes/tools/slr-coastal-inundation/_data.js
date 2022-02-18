import config from "~/helpers/api-config";

const {
  env: {
    production: { apiEndpoint },
  },
} = config;

export const getRasterMetaData = (scenario, source, timeFrame, bbox) =>
  fetch(
    `${apiEndpoint}/rstores/?slug=${source}&slug=${scenario}&slug=${timeFrame}&bbintersects=${encodeURIComponent(
      bbox
    )}`
  ).then((res) => res.json());

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
