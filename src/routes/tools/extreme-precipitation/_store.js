import { writable, derived } from "svelte/store";
//import { makeCustomWritableStore } from "../_common/stores";
import {
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_DURATION,
  DEFAULT_RETURN_PERIOD,
  DEFAULT_THRESHOLD_TYPE,
} from "./_constants";

import {
  calcHeatwaveCount,
  calcMaxDuration,
  calcDaysCount,
  groupDataByYear,
} from "./_data";

export const climvarStore = writable(DEFAULT_CLIMATE_VARIABLE);

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

export const thresholdStore = writable(null);

export const thresholdTypeStore = writable(DEFAULT_THRESHOLD_TYPE);

export const durationStore = writable(DEFAULT_DURATION);

export const intervalsStore = writable(DEFAULT_RETURN_PERIOD);

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
