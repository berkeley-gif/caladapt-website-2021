import { writable, derived } from "svelte/store";
import { range } from "d3-array";
import { climvarList, monthsList } from "./_helpers";
import { DEFAULT_SELECTED_MONTH, DEFAULT_CLIMVAR } from "./_constants";

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMVAR);
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

export const monthStore = (() => {
  const store = writable(DEFAULT_SELECTED_MONTH);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get month() {
      return derived(store, ($store) => {
        const selected = monthsList.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

// Ticks for time slider
export const timeTicksStore = writable(range(1950, 2100, 10));

// Overlay store
export const overlayStore = writable({
  url: "https://api.cal-adapt.org/api/series/swe_month_livneh/1960-1969/4.png?style=swe&scale=10",
  show: "false",
  coordinates: [
    [-124.60693359374999, 43.723474896114794],
    [-113.291015625, 43.723474896114794],
    [-113.291015625, 31.034108344903512],
    [-124.60693359374999, 31.034108344903512],
  ],
});
