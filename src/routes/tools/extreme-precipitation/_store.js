import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_DURATION,
  DEFAULT_THRESHOLD,
} from "./_constants";

import {
  calcHeatwaveCount,
  calcMaxDuration,
  calcDaysCount,
  groupDataByYear,
} from "./_data";

// export const climvarList = climvars
//   .filter((d) => CLIMATE_VARIABLES.includes(d.id))
//   .map((d) => {
//     return {
//       ...d,
//       label: "Extreme Precipitation Events",
//       title: "daily precipitation"
//     };
//   });

export const climvarStore = writable(DEFAULT_CLIMATE_VARIABLE);

// export const climvarStore = (() => {
//   const store = writable(DEFAULT_CLIMATE_VARIABLE);
//   const { set, subscribe } = store;
//   return {
//     set,
//     subscribe,
//     get climvar() {
//       return derived(store, ($store) => {
//         console.log('list', climvarList, $store);
//         return climvarList.find((d) => d.id === $store);
//       });
//     },
//   };
// })();

export const indicatorList = CLIMATE_INDICATORS;

export const indicatorStore = (() => {
  const store = writable(DEFAULT_CLIMATE_INDICATOR);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get indicator() {
      return derived(store, ($store) => {
        return indicatorList.find((d) => d.id === $store);
      });
    },
  };
})();

export const thresholdStore = writable(DEFAULT_THRESHOLD);

// export const thresholdListStore = (() => {
//   let uid = 1;
//   const store = writable([]);
//   const { update, subscribe } = store;
//   return {
//     subscribe,
//     reset(value, label) {
//       update((store) => {
//         const next = store.map((t) => {
//           if (t.label === label) {
//             t.value = value;
//           }
//           return t;
//         });
//         return next;
//       });
//     },
//     add(value, label = "") {
//       update((store) => {
//         if (store.find((d) => d.value === value)) return store;
//         const thresh = {
//           id: uid++,
//           label,
//           value,
//         };
//         return [...store, thresh];
//       });
//     },
//   };
// })();

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
