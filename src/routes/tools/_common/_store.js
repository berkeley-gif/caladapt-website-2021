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

export const modelsStore = (() => {
  const store = writable("HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get models() {
      return derived(store, ($store) => {
        const arr = $store.split(",");
        return arr;
      });
    },
  };
})();

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
        console.log("from store id", val);
        console.log(boundaries.find((d) => d.id === val));
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
        console.log("from store selected", selected);
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
export const dataStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get data() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store;
      });
    },
  };
})();

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
