import { writable, derived } from "svelte/store";
import scenarios from "~/helpers/climate-scenarios";
import boundaries from "~/helpers/mapbox-layers";
import { cloneDeep } from "~/helpers/utilities";

/**
 *
 * @param {*} defaultValue The value to initialize the writable store with
 * @param {Object} options - Optional properties to add to the store
 * @param {string} options.name – The name of writable store, useful for logging
 * @param {array} options.getters – Array of one or more objects describing a getter
 * @param {array} options.updaters – Array of one or more objects describing an update method
 * @returns A writable store compatible with svelte/store.writable
 */
export const makeCustomWritableStore = (defaultValue, options) => {
  const store = writable(defaultValue);
  const { set, subscribe } = store;
  const { name, getters, updaters } = options || {};

  const newStore = {
    set,
    subscribe,
    ...(name && {
      get name() {
        return name;
      },
    }),
  };

  // Set any custom getters on the store object.
  // Each getter must have two properties:
  // 1. the name of the getter, a string
  // 2. the getter function that receives the store's current value as a param
  if (Array.isArray(getters) && getters.length) {
    getters.forEach(({ name, getter }) => {
      Object.defineProperty(newStore, name, {
        get: function () {
          return derived(store, getter);
        },
      });
    });
  }

  // Set any custom updater methods on the store object.
  // Each updater must have two properties:
  // 1. the name of the updater method
  // 2. a curried function that updates the desired value and returns the store
  // e.g. (store) => (value) => store.update((s) => { s.foo = value; return s; })
  if (Array.isArray(updaters) && updaters.length) {
    updaters.forEach(({ name, update }) => {
      Object.defineProperty(newStore, name, {
        value: update(store),
      });
    });
  }

  return newStore;
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
        const boundaryType = $store.boundaryId;
        const location = $store.location;
        let selected;
        if (boundaryType === "custom" && "geometry" in location) {
          // NOTE: there is no "custom" boundary type in boundaries so we create it here.
          selected = cloneDeep(boundaries.find((d) => d.id === "locagrid"));
          selected.id = "custom";
          selected.source = {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { ...location.geometry },
            },
          };
        } else {
          selected = boundaries.find((d) => d.id === boundaryType);
        }
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
