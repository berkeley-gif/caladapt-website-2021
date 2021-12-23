import { makeCustomWritableStore } from "../_common/stores";
import {
  DEFAULT_FLOOD_SCENARIO,
  DEFAULT_TIME_FRAME,
  FLOOD_SCENARIOS,
  TIME_PERIODS,
  DATA_LAYERS,
  DEFAULT_MAP_BBOX,
  DEFAULT_RASTER_TILES,
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

export const dataLayersStore = makeCustomWritableStore(DATA_LAYERS, {
  name: "dataLayersStore",
  getters: [
    {
      name: "dlCosmos",
      getter: ($s) => $s.find((d) => d.id === DL_Cosmos),
    },
    {
      name: "dlCalflod5m",
      getter: ($s) => $s.find((d) => d.id === DL_Calflod5m),
    },
    {
      name: "dlCalflod50m",
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

export const mapBBoxStore = makeCustomWritableStore(DEFAULT_MAP_BBOX, {
  name: "mapBBoxStore",
  getters: [
    {
      name: "bbox",
      getter: ($s) => $s.map((d) => +d.toFixed(4)),
    },
  ],
});

export const rasterTilesStore = makeCustomWritableStore(DEFAULT_RASTER_TILES, {
  name: "rasterTilesStore",
  getters: [
    {
      name: "cosmosTiles",
      getter: ($s) => $s[DL_Cosmos],
    },
    {
      name: "calflod5mTiles",
      getter: ($s) => $s[DL_Calflod5m],
    },
    {
      name: "calflod50mTiles",
      getter: ($s) => $s[DL_Calflod50m],
    },
  ],
  updaters: [
    {
      name: "setCosmos",
      update: (store) => (tiles) =>
        store.update((s) => ({ ...s, cosmos: tiles })),
    },
    {
      name: "setCalflod5m",
      update: (store) => (tiles) =>
        store.update((s) => ({ ...s, calflod5m: tiles })),
    },
    {
      name: "setCalflod50m",
      update: (store) => (tiles) =>
        store.update((s) => ({ ...s, calflod50m: tiles })),
    },
    {
      name: "update",
      update: (store) => (key, values) =>
        store.update((s) => ({ ...s, [key]: values })),
    },
  ],
});
