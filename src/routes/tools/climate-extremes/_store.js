import { writable, derived } from 'svelte/store';
import { timeFormat, timeParse } from 'd3-time-format';
import { quantile } from 'd3-array';
import getBbox from '@turf/bbox';
import { scenarioList, climvarList, indicatorList } from './_helpers';

const numberFormat = timeFormat('%j');
const textFormat = timeFormat('%B %e');
const today = new Date();
const dateParse = timeParse('%Y-%m-%d'); 

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

export const thresholdStore = writable(100);

export const stationStore = (() => {
  const store = writable({
    geometry: {
      type: 'Point',
      coordinates: [
        -124.109,
        40.978
      ]
    },
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
  const { update, subscribe } = store;
  return {
    subscribe,
    updateStation: (station) => update((store) => {
      if (!station) return;
      store = station;
      store.lng = +station.geometry.coordinates[0].toFixed(4);
      store.lat = +station.geometry.coordinates[1].toFixed(4);
      store.bbox = getBbox(station.geometry);
      return store;
    }),
    get station() {
      return derived(store, $store => {
        return $store;
      });
    },
  }
})();

// Projections Data Store
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
export const observationsStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get observations() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store;
      });
    },
    get baseline() {
      return derived([dataStore, store], ([$dataStore, $store]) => {
        if (!$store || !$dataStore) return null;

        // Get start and end dates to filter observations for 30 day period
        const historical = $dataStore.find(d => d.key === 'historical');
        const { begin, end } = historical.returnlevels[0];
        const beginDate = dateParse(begin);
        const beginYear = +beginDate.getFullYear();
        const endDate = dateParse(end);
        const endYear = +endDate.getFullYear();

        // Filter by 30 day period around selected date
        const filterBy30DayPeriod = $store.filter(d => {
          const year = d.date.getFullYear();
          const s = new Date(beginDate.setYear(year));
          const e = new Date(endDate.setYear(year));
          if ((d.date.getTime() >= s.getTime()) && (d.date.getTime() <= e.getTime())) {
            return true;
          }
          return false;
        });

        // Filter by baseline period (30 years, e.g. 1991-2020)
        return filterBy30DayPeriod.filter(d => {
          if ((+d.date.getFullYear() >= beginYear) && (+d.date.getFullYear() <= endYear)) {
            return true;
          }
          return false;
        });
      });
    },
  }
})();

// Foreacst data Store
export const forecastStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get forecast() {
      return derived(store, ($store) => {
        if (!$store) return null;
        const formatData = $store.map(d => {
          const date = dateParse(d.startTime.substring(0, 10));
          const day = `${d.name} ${textFormat(date)}`;
          return { day, value: d.temperature };
        });
        return formatData;
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
      return derived(store, ($store) => {
        return $store;
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
      g: `POINT(${$stationStore.lng} ${$stationStore.lat})`,
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
