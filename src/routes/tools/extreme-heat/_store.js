import { writable, derived } from 'svelte/store';
import { rollup, range, max, sum } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import { groupConsecutiveDates } from '../../../helpers/utilities';

import scenarioList from '../../../helpers/climate-scenarios';
import boundaryList from '../../../helpers/mapbox-layers';
import { climvarList, indicatorList } from './_helpers';

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

export const thresholdStore = writable();

export const thresholdListStore = (() => {
  let uid = 1;
  const store = writable([]);
  const { update, subscribe } = store;
  return {
    subscribe,
    reset(value, label) {
      update((prev) => {
        const next = prev.map((t) => {
          if (t.label === label) {
            t.value = value;
          }
          return t;
        })
        return next;
      })      
    },
    add(value, label='Custom') {
      const thresh = {
        id: uid++,
        label,
        value,
      };
      update((prev) => {
        return [...prev, thresh]  
      })    
    },
    remove(thresh) {
      update((prev) => {
        return prev.filter(t => t !== thresh);
      })
    },
  }
})();

// export function createThresholdListStore(initialValue = []) {
//   let uid = 1;
//   const { subscribe, update } = writable(initialValue.map((t) => {
//     t.id = uid++;
//     return t;
//   }));
//   return {
//     subscribe,
//     update(value, label) {
//       update((prev) => {
//         const next = prev.map((t) => {
//           if (t.label === label) {
//             t.value = value;
//           }
//           return t;
//         })
//         return next;
//       })      
//     },
//     add(value, label='Custom') {
//       const thresh = {
//         id: uid++,
//         label,
//         value,
//       };
//       update((prev) => {
//         return [...prev, thresh]  
//       })    
//     },
//     remove(thresh) {
//       update((prev) => {
//         return prev.filter(t => t !== thresh);
//       })
//     },
//   };
// }

export const periodStore = writable(4);

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
    }
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (loc) => update((store) => {
      if (!loc) return;
      store.lng = +loc.center[0].toFixed(4);
      store.lat = +loc.center[1].toFixed(4);
      store.location = loc;
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
          let helperText = indicator.helperText.replace('Days', 'Nights');
          helperText = helperText.replace('maximum', 'minimum');
          return {
            ...indicator,
            title: indicator.title.replace('Extreme Heat Days', 'Warm Nights'),
            helperText,
          }
        }
        return indicator;
      });
    },
  }
})();

// Functions for reformatting data for different chart views
const countByYear = (series) => {
  let yearRange;
  if (series.key === 'observed') {
    yearRange = range(1950, 2006);
  } else {
    yearRange = range(1950, 2100);
  }
  const counts = rollup(series.values, v => v.length, d => d.date.getFullYear());
  return {
    ...series,
    values: yearRange.map(year => ({ date: new Date(year, 0, 1), value: counts.get(year) || 0 })),
  };
};

const longestByYear = (series) => {
  let yearRange;
  if (series.key === 'observed') {
    yearRange = range(1950, 2006);
  } else {
    yearRange = range(1950, 2100);
  }
  const daysByYear = rollup(series.values, v => v, d => d.date.getFullYear());
  const values = [];
  yearRange.forEach((year) => {
    let duration = 0;
    if (daysByYear.has(year)) {
      const arr = daysByYear.get(year);
      const groupedDates = groupConsecutiveDates(arr);
      const groupLengths = groupedDates.map(arr => arr.length);
      duration = max(groupLengths);    
    }
    values.push({ date: new Date(year, 0, 1), value: duration })
  });
  return {
    ...series,
    values,
  }
}

const heatwaveByYear = (series, period) => {
  let yearRange;
  if (series.key === 'observed') {
    yearRange = range(1950, 2006);
  } else {
    yearRange = range(1950, 2100);
  }
  const daysByYear = rollup(series.values, v => v, d => d.date.getFullYear());
  const values = [];
  yearRange.forEach((year) => {
    let count = 0;
    if (daysByYear.has(year)) {
      const arr = daysByYear.get(year);
      const groupedDates = groupConsecutiveDates(arr);
      const groupCounts = groupedDates.map(arr => Math.floor(arr.length / period));
      count = sum(groupCounts);
    }
    values.push({ date: new Date(year, 0, 1), value: count })
  });
  return {
    ...series,
    values,
  }
}

const dailyHeatmap = (series) => {
  const dayNumberFormat = timeFormat('%j');
  return {
    ...series,
    values: series.values.map(d => ({ ...d, day: +dayNumberFormat(d.date) })),
  }
}

// Data Store
export const dataStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get data() {
      return derived(
        [store, indicatorStore, periodStore],
        ([$store, $indicatorStore, $periodStore]) => {
        if (!$store) return null;
        switch ($indicatorStore.id) {
          case 'frequency':
            return $store.map((series) => countByYear(series));
          case 'duration':
            return $store.map((series) => longestByYear(series));
          case 'waves':
            return $store.map((series) => heatwaveByYear(series, $periodStore));
          case 'timing':
            return $store.map((series) => dailyHeatmap(series));
          default:
            return $store;
        }
      });
    },
  }
})();


// DERIVED STORES
// Query params store
export const queryParams = derived(
  [unitsStore, locationStore],
  ([$unitsStore, $locationStore]) => {
  const { lng, lat, boundaryId } = $locationStore;
  const id = $locationStore.location.id;
  const { imperial } = $unitsStore;
  const params = {};
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
    default:
      params.ref = `/api/${boundaryId}/${id}/`;
      params.stat = 'mean';
      params.imperial = imperial;
  }
  return params;
});

// Bookmark store
export const bookmark = derived(
  [climvarStore, scenarioStore, modelsStore, unitsStore, locationStore, thresholdStore, periodStore],
  ([$climvarStore, $scenarioStore, $modelsStore, $unitsStore, $locationStore, $thresholdStore, $periodStore]
) => {
  const { lng, lat, boundaryId } = $locationStore;
  const { imperial } = $unitsStore;
  const { threshold } = $thresholdStore;
  const period = $periodStore;
  const bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${$modelsStore}
    &imperial=${imperial}&lng=${lng}&lat=${lat}&boundary=${boundaryId}&period=${period}&thresh=${threshold}`
  if (process.browser) {
    return `${window.location.href}?${bookmark}`;
  }
  return null;
});
