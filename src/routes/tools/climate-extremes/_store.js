import { writable, derived } from 'svelte/store';
import { scenarioList, boundaryList, climvarList } from './_helpers';

export const climvarStore = (() => {
  const store = writable('tasmax');
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, $store => {
        const selected = climvarList.find(d => d.id === $store);
        return selected;
      });
    },
  }
})();

export const scenarioStore = (() => {
  const store = writable('rcp45');
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get scenario() {
      return derived(store, $store => {
        const selected = scenarioList.find(d => d.id === $store);
        return selected;
      });
    },
  }
})();

export const modelsStore = (() => {
  const store = writable('HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5');
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get models() {
      return derived(store, $store => {
        const arr = $store.split(',');
        return arr;
      });
    },
  }
})();

export const periodStore = writable(100);

export const unitsStore = writable({ imperial: true });

export const doyStore = (() => {
  const store = writable('7/04');
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get doy() {
      return derived(store, ($store) => {
        return 180;
      });
    },
  }
})();

export const temperatureStore = writable(100);

export const stationStore = writable({
  title: 'Weather Station: Arcata Airport',
  address: 'Arcata, California',
  geometry: {
    type: 'Point',
    coordinates: [
      -124.109,
      40.978
    ]
  },
  center: [
    -124.109,
    40.978
  ],
  bbox: [
    -124.109,
    40.978,
    -124.109,
    40.978
  ],
  id: 31
});

export const locationStore = (() => {
  const store = writable({
    lat: 40.978,
    lng: -124.109,
    boundaryId: 'locagrid',
    location: {
      id: 31,
      title: 'Weather Station: Arcata Airport',
      address: 'Arcata, California',
      geometry: {
        type: 'Point',
        coordinates: [
          -124.109,
          40.978
        ]
      },
      center: [
        -124.109,
        40.978
      ],
      bbox: [
        -124.109,
        40.978,
        -124.109,
        40.978
      ],
    },
    isUpload: false,
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location) => update((store) => {
      if (!location) return;
      store.lng = +location.center[0].toFixed(4);
      store.lat = +location.center[1].toFixed(4);
      store.location = location;
      return store;
    }),
    get location() {
      return derived(store, $store => {
        return $store.location;
      });
    },
    get boundary() {
      return derived(store, $store => {
        const selected = boundaryList.find(d => d.id === $store.boundaryId);
        return selected;
      });
    },
    get lngLat() {
      return derived(store, $store => {
        return [$store.lng, $store.lat];
      });
    },
  }
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
  }
})();


// DERIVED STORES
// Query params store
export const queryParams = derived(
  [doyStore, stationStore, periodStore],
  ([$doyStore, $stationStore]) => {
    const { doy } = $doyStore;
    console.log('queryParams', doy);
    const params = {
      g: `POINT(${$stationStore.center[0]} ${$stationStore.center[1]})`,
      doy: 180,
    };
    let method = 'GET';
    return { params, method };
});

// Bookmark store
export const bookmark = derived(
  [climvarStore, scenarioStore, modelsStore, unitsStore, stationStore, doyStore, periodStore],
  ([$climvarStore, $scenarioStore, $modelsStore, $unitsStore, $stationStore, $doyStore, $periodStore]) => {
  const id = $stationStore.id;
  const { imperial } = $unitsStore;
  const { doy } = $doyStore;
  const bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${$modelsStore}
    &imperial=${imperial}&station=${id}&doy=${doy}`;
  if (process.browser) {
    return `${window.location.href}?${bookmark}`;
  }
  return null;
});
