import { writable, derived, readable } from "svelte/store";
import { timeFormat } from "d3-time-format";
import { timeDay } from "d3-time";
import { format } from "d3-format";
import { quantile, sort, extent } from "d3-array";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_PERCENTILES,
  DEFAULT_DAY,
} from "./_constants";

const numberFormat = timeFormat("%j");
const textFormat = timeFormat("%B %e");
const dateFormat = timeFormat("%B %-e, %Y");
const formatFn = format(".1f");

function formatRecord(d) {
  return {
    value: `${formatFn(d.value)}°F`,
    date: dateFormat(d.date),
  };
}

export const climvarList = climvars
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
  .map((d) => {
    const title = d.label;
    return { ...d, title };
  });

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMATE_VARIABLE);
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

export const forecastDate = readable(dateFormat(DEFAULT_DAY));

export const measuredDateRange = readable({
  start: timeFormat("%Y-%m-%d")(timeDay.offset(DEFAULT_DAY, -10)),
  end: timeFormat("%Y-%m-%d")(DEFAULT_DAY),
});

export const unitsStore = writable({ imperial: true });

export const extremesStore = writable("high");

export const doyStore = (() => {
  const store = writable(DEFAULT_DAY);
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
    get begin() {
      return derived(store, ($store) => {
        const rangeStart = timeDay.offset($store, -10);
        return textFormat(rangeStart);
      });
    },
    get end() {
      return derived(store, ($store) => {
        const rangeEnd = timeDay.offset($store, +10);
        return textFormat(rangeEnd);
      });
    },
  };
})();

export const thresholdStore = writable(100);

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

// Data Store for HadISD observations from Cal-Adapt API
export const hadisdStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get hadisdDateRange() {
      return derived(store, ($store) => {
        if (!$store) return null;
        const dateExtent = extent($store.values, (d) => d.date);
        return `${dateExtent[0].getFullYear()}-${dateExtent[1].getFullYear()}`;
      });
    },
    get gevisf() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store.returnLevels.gevisf;
      });
    },
  };
})();

export const forecastStore = writable(null);
export const measuredStore = writable(null);

// Data store for list of datasets used in the tool
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

export const threshCIStore = writable([]);

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
  [climvarStore, unitsStore, locationStore, doyStore, extremesStore],
  ([$climvarStore, $unitsStore, $locationStore, $doyStore, $extremesStore]) => {
    const id = $locationStore.id;
    const { imperial } = $unitsStore;
    const { doy } = $doyStore;
    return `climvar=${$climvarStore}&imperial=${imperial}&station=${id}&doy=${doy}&extremes=${$extremesStore}`;
  }
);

// Baseline store
export const baseline = derived(
  [doyStore, hadisdStore],
  ([$doyStore, $hadisdStore]) => {
    if (!doyStore || !$hadisdStore) return;
    // Filter by 20 day period around selected date
    const filterBy20DayPeriod = $hadisdStore.values.filter((d) => {
      const date = d.date.setHours(0, 0, 0);
      const year = d.date.getFullYear();
      const center = new Date(year, $doyStore.getMonth(), $doyStore.getDate());
      const left = timeDay.offset(center, -10);
      const right = timeDay.offset(center, 10);
      if (date >= left && date <= right) {
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
      const year = d.date.getFullYear();
      if (year >= 1991 && year <= 2020) {
        return true;
      }
      return false;
    });

    // Calculate percentiles from 30 year data
    const values = filteredData.map((d) => +d.value).sort();
    const stats = DEFAULT_PERCENTILES.map((d) => {
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
      percentiles: stats,
      dataExtent: extent(values),
    };
  }
);
