import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  DEFAULT_SELECTED_MODEL_SINGLE,
  DEFAULT_SELECTED_MONTH,
  DEFAULT_SELECTED_DURATION,
  DEFAULT_SELECTED_YEAR,
  DEFAULT_CLIMVAR,
  MONTHS_LIST_ONE_INDEXED,
  TIME_DURATIONS,
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
  };
})();

export const modelSingleStore = writable(DEFAULT_SELECTED_MODEL_SINGLE);

export const durationStore = (() => {
  const store = writable(DEFAULT_SELECTED_DURATION);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get duration() {
      return derived(store, ($store) => {
        return TIME_DURATIONS.find((d) => d.id === $store);
      });
    },
  };
})();

export const yearStore = writable(DEFAULT_SELECTED_YEAR);
