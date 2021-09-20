import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_DURATION,
} from "./_constants";

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
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
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
    units: "days/yr",
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
    units: "days/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
  {
    id: "waves",
    label: "Heat Waves",
    title: "Number of Heat Wave Events per Year",
    helperText: `Number of heat wave events in a year when daily maximum temperatures are above a threshold temperature`,
    units: "events/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
];

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMATE_VARIABLE);
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
  const store = writable(DEFAULT_CLIMATE_INDICATOR);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived([climvarStore, store], ([$climvarStore, $store]) => {
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
    },
  };
})();

export const thresholdStore = writable(null);

export const thresholdListStore = (() => {
  let uid = 1;
  const store = writable([]);
  const { update, subscribe } = store;
  return {
    subscribe,
    reset(value, label) {
      update((store) => {
        const next = store.map((t) => {
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
      update((store) => {
        return [...store, thresh];
      });
    },
    remove(item) {
      update((store) => {
        return store.filter((t) => t.id !== item.id);
      });
    },
  };
})();

export const durationStore = writable(DEFAULT_DURATION);

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
          switch ($indicatorStore) {
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
