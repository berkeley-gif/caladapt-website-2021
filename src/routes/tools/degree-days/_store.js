import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";

// List of climvars used in Degree Days Tool
export const climvarList = climvars
  .filter(({ id }) => id === "tasmax")
  .map((d) => {
    const title = `Degree Days ${d.label}`;
    return { ...d, title };
  });

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

export const indicatorsStore = (() => {
  const store = writable("cdd");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived(store, ($store) => {
        const selected = climvarList.find(({ id }) => id === $store);
        return selected;
      });
    },
  };
})();
