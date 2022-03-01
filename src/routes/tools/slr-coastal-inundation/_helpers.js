import { DEFAULT_INITIAL_CONFIG, DATA_LAYERS } from "./_constants";

export function getInitialConfig(urlParams = {}) {
  if (!Object.keys(urlParams).length) {
    return DEFAULT_INITIAL_CONFIG;
  }
  let { dataLayers: layerStr, ...rest } = urlParams;
  const dataLayers = validateLayers(layerStr);
  return {
    ...DEFAULT_INITIAL_CONFIG,
    ...rest,
    dataLayers,
  };
}

function validateLayers(str) {
  if (!str || typeof str !== "string" || !str.length) {
    return DATA_LAYERS.slice();
  }
  const layerIds = new Set(str.split(","));
  return DATA_LAYERS.map(({ id, ...rest }) => ({
    ...rest,
    id,
    checked: layerIds.has(id),
  }));
}
