import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import scenarios from "~/helpers/climate-scenarios";
import {
  CLIMATE_VARIABLES,
  DEFAULT_SELECTED_CLIMVAR,
  CLIMATE_SCENARIOS,
  DEFAULT_SELECTED_SCENARIO,
  TIME_PERIODS,
  DEFAULT_SELECTED_PERIOD,
} from "./_constants";

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
        const selected = climvars.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

// List of scenarios used in Extended Drought Tool
export const scenarioList = scenarios
  .filter((d) => CLIMATE_SCENARIOS.includes(d.id))
  .map((d) => {
    return { ...d, label: d.labelLong };
  });

export const scenarioStore = (() => {
  const store = writable(DEFAULT_SELECTED_SCENARIO);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get scenario() {
      return derived(store, ($store) => {
        const selected = scenarios.find((d) => d.id === $store);
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
