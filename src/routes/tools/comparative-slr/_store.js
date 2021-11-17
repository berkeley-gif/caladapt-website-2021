import { writable, derived } from "svelte/store";

export const floodScenarioStore = (() => {
  const store = writable("Max");
  const { set, subscribe } = store;

  return {
    set,
    subscribe,
    get name() {
      return "scenarioStore";
    },
  };
})();

export const timeFrameStore = (() => {
  const store = writable([2020, 2040]);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get label() {
      return derived(store, ($store) => {
        return $store.join("–");
      });
    },
    get name() {
      return "timeFrameStore";
    },
  };
})();

export const dataLayersStore = (() => {
  const store = writable(["CosMoS", "CalFlod3D"]);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get name() {
      return "dataLayerStore";
    },
  };
})();
