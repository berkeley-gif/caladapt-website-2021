import { writable, derived } from "svelte/store";
import scenarios from "../../../helpers/climate-scenarios";
import boundaries from "../../../helpers/mapbox-layers";

const DEFAULT_LOCATION = {
  id: "37907",
  title: "240 32nd Street, Sacramento, California 95816",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-121.5, 38.625],
        [-121.4375, 38.625],
        [-121.4375, 38.5625],
        [-121.5, 38.5625],
        [-121.5, 38.625],
      ],
    ],
  },
  center: [-121.4688, 38.5938],
  bbox: [-121.5, 38.5625, -121.4375, 38.625],
};

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
    boundaryId: "locagrid",
    location: DEFAULT_LOCATION,
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
