import { writable, derived } from "svelte/store";
import { timeDay } from "d3-time";
import { mean } from "d3-array";

import climvars from "~/helpers/climate-variables";
import scenarios from "~/helpers/climate-scenarios";
import {
  CLIMATE_VARIABLES,
  DEFAULT_SELECTED_CLIMVAR,
  CLIMATE_SCENARIOS,
  DEFAULT_SELECTED_SCENARIO,
  DEFAULT_MODEL,
  TIME_PERIODS,
  DEFAULT_SELECTED_PERIOD,
  DEFAULT_YEARS_BEFORE,
  DEFAULT_YEARS_AFTER,
  DEFAULT_BASELINE,
} from "./_constants";
import { dataStore } from "../_common/stores";

// List of climvars used in Extended Drought Tool
export const climvarList = climvars
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
  .map((d) => {
    return { ...d, title: d.label };
  });

export const climvarStore = (() => {
  const store = writable(DEFAULT_SELECTED_CLIMVAR);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) => {
        const selected = climvarList.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

// List of scenarios used in Extended Drought Tool
export const scenarioList = scenarios
  .filter((d) => CLIMATE_SCENARIOS.includes(d.id))
  .map((d) => {
    const [start, end] = d.labelLong.match(/\d{4}/g);
    return { ...d, label: d.labelLong, start, end };
  });

export const scenarioStore = (() => {
  const store = writable(DEFAULT_SELECTED_SCENARIO);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get scenario() {
      return derived(store, ($store) => {
        const selected = scenarioList.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

export const periodStore = (() => {
  const store = writable(DEFAULT_SELECTED_PERIOD);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get period() {
      return derived(store, ($store) => {
        const selected = TIME_PERIODS.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

// DERIVED STORES
// Baseline store
export const droughtDataStore = derived(
  [dataStore, scenarioStore, periodStore],
  ([$dataStore, $scenarioStore, $periodStore]) => {
    if (!$dataStore || !$scenarioStore) return null;
    const scenario = scenarioList.find((d) => d.id === $scenarioStore);
    const start = new Date(
      Date.UTC(+scenario.start - DEFAULT_YEARS_BEFORE, 0, 1)
    );
    const end = new Date(Date.UTC(+scenario.end + DEFAULT_YEARS_AFTER, 11, 31));

    const envelope = $dataStore
      .filter(({ id }) => id.includes("range"))
      .map((series) => {
        const values = series.values.filter((d) => {
          const { date } = d;
          if (date >= start && date <= end) {
            return true;
          }
          return false;
        });
        return { ...series, values };
      });

    const models = $dataStore
      .filter(({ id }) => id === DEFAULT_MODEL)
      .map((series) => {
        if ($periodStore === "wateryear") {
          return { ...series, values: series.values.slice(1, -1) };
        } else {
          return series;
        }
      });

    return [...envelope, ...models];
  }
);

export const observedDataStore = derived(
  [dataStore, scenarioStore, periodStore],
  ([$dataStore, $scenarioStore, $periodStore]) => {
    if (!$dataStore || !$scenarioStore) return null;

    const observed = $dataStore.filter(
      ({ id }) => id !== DEFAULT_MODEL && !id.includes("range")
    );

    return [...observed];
  }
);
