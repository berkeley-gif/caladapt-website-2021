import { writable, derived } from "svelte/store";
import scenarios from "../../../helpers/climate-scenarios";
import boundaries from "../../../helpers/mapbox-layers";

export const scenarioStore = (() => {
  const store = writable("rcp45");
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

export const modelsStore = writable([
  "HadGEM2-ES",
  "CNRM-CM5",
  "CanESM2",
  "MIROC5",
]);

export const unitsStore = writable({ imperial: true });

export const locationStore = (() => {
  const store = writable({
    boundaryId: null,
    location: null,
    isUpload: false,
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location, isUpload = false) =>
      update((store) => {
        if (!location) return;
        store.location = location;
        store.isUpload = isUpload;
        return store;
      }),
    updateBoundary: (val) =>
      update((store) => {
        store.boundaryId = val;
        return store;
      }),
    get location() {
      return derived(store, ($store) => {
        return $store.location;
      });
    },
    get boundary() {
      return derived(store, ($store) => {
        const selected = boundaries.find((d) => d.id === $store.boundaryId);
        return selected;
      });
    },
    get center() {
      return derived(store, ($store) => {
        return $store.center;
      });
    },
  };
})();

// Data Store
export const dataStore = writable(null);

// Datasets store
export const datasetStore = (() => {
  const store = writable([]);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get titles() {
      return derived(store, ($store) => {
        if (!$store || $store.length === 0) return [];
        return $store.map((d) => `${d.title} (${d.publisher})`);
      });
    },
  };
})();

// is a Network Request happening?
// used to display UI loading state to user
export const isFetchingStore = writable(false);
