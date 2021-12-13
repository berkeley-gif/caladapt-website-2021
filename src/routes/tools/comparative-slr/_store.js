import { makeCustomWritableStore } from "../_common/stores";
import {
  DEFAULT_FLOOD_SCENARIO,
  DEFAULT_TIME_FRAME,
  FLOOD_SCENARIOS,
  TIME_PERIODS,
  DATA_LAYERS,
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
