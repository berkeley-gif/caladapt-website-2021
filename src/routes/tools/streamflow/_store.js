import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
} from "./_constants";

// List of climvars used in Annual Averages Tool
export const climvarList = climvars
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
  .map((d) => {
    const title = `${d.label}`;
    return { ...d, title };
  });

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMATE_VARIABLE);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) => {
        return climvarList.find((d) => d.id === $store);
      });
    },
  };
})();

export const indicatorList = CLIMATE_INDICATORS;

export const indicatorStore = (() => {
  const store = writable(DEFAULT_CLIMATE_INDICATOR);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived(store, ($store) => {
        return indicatorList.find((d) => d.id === $store);
      });
    },
  };
})();
