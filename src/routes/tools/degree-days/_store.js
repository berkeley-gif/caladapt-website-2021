import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  DEFAULT_THRESHOLD_DEGREES,
  DEFAULT_FREQUENCY_CODE,
} from "./_constants";

// List of climvars used in Degree Days Tool
export const climvarList = climvars
  .filter(({ id }) => id === "tasmax")
  .map((d) => ({ ...d, title: `Degree Days ${d.label}` }));

// Q: should this even be a store if it's only ever a single value and doesn't change?
export const climvarStore = (() => {
  const store = writable("tasmax");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) => {
        const selected = climvarList.find(({ id }) => id === $store);
        return selected;
      });
    },
  };
})();

export const indicatorsList = climvars
  .filter(({ id }) => ["cdd", "hdd"].includes(id))
  .map((d) => ({ ...d, title: `Degree Days ${d.label}` }));

export const indicatorsStore = (() => {
  const store = writable("cdd");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived(store, ($store) => {
        const selected = indicatorsList.find(({ id }) => id === $store);
        return selected;
      });
    },
  };
})();

export const thresholdStore = writable(DEFAULT_THRESHOLD_DEGREES);

export const frequencyStore = writable(DEFAULT_FREQUENCY_CODE);
