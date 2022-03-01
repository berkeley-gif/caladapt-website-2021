import { derived } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";
import {
  DEFAULT_FLOOD_SCENARIO,
  DEFAULT_TIME_FRAME,
  FLOOD_SCENARIOS,
  TIME_PERIODS,
  DATA_LAYERS,
  DEFAULT_MAP_BBOX,
  DEFAULT_MAP_VIEW,
  RASTER_METADATA,
  DL_Cosmos,
  DL_Calflod5m,
  DL_Calflod50m,
} from "./_constants";

export const floodScenarioStore = makeCustomWritableStore(
  DEFAULT_FLOOD_SCENARIO,
  {
    name: "floodScenarioStore",
    getters: [
      {
        name: "floodScenario",
        getter: ($s) => FLOOD_SCENARIOS.find((d) => d.id === $s),
      },
    ],
  }
);

export const timeFrameStore = makeCustomWritableStore(DEFAULT_TIME_FRAME, {
  name: "timeFrameStore",
  getters: [
    {
      name: "timeFrame",
      getter: ($s) => TIME_PERIODS.find((d) => d.id === $s),
    },
    {
      name: "tfParsed",
      getter: ($s) => JSON.parse($s),
    },
    {
      name: "tfTileLabel",
      getter: ($s) => JSON.parse($s).join("-"),
    },
  ],
});

export const mapBBoxStore = makeCustomWritableStore(DEFAULT_MAP_BBOX, {
  name: "mapBBoxStore",
  getters: [
    {
      name: "bbox",
      getter: ($s) => $s.map((d) => +d.toFixed(4)),
    },
  ],
});

export const mapViewStore = makeCustomWritableStore(DEFAULT_MAP_VIEW, {
  name: "mapViewStore",
  getters: [
    {
      name: "zoom",
      getter: ($s) => $s.zoom,
    },
    {
      name: "lat",
      getter: ($s) => $s.lat,
    },
    {
      name: "lng",
      getter: ($s) => $s.lng,
    },
    {
      name: "bbox",
      getter: ($s) => $s.map((d) => +d.toFixed(4)),
    },
  ],
  updaters: [
    {
      name: "setZoom",
      update: (store) => (value) =>
        store.update((s) => {
          console.log(s);
          s.zoom = value;
          return s;
        }),
    },
    {
      name: "setBBox",
      update: (store) => (value) =>
        store.update((s) => {
          s.bbox = value;
          return s;
        }),
    },
  ],
});

const getTileUrls = (value) =>
  Array.isArray(value) && value.length ? value.map((d) => d.tileurl) : [];

const getSlugs = (value) =>
  Array.isArray(value) && value.length ? value.map((d) => d.slug) : [];

export const dataLayersStore = makeCustomWritableStore(DATA_LAYERS, {
  name: "dataLayersStore",
  getters: [
    {
      name: `dl_${DL_Cosmos}`,
      getter: ($s) => $s.find((d) => d.id === DL_Cosmos),
    },
    {
      name: `dl_${DL_Calflod5m}`,
      getter: ($s) => $s.find((d) => d.id === DL_Calflod5m),
    },
    {
      name: `dl_${DL_Calflod50m}`,
      getter: ($s) => $s.find((d) => d.id === DL_Calflod50m),
    },
  ],
  updaters: [
    {
      name: "setChecked",
      update:
        (store) =>
        ({ id, checked }) =>
          store.update((s) =>
            s.map((d) => (d.id === id ? { ...d, checked } : d))
          ),
    },
    {
      name: "setDisabled",
      update:
        (store) =>
        ({ id, disabled }) =>
          store.update((s) =>
            s.map((d) => (d.id === id ? { ...d, disabled } : d))
          ),
    },
    {
      name: "update",
      update:
        (store) =>
        ({ id, ...rest }) =>
          store.update((s) =>
            s.map((d) => (d.id === id ? { ...d, ...rest } : d))
          ),
    },
  ],
});

export const rasterMetaDataStore = makeCustomWritableStore(RASTER_METADATA, {
  name: "rasterMetaDataStore",
  getters: [
    {
      name: `tiles_${DL_Cosmos}`,
      getter: ($s) => getTileUrls($s[DL_Cosmos]),
    },
    {
      name: `tiles_${DL_Calflod5m}`,
      getter: ($s) => getTileUrls($s[DL_Calflod5m]),
    },
    {
      name: `tiles_${DL_Calflod50m}`,
      getter: ($s) => getTileUrls($s[DL_Calflod50m]),
    },
  ],
  updaters: [
    {
      name: `set_${DL_Cosmos}`,
      update: (store) => (data) =>
        store.update((s) => ({ ...s, cosmos: data })),
    },
    {
      name: `set_${DL_Calflod5m}`,
      update: (store) => (data) =>
        store.update((s) => ({ ...s, calflod5m: data })),
    },
    {
      name: `set_${DL_Calflod50m}`,
      update: (store) => (data) =>
        store.update((s) => ({ ...s, calflod50m: data })),
    },
    {
      name: "update",
      update: (store) => (key, values) =>
        store.update((s) => ({ ...s, [key]: values })),
    },
  ],
});

// augments the data layers store to include the map tile urls and slugs for each layer
// from the rasterMetaDataStore
export const dataLayersAugmentedStore = Object.defineProperty(
  derived(
    [dataLayersStore, rasterMetaDataStore],
    ([$dataLayersStore, $rasterMetaDataStore]) =>
      $dataLayersStore.map((data) => {
        const tileUrls = getTileUrls($rasterMetaDataStore[data.id]);
        const slugs = getSlugs($rasterMetaDataStore[data.id]);
        return {
          ...data,
          ...(!tileUrls.length && {
            checked: false,
            disabled: true,
          }),
          ...(tileUrls.length && {
            disabled: false,
          }),
          tileUrls,
          slugs,
        };
      })
  ),
  "name",
  {
    get: function () {
      return "dataLayersAugmentedStore";
    },
  }
);
