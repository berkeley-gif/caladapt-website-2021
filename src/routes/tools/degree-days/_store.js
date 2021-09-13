import { writable, derived } from "svelte/store";
import { scenarioList, boundaryList, climvarList } from "./_helpers";

export const indicatorsStore = (() => {
  const store = writable("cdd");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived(store, ($store) =>
        climvarList.find((d) => d.id === $store)
      );
    },
  };
})();

export const climvarStore = (() => {
  const store = writable("tasmax");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) =>
        climvarList.find((d) => d.id === $store)
      );
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
  const store = writable("HadGEM2-ES,CNRM-CM5");
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
    location: {
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
    },
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
        const selected = boundaryList.find((d) => d.id === $store.boundaryId);
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

// DERIVED STORES
// Query params store
// export const queryParams = derived(
//   // Question: should indicators (cdd/hdd) go here?
//   [unitsStore, locationStore, indicatorsStore],
//   ([$unitsStore, $locationStore, $indicatorsStore]) => {
//     const { boundaryId, location } = $locationStore;
//     const { imperial } = $unitsStore;
//     const { indicator } = $indicatorsStore;
//     const params = {
//       imperial,
//       indicator,
//     };
//     let method = "GET";
//     switch (boundaryId) {
//       case "locagrid":
//         params.g = `Point(${location.center[0]} ${location.center[1]})`;
//         break;
//       case "ca":
//         params.ref = "/media/ca.json";
//         params.stat = "mean";
//         break;
//       case "custom":
//         params.g = JSON.stringify(location.geometry);
//         params.stat = "mean";
//         method = "POST";
//         break;
//       default:
//         params.ref = `/api/${boundaryId}/${location.id}/`;
//         params.stat = "mean";
//     }
//     return { params, method };
//   }
// );

// Bookmark store
export const bookmark = derived(
  [
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    indicatorsStore,
  ],
  ([
    $climvarStore,
    $scenarioStore,
    $modelsStore,
    $unitsStore,
    $locationStore,
    $indicatorsStore,
  ]) => {
    const { location, boundaryId } = $locationStore;
    const { imperial } = $unitsStore;
    const [lng, lat] = location.center;
    if (boundaryId === "custom") {
      return "Cannot create a bookmark for an uploaded boundary";
    }
    return Object.entries({
      indicator: $indicatorsStore,
      climvar: $climvarStore,
      scenario: $scenarioStore,
      models: $modelsStore,
      imperial,
      lng,
      lat,
      boundary: boundaryId,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
);
