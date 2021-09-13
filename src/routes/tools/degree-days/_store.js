import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";

// List of climvars used in Annual Averages Tool
export const climvarList = climvars
  .filter((d) => ["tasmax", "tasmin", "pr"].includes(d.id))
  .map((d) => {
    const title = `Annual Average ${d.label}`;
    return { ...d, title };
  });

export const climvarStore = (() => {
  const store = writable("tasmax");
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
