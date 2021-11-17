import { writable, derived } from "svelte/store";
import scenarios from "../../../helpers/climate-scenarios";
import boundaries from "../../../helpers/mapbox-layers";

/**
 *
 * @param {*} defaultValue The value to initialize the store with
 * @param {object} options name (string), getters (array), setters (array)
 * @returns A custom writable Svelte store object
 */
export const makeCustomWritableStore = (defaultValue, options) =>
  (() => {
    const store = writable(defaultValue);
    const { set, subscribe } = store;
    const { name, getters, updaters } = options;

    const newStore = {
      set,
      subscribe,
      // the name getter is useful for store logging
      ...(name && {
        get name() {
          return name;
        },
      }),
    };

    // Set any custom getters on the store object.
    // Each getter must have two properties:
    // 1. the name of the getter, a string
    // 2. a curried function that returns the getter function
    if (Array.isArray(getters) && getters.length) {
      getters.forEach((getter) => {
        Object.defineProperty(newStore, getter.name, {
          get: getter.getter(store),
        });
      });
    }

    // Set any custom updater methods on the store object.
    // Each updater must have two properties:
    // 1. the name of the updater method
    // 2. a curried function that updates the desired value and returns the store
    if (Array.isArray(updaters) && updaters.length) {
      updaters.forEach((updater) => {
        Object.defineProperty(newStore, updater.name, {
          value: updater.value(store),
        });
      });
    }

    return newStore;
  })();

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
