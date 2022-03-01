import { DEFAULT_INITIAL_CONFIG, DATA_LAYERS } from "./_constants";

export function getInitialConfig(urlParams = {}) {
  if (!Object.keys(urlParams).length) {
    return DEFAULT_INITIAL_CONFIG;
  }
  const { layers, ...rest } = urlParams;
  const dataLayers = validateLayers(layers);
  return {
    ...DEFAULT_INITIAL_CONFIG,
    ...rest,
    dataLayers,
  };
}

function validateLayers(str) {
  if (!str || typeof str !== "string" || str.length) {
    return DATA_LAYERS.slice();
  }
  const layerIds = new Set(str.split(","));

  return DATA_LAYERS.map(({ id, ...rest }) => {
    if (layerIds.has(id)) {
      return {
        id,
        ...rest,
        checked: true,
      };
    }
    return { id, ...rest };
  });
}
