import { makeCustomWritableStore } from "../_common/stores";
import {
  DEFAULT_FLOOD_SCENARIO,
  DEFAULT_TIME_FRAME,
  DEFAULT_DATA_LAYERS,
  FLOOD_SCENARIOS,
  TIME_PERIODS,
  DATA_LAYERS,
} from "./_constants";

export const floodScenarioStore = makeCustomWritableStore(
  DEFAULT_FLOOD_SCENARIO,
  {
    name: "floodScenarioStore",
    getters: [
      {
        name: "scenario",
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
      name: "parsed",
      getter: ($s) => JSON.parse($s),
    },
  ],
});

export const dataLayersStore = makeCustomWritableStore(DATA_LAYERS, {
  name: "dataLayersStore",
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
  ],
});
