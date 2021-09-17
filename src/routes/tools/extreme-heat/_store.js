import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";

import { RangeAvg, MonthsCount } from "~/components/tools/Stats";
import {
  LineAreaChart,
  ScatterChart,
  HeatmapChart,
} from "~/components/tools/Charts";

import {
  calcHeatwaveCount,
  calcMaxDuration,
  calcDaysCount,
  groupDataByYear,
} from "./_data";

export const climvarList = climvars
  .filter((d) => ["tasmax", "tasmin"].includes(d.id))
  .map((d) => {
    return {
      ...d,
      label: d.id === "tasmax" ? "Extreme Heat Days" : "Warm Nights",
    };
  });

// List of indicators (or chart views) used for Extreme Heat Tool
export const indicatorList = [
  {
    id: "frequency",
    label: "Frequency",
    title: "Number of Extreme Heat Days per Year",
    helperText: `Days in a year when daily maximum temperature is above a threshold temperature`,
    units: "days/year",
    decimals: 0,
    chartComponent: LineAreaChart,
    statsComponent: RangeAvg,
  },
  {
    id: "timing",
    label: "Timing",
    title: "Timing of Extreme Heat Days per Year",
    helperText: `Days in a year when the daily maximum temperature is above a threshold temperature`,
    units: "",
    decimals: 0,
    chartComponent: HeatmapChart,
    statsComponent: MonthsCount,
  },
  {
    id: "duration",
    label: "Duration",
    title: "Longest Stretch of Consecutive Extreme Heat Days per Year",
    helperText: `The longest stretch of consecutive days when daily maximum temperatures are above a threshold temperature`,
    units: "days/year",
    decimals: 0,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
  {
    id: "waves",
    label: "Heat Waves",
    title: "Number of Heat Wave Events per Year",
    helperText: `Number of heat wave events in a year when daily maximum temperatures are above a threshold temperature`,
    units: "events/year",
    decimals: 0,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
];

export const climvarStore = (() => {
  const store = writable("tasmax");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) => {
        return climvarList.find((d) => d.id === $store);
      });
    },
  };
})();

// Indicator Store
export const indicatorStore = (() => {
  const store = writable("frequency");
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    /*    get indicator() {
      return derived([climvarStore, store], ([$climvarStore, $store]) => {
        console.log('get indicator store')
        const selected = indicatorList.find((d) => d.id === $store);
        if ($climvarStore === "tasmin") {
          // Replace text 'Extreme Heat Days' text with 'Warm Nights'
          let helperText = selected.helperText.replace("Days", "Nights");
          helperText = helperText.replace("maximum", "minimum");
          return {
            ...selected,
            title: selected.title.replace("Extreme Heat Days", "Warm Nights"),
            helperText,
          };
        }
        return selected;
      });
    },*/
  };
})();

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
        });
        return next;
      });
    },
    add(value, label = "Custom") {
      const thresh = {
        id: uid++,
        label,
        value,
      };
      update((prev) => {
        return [...prev, thresh];
      });
    },
    remove(thresh) {
      update((prev) => {
        return prev.filter((t) => t !== thresh);
      });
    },
  };
})();

export const durationStore = writable(4);

// Data Store
export const dataStore = (() => {
  const store = writable({
    daily: null,
    annual: null,
  });
  const { update, subscribe } = store;
  return {
    subscribe,
    updateData: (data) =>
      update((store) => {
        if (!data) return;
        store.daily = data;
        store.annual = data.map((series) => groupDataByYear(series));
        return store;
      }),
    reset: () =>
      update((store) => {
        store.daily = null;
        store.annual = null;
        return store;
      }),
    get data() {
      return derived(
        [store, indicatorStore, durationStore],
        ([$store, $indicatorStore, $durationStore]) => {
          if (!store || !$store.daily) return null;
          switch ($indicatorStore.id) {
            case "frequency":
              return $store.annual.map((series) => calcDaysCount(series));
            case "duration":
              return $store.annual.map((series) => calcMaxDuration(series));
            case "waves":
              return $store.annual.map((series) =>
                calcHeatwaveCount(series, $durationStore)
              );
            default:
              return $store.daily;
          }
        }
      );
    },
  };
})();

// Bookmark store
export const indicator = derived(
  [climvarStore, indicatorStore],
  ([$climvarStore, $indicatorStore]) => {
    const selected = indicatorList.find((d) => d.id === $indicatorStore);
    if ($climvarStore === "tasmin") {
      // Replace text 'Extreme Heat Days' text with 'Warm Nights'
      let helperText = selected.helperText.replace("Days", "Nights");
      helperText = helperText.replace("maximum", "minimum");
      return {
        ...selected,
        title: selected.title.replace("Extreme Heat Days", "Warm Nights"),
        helperText,
      };
    }
    return selected;
  }
);
