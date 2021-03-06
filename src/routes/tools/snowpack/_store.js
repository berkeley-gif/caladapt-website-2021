import { writable, derived } from "svelte/store";
import { range } from "d3-array";
import {
  scenarioList,
  boundaryList,
  climvarList,
  monthsList,
} from "./_helpers";

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

export const scenarioStore = (() => {
  const store = writable("rcp45");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get scenario() {
      return derived(store, ($store) => {
        const selected = scenarioList.find((d) => d.id === $store);
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

export const monthStore = (() => {
  const store = writable(3);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get month() {
      return derived(store, ($store) => {
        const selected = monthsList.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

// Ticks for time slider
export const timeTicksStore = writable(range(1950, 2100, 10));

// Overlay store
export const overlayStore = writable({
  url: "https://api.cal-adapt.org/api/series/swe_month_livneh/1960-1969/4.png?style=swe&scale=10",
  show: "false",
  coordinates: [
    [-124.60693359374999, 43.723474896114794],
    [-113.291015625, 43.723474896114794],
    [-113.291015625, 31.034108344903512],
    [-124.60693359374999, 31.034108344903512],
  ],
});

export const viewStore = writable("timeseries");

export const locationStore = (() => {
  const store = writable({
    lat: 38.59,
    lng: -122.46,
    boundaryId: "locagrid",
    location: {
      id: null,
      title: "850 Friesen Drive",
      address: "Angwin, California 94508, United States",
      geometry: {
        type: "Point",
        coordinates: [-122.4587538, 38.5903761],
      },
      center: [-122.4587538, 38.5903761],
      bbox: [-122.4587538, 38.5903761, -122.4587538, 38.5903761],
    },
    isUpload: false,
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location, isUpload = false) =>
      update((store) => {
        if (!location) return;
        store.lng = +location.center[0].toFixed(4);
        store.lat = +location.center[1].toFixed(4);
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
        const selected = boundaryList.find((d) => d.id === $store.boundaryId);
        return selected;
      });
    },
    get lngLat() {
      return derived(store, ($store) => {
        return [$store.lng, $store.lat];
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

// DERIVED STORES
// Query params store
export const queryParams = derived(
  [unitsStore, locationStore, monthStore],
  ([$unitsStore, $locationStore, $monthStore]) => {
    const { lng, lat, boundaryId, location } = $locationStore;
    const { imperial } = $unitsStore;
    const params = { months: $monthStore };
    let method = "GET";
    switch (boundaryId) {
      case "locagrid":
        params.g = `Point(${lng} ${lat})`;
        params.imperial = imperial;
        break;
      case "ca":
        params.ref = "/media/ca.json";
        params.stat = "mean";
        params.imperial = imperial;
        break;
      case "custom":
        params.g = JSON.stringify(location.geometry);
        params.stat = "mean";
        params.imperial = imperial;
        method = "POST";
        break;
      default:
        params.ref = `/api/${boundaryId}/${location.id}/`;
        params.stat = "mean";
        params.imperial = imperial;
    }
    return { params, method };
  }
);

// Bookmark store
export const bookmark = derived(
  [climvarStore, scenarioStore, modelsStore, unitsStore, locationStore],
  ([
    $climvarStore,
    $scenarioStore,
    $modelsStore,
    $unitsStore,
    $locationStore,
  ]) => {
    const { lng, lat, boundaryId } = $locationStore;
    const { imperial } = $unitsStore;
    const bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${$modelsStore}
    &imperial=${imperial}&lng=${lng}&lat=${lat}&boundary=${boundaryId}`;
    if (process.browser) {
      return `${window.location.href}?${bookmark}`;
    }
    return null;
  }
);
