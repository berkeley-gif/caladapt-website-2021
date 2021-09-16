import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_INDICATORS,
  CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_THRESHOLD_DEGREES,
  DEFAULT_FREQUENCY_CODE,
  DEFAULT_SELECTED_MONTHS,
} from "./_constants";

// List of climvars used in Degree Days Tool
export const climvarList = climvars
  .filter(({ id }) => id === CLIMATE_VARIABLE)
  .map((d) => ({ ...d, title: `Degree Days ${d.label}` }));

// Q: should this even be a store if it's only ever a single value and doesn't change?
export const climvarStore = (() => {
  const store = writable(CLIMATE_VARIABLE);
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
  .filter(({ id }) => CLIMATE_INDICATORS.includes(id))
  .map((d) => ({ ...d, title: `Degree Days ${d.label}` }));

export const indicatorsStore = (() => {
  const store = writable(DEFAULT_CLIMATE_INDICATOR);
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

export const frequencyList = [
  { id: "A", label: "Annually" },
  { id: "M", label: "Monthly" },
];

export const selectedMonthsStore = writable(DEFAULT_SELECTED_MONTHS);
