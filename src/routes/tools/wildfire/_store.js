import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  DEFAULT_SELECTED_MODEL_SINGLE,
  DEFAULT_SELECTED_MONTH,
  DEFAULT_SELECTED_SIMULATION,
  DEFAULT_SELECTED_YEAR,
  DEFAULT_CLIMVAR,
  MONTHS_LIST_ONE_INDEXED,
  SIMULATIONS,
} from "./_constants";

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMVAR);
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
    get name() {
      return "climvarStore";
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
        const selected = MONTHS_LIST_ONE_INDEXED.find((d) => d.id === $store);
        return selected;
      });
    },
    get name() {
      return "monthStore";
    },
  };
})();

export const modelSingleStore = writable(DEFAULT_SELECTED_MODEL_SINGLE);

export const simulationStore = (() => {
  const store = writable(DEFAULT_SELECTED_SIMULATION);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get simulation() {
      return derived(store, ($store) => {
        return SIMULATIONS.find((d) => d.id === $store);
      });
    },
    get name() {
      return "simulationStore";
    },
  };
})();

export const yearStore = writable(DEFAULT_SELECTED_YEAR);

export const stateBoundaryStore = writable(null);
