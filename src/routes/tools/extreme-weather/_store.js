import { writable, derived, readable } from "svelte/store";
import { timeFormat, timeParse } from "d3-time-format";
import { timeDay } from "d3-time";
import { format } from "d3-format";
import { quantile, sort } from "d3-array";
import getBbox from "@turf/bbox";
import { climvarList } from "./_helpers";

const numberFormat = timeFormat("%j");
const textFormat = timeFormat("%b %e");
const today = new Date();
const dateFormat = timeFormat("%b %e, %Y");

const percentiles = [1, 10, 90, 99];
const formatFn = format(".1f");

function formatRecord(d) {
  return {
    value: `${formatFn(d.value)} °F`,
    date: dateFormat(d.date),
  };
}

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

export const forecastDate = readable(dateFormat(today));

export const unitsStore = writable({ imperial: true });

export const extremesStore = writable("high");

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
  };
})();

export const thresholdStore = writable();

export const locationStore = (() => {
  const store = writable({
    title:
      "Weather Station at Fresno Yosemite International Airport, Fresno, CA",
    geometry: {
      type: "Point",
      coordinates: [-119.719, 36.78],
    },
    id: 11,
    properties: {
      name: "Fresno Yosemite International Airport",
      usaf: 723890,
      wban: 93193,
      elevation_m: 101.5,
      icao: "KFAT",
      city: "Fresno",
      climdiv: 5,
    },
    bbox: [-119.719, 36.78, -119.719, 36.78],
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location) =>
      update((store) => {
        if (!location) return;
        store = location;
        return store;
      }),
    get location() {
      return derived(store, ($store) => {
        return $store;
      });
    },
  };
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
  };
})();

// Observed Data Store
export const observationsStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get values() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store.values;
      });
    },
    get returnLevels() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store.returnLevels;
      });
    },
    get baseline() {
      return derived(store, ($store) => {
        if (!$store) return null;

        // Get start and end dates to filter observations for 20 day period
        const { begin, end } = $store.returnLevels;

        // Filter by 20 day period around selected date
        const filterBy20DayPeriod = $store.values.filter((d) => {
          const year = d.date.getFullYear();
          const s = new Date(year, begin.month, begin.day);
          const e = new Date(year, end.month, end.day);
          if (
            d.date.getTime() >= s.getTime() &&
            d.date.getTime() <= e.getTime()
          ) {
            return true;
          }
          return false;
        });

        // Calculate min max from entire historical record
        // for the 20 day period in each year
        const sorted = sort(filterBy20DayPeriod, (d) => +d.value);
        const recordLow = formatRecord(sorted[0]);
        const recordHigh = formatRecord(sorted[sorted.length - 1]);

        // Filter by baseline period (30 years, e.g. 1991-2020)
        const filteredData = filterBy20DayPeriod.filter((d) => {
          const year = +d.date.getFullYear();
          if (year >= begin.year && year <= end.year) {
            return true;
          }
          return false;
        });

        // Calculate percentiles from 30 year data
        const values = filteredData.map((d) => +d.value).sort();
        const statsBaseline = percentiles.map((d) => {
          return {
            percentile: d,
            label: `p${d}`,
            value: +formatFn(quantile(values, d / 100)),
          };
        });

        return {
          values: filteredData,
          low: recordLow,
          high: recordHigh,
          stats: statsBaseline,
        };
      });
    },
  };
})();

// Foreacst data Store
export const forecastStore = (() => {
  const store = writable(null);
  const { set, subscribe, update } = store;
  return {
    set,
    subscribe,
    reset: () =>
      update((store) => {
        store = null;
        return store;
      }),
    // get forecast() {
    //   return derived([climvarStore, store], ([$climvarStore, $store]) => {
    //     if (!$store) return null;
    //     if ($climvarStore.id === "tasmin") {
    //       return $store.filter((d) => d.isDaytime === false);
    //     }
    //     return $store.filter((d) => d.isDaytime === true);
    //   });
    // },
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
        return $store.map((d) => d.title);
      });
    },
  };
})();

// DERIVED STORES
// Query params store
export const queryParams = derived(
  [doyStore, locationStore, extremesStore],
  ([$doyStore, $locationStore, $extremesStore]) => {
    const params = {
      g: `POINT(${$locationStore.geometry.coordinates[0]} ${$locationStore.geometry.coordinates[1]})`,
      doy: numberFormat($doyStore),
      imperial: true,
      extype: $extremesStore,
    };
    return { params, method: "GET" };
  }
);

// Bookmark store
export const bookmark = derived(
  [climvarStore, unitsStore, locationStore, doyStore],
  ([$climvarStore, $unitsStore, $locationStore, $doyStore]) => {
    const id = $locationStore.id;
    const { imperial } = $unitsStore;
    const { doy } = $doyStore;
    const bookmark = `climvar=${$climvarStore}&imperial=${imperial}&station=${id}&doy=${doy}`;
    if (process.browser) {
      return `${window.location.href}?${bookmark}`;
    }
    return null;
  }
);

// Date range store
export const doyRange = derived(
  [doyStore, observationsStore],
  ([$doyStore, $observationsStore]) => {
    if (!doyStore || !$observationsStore) return;
    const { begin, end } = $observationsStore.returnLevels;
    const year = $doyStore.getFullYear();
    const currentYearBegin = new Date(year, begin.month, begin.day);
    const currentYearEnd = new Date(year, end.month, end.day);
    const n = timeDay.count(currentYearBegin, $doyStore);
    const m = timeDay.count($doyStore, currentYearEnd);
    return `${n} days before & ${m} days after`;
  }
);
