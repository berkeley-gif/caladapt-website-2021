import { writable, derived } from 'svelte/store';
import { timeFormat } from 'd3-time-format';
import { scenarioList, climvarList, indicatorList } from './_helpers';

const numberFormat = timeFormat('%j');
const textFormat = timeFormat('%B %e');
const today = new Date();

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

export const unitsStore = writable({ imperial: true });

export const doyStore = (() => {
  const store = writable(today);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get doyNumber() {
      return derived(store, ($store) => {
        return +numberFormat($store);
      });
    },
    get doyText() {
      return derived(store, ($store) => {
        return textFormat($store);
      });
    },
  }
})();

export const temperatureStore = writable(100);

export const stationStore = writable({
  title: 'Arcata Airport',
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
  id: 31,
  properties: {
    name: 'Arcata Airport',
    usaf: 725945,
    wban: 24283,
    elevation_m: 61.0,
    icao: 'KACV',
    city: 'Arcata',
    climdiv: 1
  },
});

/*export const locationStore = (() => {
  const store = writable({
    lat: 40.978,
    lng: -124.109,
    boundaryId: 'locagrid',
    location: {
      id: 31,
      title: 'Arcata Airport',
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
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location) => update((store) => {
      if (!location) return;
      if (location.geometry) {
        store.lng = +location.geometry.coordinates[0].toFixed(4);
        store.lat = +location.geometry.coordinates[1].toFixed(4);  
      } else {
        store.lng = +location.center[0].toFixed(4);
        store.lat = +location.center[1].toFixed(4);  
      }
      store.location = location;
      return store;
    }),
    get location() {
      return derived(store, $store => {
        return $store.location;
      });
    },
  }
})();*/

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

// Observed Data Store
export const observedStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get observed() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store;
      });
    },
  }
})();

// Indicator Store
export const indicatorStore = (() => {
  const store = writable(indicatorList[0]);
  const { subscribe, update } = store;
  return {
    subscribe,
    updateIndicator: val => update(() => {
      return indicatorList.find(d => d.id === val);
    }),
    get indicator() {
      return derived([climvarStore, store], ([$climvarStore, $store]) => {
        const indicator = $store;
        if ($climvarStore === 'tasmin') {
          // Replace text 'Extreme Heat Days' text with 'Warm Nights'
/*          let helperText = indicator.helperText.replace('Days', 'Nights');
          helperText = helperText.replace('maximum', 'minimum');*/
          return {
            ...indicator,
            title: indicator.title.replace('Maximum', 'Minimum'),
            //helperText,
          }
        }
        return indicator;
      });
    },
  }
})();


// DERIVED STORES
// Query params store
export const queryParams = derived(
  [doyStore, stationStore],
  ([$doyStore, $stationStore]) => {
    const params = {
      g: `POINT(${$stationStore.geometry.coordinates[0]} ${$stationStore.geometry.coordinates[1]})`,
      doy: numberFormat($doyStore),
    };
    return { params, method: 'GET' };
});

// Bookmark store
export const bookmark = derived(
  [climvarStore, scenarioStore, modelsStore, unitsStore, stationStore, doyStore],
  ([$climvarStore, $scenarioStore, $modelsStore, $unitsStore, $stationStore, $doyStore]) => {
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
