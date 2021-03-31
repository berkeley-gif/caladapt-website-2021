import { writable, derived } from 'svelte/store';
import { rollup, range, max, sum } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import { serialize, groupConsecutiveDates } from '../../../helpers/utilities';
import { apiConfig } from '../../../helpers/api-config';

import { scenarioList, boundaryList, climvarList, seriesList } from './_helpers';

export const climvarStore = (() => {
  const store = writable('tasmax');
  const { set, subscribe, update } = store;
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
  const { set, subscribe, update } = store;
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
  const { set, subscribe, update } = store;
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

export const locationStore = (() => {
  const store = writable({
    lat: 38.59,
    lng: -122.46,
    boundaryId: 'locagrid',
    location: {
      id: null,
      title: '850 Friesen Drive',
      address: 'Angwin, California 94508, United States',
      geometry: {
        type: 'Point',
        coordinates: [
          -122.4587538,
          38.5903761
        ]
      },
      center: [
        -122.4587538,
        38.5903761
      ],
      bbox: [
        -122.4587538,
        38.5903761,
        -122.4587538,
        38.5903761
      ]
    },
    isUpload: false,
  });
  const { update, get, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location, isUpload=false) => update((store) => {
      if (!location) return;
      store.lng = +location.center[0].toFixed(4);
      store.lat = +location.center[1].toFixed(4);
      store.location = location;
      store.isUpload = isUpload;
      return store;
    }),
    updateBoundary: (val) => update((store) => {
      store.boundaryId = val;
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
  [unitsStore, locationStore],
  ([$unitsStore, $locationStore]) => {
  const { lng, lat, boundaryId, location, isUpload } = $locationStore;
  const { imperial } = $unitsStore;
  const params = {};
  let method = 'GET';
  switch (boundaryId) {
    case 'locagrid':
      params.g = `Point(${lng} ${lat})`;
      params.imperial = imperial;
      break;
    case 'ca':
      params.ref = '/media/ca.json';
      params.stat = 'mean';
      params.imperial = imperial;
      break;
    case 'custom':
      params.g = JSON.stringify(location.geometry);
      params.stat = 'mean';
      params.imperial = imperial;
      method = 'POST';
      break;
    default:
      params.ref = `/api/${boundaryId}/${location.id}/`;
      params.stat = 'mean';
      params.imperial = imperial;
  }
  return { params, method };
});

// Bookmark store
export const bookmark = derived(
  [climvarStore, scenarioStore, modelsStore, unitsStore, locationStore],
  ([$climvarStore, $scenarioStore, $modelsStore, $unitsStore, $locationStore]) => {
  const { lng, lat, boundaryId } = $locationStore;
  const { imperial } = $unitsStore;
  const bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${$modelsStore}
    &imperial=${imperial}&lng=${lng}&lat=${lat}&boundary=${boundaryId}`;
  if (process.browser) {
    return `${window.location.href}?${bookmark}`;
  }
  return null;
});
